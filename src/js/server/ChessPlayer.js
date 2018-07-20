'use strict';
import CON from './../ConEnum'
import Timer from './../Timer'
import util from './../util'

var ChessPlayer = (function() {
	/**
	 * 服务器端工兵抗军旗玩家类
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 * @param {String} name
	 */
	function ChessPlayer(name) {
		this.name = name || ""; //玩家名称

		this.socket = null; //该玩家socket，用于向玩家发送消息
		this.userInfo = null; //用户信息
		this.logindUser = null; //登录用户的信息
		this.room = null; //玩家的所属房间
		this.lastRoomId = 0; //上一次分房时的房间id

		this.sourceLoc = -1; //玩家选择棋子的源位置
		this.targetLoc = -1; //玩家选择的目标位置
		this.selectChessArr = []; //玩家选择的棋子数组
		this.isPlaying = false; //当前是否是该玩家下棋
		this.camp = CON.CAMP.neutral; //玩家的阵营
		this.status = CON.PLAYER_STATUS.undistributed; //玩家的状态
		this.victory = CON.VICTORY_STATUS.playing; //玩家的胜负状态
		this.connect = CON.LOGINS_TATUS.connect; //玩家的网络链接状态
		this.disconnTimeCount = 0; //玩家断开网络连接计时
		this.readyTimeCount = 0; //玩家准备时间计时
		this.timeoutCount = 0; //玩家超时次数计数

		this.timer = new Timer(name); //定时器
		this.isSuePeace = false; //玩家是否求和
		this.lastIsFristHand = true; //玩家先后手
		
	}
	/**
	 * 玩家类的简写属性对应表
	 */
	ChessPlayer.prototype.simpleFiledMap = {
		"name": "n",
		"isPlaying": "isp",
		"camp": "c",
		"victory": "vs",
		"status": "s",
		"connect": "con",
		"disconnTimeCount": "dtc",
		"readyTimeCount": "rtc",
		"timeoutCount": "toc",

		"n": "name",
		"isp": "isPlaying",
		"c": "camp",
		"vs": "victory",
		"s": "status",
		"con": "connect",
		"dtc": "disconnTimeCount",
		"rtc": "readyTimeCount",
		"toc": "timeoutCount"
	};
	/**
	 * 创建玩家
	 * @static
	 * @param {String} playerName 玩家名称
	 * @param {Object} playerStatus 玩家状态
	 * @param {Object} userInfo 玩家信息
	 * @return {ChessPlayer}
	 */
	ChessPlayer.createPlayer = function(playerName, playerStatus, userInfo) {
		let player = new ChessPlayer();
		player.name = playerName;
		if(playerStatus) {
			player.initStatus(playerStatus);
		}
		if(userInfo) {
			player.setUserInfo(userInfo);
		}
		return player;
	};

	/**
	 * 初始化一些字段
	 */
	ChessPlayer.prototype.initFileds = function() {
		this.sourceLoc = -1;
		this.targetLoc = -1;
		this.selectChessArr = [];
		this.isPlaying = false;
		this.camp = CON.CAMP.neutral;
		this.status = CON.PLAYER_STATUS.undistributed;
		this.victory = CON.VICTORY_STATUS.playing;
		this.connect = CON.LOGINS_TATUS.connect;
		this.disconnTimeCount = 0;
		this.readyTimeCount = 0;
	};

	/**
	 * 获取玩家的当前状态,key为简写属性
	 * @return {Object}
	 */
	ChessPlayer.prototype.getPlayerStatus = function() {
		let palyerStatus = {};
		let player = this;
		["name", "isPlaying", "camp", "victory", "status", "connect", "disconnTimeCount", "readyTimeCount", "timeoutCount"].forEach(function(filed) {
			let simpleFiled = player.simpleFiledMap[filed];
			palyerStatus[simpleFiled] = player[filed];
		})
		return palyerStatus;
	}

	ChessPlayer.prototype.getPlayerInfo = function() {
		return this.userInfo;
	}

	/**
	 * 初始化玩家的选择的装太
	 */
	ChessPlayer.prototype.initSelectStatus = function() {
		this.sourceLoc = -1;
		this.targetLoc = -1;
		this.selectChessArr = [];
	};

	ChessPlayer.prototype.sendPlayerStatus = function() {
		this.socket.emit("playerStatus", this.getPlayerStatus());
	}

	ChessPlayer.prototype.sendRoomState = function() {
		if(!this.room) {
			return;
		}

		this.sendMessage("roomStatus", this.room.getRoomStatus());
	}

	/**
	 * 向玩家的客户端发送数据
	 * @param {String} event 事件名称
	 * @param {Object} data 数据
	 */
	ChessPlayer.prototype.sendMessage = function(event, data) {
		if(this.socket) {
			this.socket.emit(event, data);
		}
	}

	/**
	 * 玩家登陆后的初始化
	 */
	ChessPlayer.prototype.login = function() {
		this.connect = CON.CONNECT_STATUS.connect;
		this.clearTimer();

		if(this.room) {
			this.room.playerConn(this);
		}
	}

	/**
	 * 玩家进入房间后的状态设置
	 * @param {Object} room 进入的房间
	 */
	ChessPlayer.prototype.enterRoom = function(room) {
		this.room = room;
		this.lastRoomId = room.id;
		this.initFileds();
		this.status = CON.PLAYER_STATUS.notReady;
		this.isSuePeace = false;
		this.setReadyTimer();
	}

	/**
	 * 玩家离开房间后的状态设置
	 */
	ChessPlayer.prototype.leaveRoom = function() {
		this.room = null;
		this.initFileds();
		this.clearTimer();
	}

	/**
	 * 玩家准备后德尔状态设置
	 */
	ChessPlayer.prototype.ready = function() {
		this.status = CON.PLAYER_STATUS.ready;
		if(this.room) {
			this.room.playerReady(this);
		}
		this.clearTimer();
	}

	/**
	 * 玩家取消准备后的状态设置
	 */
	ChessPlayer.prototype.notReady = function() {
		this.status = CON.PLAYER_STATUS.notReady;
		if(this.room) {
			this.room.playerNotReady(this);
		}
		this.setReadyTimer();
	};

	/**
	 * 游戏开始时的状态设置
	 */
	ChessPlayer.prototype.gameStart = function() {
		this.initFileds();
		this.timeoutCount = 0;
		this.isSuePeace = false;
		this.status = CON.PLAYER_STATUS.gameStart;
	};

	/**
	 * 玩家翻开棋子
	 * @param {Number} loc 翻开棋子的位置
	 */
	ChessPlayer.prototype.overChess = function(loc) {
		this.sourceLoc = loc;
		if(this.room) {
			this.room.playerOverChess(this);
		}
	}

	/**
	 * 玩家移动棋子
	 * @param {Object} moveChess 移动棋子的描述对象
	 */
	ChessPlayer.prototype.moveChess = function(moveChess) {
		this.sourceLoc = moveChess.sl;
		this.targetLoc = moveChess.tl;
		this.selectChessArr = moveChess.seA;
		if(this.room) {
			this.room.playerMoveChess(this);
		}
	}

	/**
	 * 游戏结束时设置状态
	 * @param {Number} victoryStatus 房间的胜负状态
	 */
	ChessPlayer.prototype.gameOver = function(victoryStatus) {
		let VICTORY_STATUS = CON.VICTORY_STATUS;
		let myVictory = VICTORY_STATUS.playing;
		if(this.camp === CON.CAMP.blue) {
			if(victoryStatus === VICTORY_STATUS.draw) {
				myVictory = VICTORY_STATUS.draw;
			}
			if(victoryStatus === VICTORY_STATUS.bluewin) {
				myVictory = VICTORY_STATUS.win;
			}
			if(victoryStatus === VICTORY_STATUS.redwin) {
				myVictory = VICTORY_STATUS.lose;
			}
		} else {
			if(victoryStatus === VICTORY_STATUS.draw) {
				myVictory = VICTORY_STATUS.draw;
			}
			if(victoryStatus === VICTORY_STATUS.bluewin) {
				myVictory = VICTORY_STATUS.lose;
			}
			if(victoryStatus === VICTORY_STATUS.redwin) {
				myVictory = VICTORY_STATUS.win;
			}
		}
		this.initFileds();
		this.status = CON.PLAYER_STATUS.gameOver;
		this.victory = myVictory;

		this.setReadyTimer();
	};

	/**
	 * 玩家断开连接时
	 */
	ChessPlayer.prototype.disconnecting = function() {
		this.connect = CON.LOGINS_TATUS.disconnect;
		if(this.room) {
			this.room.playerDisconnecting(this);
		}
	}

	/**
	 * 设置玩家断开连接计时
	 * @param {Function} callback 玩家超过时间后回调
	 */
	ChessPlayer.prototype.setDisconnTimer = function(callback) {
		let player = this,
			room = this.room;
		this.timer.clear();
		this.disconnecting();
		if(player.status === CON.PLAYER_STATUS.gameStart) {
			this.timer.init({
				repeatCount: 90000,
				intervalTime: 1000,
				delayTime: 0,
				currentCount: 0,
				timingStartFun: function() {
					player.disconnTimeCount = 0;
				},
				timingFun: function() {
					player.disconnTimeCount++;
					player.disconnecting();
				},
				timingEndFun: function() {
					room.playerDisconn(player);
					if(callback) {
						callback();
					}
				}
			}).start();
		} else {
			if(callback) {
				callback();
			}
		}
	}

	/**
	 * 设置玩家准备时的定时器
	 */
	ChessPlayer.prototype.setReadyTimer = function() {
		let player = this,
			room = this.room;
		this.timer.clear();
		if(player.status === CON.PLAYER_STATUS.notReady ||
			player.status === CON.PLAYER_STATUS.gameOver) {
			this.timer.init({
				repeatCount: 30,
				intervalTime: 1000,
				delayTime: 0,
				currentCount: 0,
				timingStartFun: function() {
					player.readyTimeCount = 30;
				},
				timingFun: function() {
					player.readyTimeCount--;
					room.sendMessageToAll("readyingTime", {
						pn: player.name,
						rtc: player.readyTimeCount
					});
				},
				timingEndFun: function() {
					if(room) {
						room.playerLeaveRoom(player);
					}
				}
			}).start();
		}
	}

	/**
	 * 清空该玩家的所有定时器
	 */
	ChessPlayer.prototype.clearTimer = function() {
		this.timer.clear();
	}

	/**
	 * 玩家销毁
	 */
	ChessPlayer.prototype.destroy = function() {
		this.timer.cancel();
		if(this.room) {
			this.room.playerLeaveRoom(this);
		}
	}

	/**
	 * 玩家认输
	 */
	ChessPlayer.prototype.giveUp = function() {
		if(this.room) {
			this.room.playerGiveUp(this);
		}
	}

	/**
	 * 玩家求和
	 * @param {Boolean} isSuePeace 求和结果
	 * @param {Boolean} isRequest  是否请求求和
	 */
	ChessPlayer.prototype.suePeace = function(isSuePeace, isRequest) {
		if(this.room) {
			this.isSuePeace = isSuePeace;
			this.room.playerSuePeace(this, isRequest);
		}
	}

	ChessPlayer.prototype.chat = function(chatMsg) {
		if(this.room) {
			this.room.playerChat(this, chatMsg);
		}
	}

	return ChessPlayer;
}());

export default ChessPlayer;