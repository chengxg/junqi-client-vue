'use strict';
import CON from './../../ConEnum'
import Timer from './../../../Timer'
import util from './../../../util'
import Player from './ChessPlayer'
import rules from './../../rule/rules'

var ChessRoom = (function() {
	/**
	 * 工兵抗军旗 房间类
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 * @param {Number} id
	 * @param {ChessServer} server
	 */
	function ChessRoom(id, server) {
		Object.defineProperty(this, "server", {
			value: server,
			enumerable: false,
			writable: false
		});
		this.id = id; //房间的id
		this.isFriendRoom = false; //是否是好友房间
		this.roomPwd = null; //好友房间的密码
		this.rule = rules.rule1; //该房间的规则

		this.player1 = null; //房间的第一位玩家
		this.player2 = null; //房间的第二位玩家

		this.hostPlayer = null; //房间的当前下棋者
		this.victory = CON.VICTORY_STATUS.playing; //房间的胜负状态
		this.status = CON.ROOM_STATUS.waitPlayer; //房间的状态

		this.createChessArr = []; //创建棋盘的数组
		this.chessboard = []; //存储棋盘的数组
		this.stepNum = 0; //当前走棋步数

		this.hostPlayerTimeCount = 0; //当前下棋者计时

		this.timer = new Timer("r" + id); //房间的定时器
		this.maxPlayingTime = 30000; //主场玩家最大等待时间
		this.maxOutTimeCount = 1000; //玩家的最大超时次数
	}
	/**
	 * 房间属性字段的简写对应表
	 */
	ChessRoom.prototype.simpleFiledMap = {
		"createChessArr": "cca",
		"chessboard": "cb",
		"stepNum": "sn",
		"victory": "vs",
		"status": "s",
		"hostPlayerTimeCount": "hptc",
		"id": "id",
		"cca": "createChessArr",
		"cb": "chessboard",
		"sn": "stepNum",
		"vs": "victory",
		"s": "status",
		"hptc": "hostPlayerTimeCount",
		"p1s": "player1Status",
		"p2s": "player2Status",
		"hpn": "hostPlayerName",
		"ru": "rule.name"
	};

	/**
	 * 初始化房间的状态
	 */
	ChessRoom.prototype.initStatusFiled = function() {
		this.stepNum = 0; //当前走棋步数
		this.victory = CON.VICTORY_STATUS.playing;
		this.status = CON.ROOM_STATUS.waitplayer;
		this.createChessArr = [];
		this.no = 0;
		this.chessboard = [];
		this.hostPlayer = null;
		this.hostPlayerTimeCount = 0;
	};

	/**
	 * 得到房间的状态，字段key为简写属性
	 * @return {Object}
	 */
	ChessRoom.prototype.getRoomStatus = function() {
		let roomStatus = {};
		let room = this;

		["createChessArr", "chessboard", "stepNum", "victory", "status", "hostPlayerTimeCount", "id"].forEach(function(filed) {
			let simpleFiled = room.simpleFiledMap[filed];
			roomStatus[simpleFiled] = room[filed];
		});
		if(this.player1) {
			roomStatus["p1s"] = this.player1.getPlayerStatus();
		}
		if(this.player2) {
			roomStatus["p2s"] = this.player2.getPlayerStatus();
		}
		roomStatus["ru"] = this.rule.name;
		return roomStatus;
	}

	/**
	 * 销毁房间
	 */
	ChessRoom.prototype.destroyRoom = function() {
		if(this.player1) {
			this.player1.leaveRoom();
		}
		if(this.player2) {
			this.player2.leaveRoom();
		}
		this.initStatusFiled();
	};

	/**
	 * 设置游戏规则
	 * @param {String} ruleName
	 */
	ChessRoom.prototype.setRoomRule = function(ruleName) {
		if(ruleName in rules) {
			this.rule = rules[ruleName];
		}
	};

	/**
	 * 得到该玩家的对手
	 * @param {Player} player
	 * @return {Player} player
	 */
	ChessRoom.prototype.getOppositePlayer = function(player) {
		if(player == this.player1) {
			return this.player2;
		} else {
			return this.player1;
		}
	};

	/**
	 * 通过名称得到玩家
	 * @param {String} playerName
	 * @return {ChessPlayer}
	 */
	ChessRoom.prototype.getPlayerByName = function(playerName) {

		if(this.player1) {
			if(this.player1.name === playerName) {
				return this.player1;
			}
		}
		if(this.player2) {
			if(this.player2.name === playerName) {
				return this.player2;
			}
		}
		return null;
	};
	/**
	 * 设置当前下棋者
	 * @param {String} hostPlayerName
	 */
	ChessRoom.prototype.setHostPlayer = function(player) {
		if(!player) {
			return;
		}
		let oppPlayer = this.getOppositePlayer(player);
		if(!oppPlayer) {
			return;
		}
		player.isPlaying = true;
		oppPlayer.isPlaying = false;
		this.hostPlayer = player;
	};

	/**
	 * 交换 主场玩家
	 */
	ChessRoom.prototype.changeHostPlayer = function() {
		if(!this.hostPlayer) {
			return;
		}
		let oppPlayer = this.getOppositePlayer(this.hostPlayer);
		this.setHostPlayer(oppPlayer);
	}

	/**
	 * 设置先后手
	 */
	ChessRoom.prototype.setPlayerFirstHand = function() {
		if(!(this.player1 || this.player2)) {
			return;
		}
		let isPlayer1First = true;

		//异或
		if(this.player1.lastIsFristHand ^ this.player2.lastIsFristHand) {
			isPlayer1First = !isFirstHand1;
		} else {
			if(Math.random() > 0.5) {
				isPlayer1First = true;
			} else {
				isPlayer1First = false;
			}
		}
		if(isPlayer1First) {
			this.setHostPlayer(this.player1);
		} else {
			this.setHostPlayer(this.player2);
		}
	}

	/**
	 * 指定 该玩家胜利
	 * @param {ChessPlayer} 指定的玩家
	 */
	ChessRoom.prototype.setPlayerVictory = function(player) {
		switch(player.camp) {
			case CON.CAMP.red:
				this.victory = CON.VICTORY_STATUS.redwin;
				break;
			case CON.CAMP.blue:
				this.victory = CON.VICTORY_STATUS.bluewin;
				break;
			default:
				this.victory = CON.VICTORY_STATUS.draw;
		}
		this.gameOver();
	}

	/**
	 * 游戏开始时初始化棋盘
	 */
	ChessRoom.prototype.initChessboard = function() {
		let rule = this.rule;

		this.createChessArr = util.clone(rule.allChessArr);
		this.shuffle(this.createChessArr);

		let cover = rule.chessType.cover,
			POSITION_GRAPH = CON.POSITION_GRAPH;
		for(let i = 0; i < 60; i++) {
			if(POSITION_GRAPH[i].length < 8) {
				this.chessboard[i] = [cover]; //全部设置为未翻开状态
			} else {
				this.chessboard[i] = [0];
			}
		}
	};
	ChessRoom.prototype.initTestChessboard = function() {
		let rule = this.rule;

		this.createChessArr = util.clone(rule.allChessArr);
		let cover = rule.chessType.cover,
			POSITION_GRAPH = CON.POSITION_GRAPH;
		for(let i = 0; i < 60; i++) {
			if(POSITION_GRAPH[i].length < 8) {
				let no = Math.floor(Math.random() * this.createChessArr.length);
				let chess = this.createChessArr[no];
				this.createChessArr.splice(no, 1);
				this.chessboard[i] = [chess]; //全部设置为未翻开状态
			} else {
				this.chessboard[i] = [0];
			}
		}
		this.chessboard[0] = [0];
		this.chessboard[1] = [0];
		this.chessboard[2] = [0];
		this.chessboard[3] = [0];
		this.chessboard[10] = [500];
		this.chessboard[11] = [500];
	};

	/**
	 * 打乱棋子
	 * @param {Array} input
	 * @return {Array}
	 */
	ChessRoom.prototype.shuffle = function(input) {
		for(let i = input.length - 1; i >= 0; i--) {
			let randomIndex = Math.floor(Math.random() * (i + 1));
			let itemAtIndex = input[randomIndex];
			input[randomIndex] = input[i];
			input[i] = itemAtIndex;
		}
		return input;
	}

	/**
	 * 得到当前 下棋者
	 * @return {ChessPlayer}
	 */
	ChessRoom.prototype.getHostPlayer = function() {
		return this.hostPlayer;
	}

	/**
	 * 发送消息到对手
	 * @param {ChessPlayer} player
	 * @param {String} event
	 * @param {Object} data
	 */
	ChessRoom.prototype.sendMessageToOpposite = function(player, event, data) {
		let oppPlayer = this.getOppositePlayer(player);
		if(oppPlayer) {
			oppPlayer.sendMessage(event, data);
		}
	}

	/**
	 * 向房间中的所有人发送消息
	 * @param {String} event
	 * @param {Object} data
	 */
	ChessRoom.prototype.sendMessageToAll = function(event, data) {
		let player1 = this.player1;
		let player2 = this.player2;
		if(player1) {
			player1.sendMessage(event, data);
		}
		//两个玩家同属一个客户端，只需发送一次
		/*if(player2) {
			player2.sendMessage(event, data);
		}*/
	}

	/**
	 * 分配玩家 到房间
	 * @param {ChessPlayer} player 将要分配的玩家
	 * @return {Boolean} 是否分配成功
	 */
	ChessRoom.prototype.distributePlayer = function(player) {
		var isDistribute = false;
		if(!player) {
			return isDistribute;
		}
		if(this.player1 === null) {
			this.player1 = player;
			isDistribute = true;
		} else {
			if(this.player2 === null) {
				this.player2 = player;
				isDistribute = true;
			}
		}
		if(isDistribute) {
			this.playerEnterRoom(player);
		}
		return isDistribute;
	}

	/**
	 * 玩家进入房间
	 * @param {ChessPlayer} palyer
	 */
	ChessRoom.prototype.playerEnterRoom = function(player) {
		if(!player) {
			return;
		}
		player.enterRoom(this);

		let enterRoomRet = {
			id: this.id,
			pn: player.name,
			ui: player.userInfo,
			rs: null
		};
		this.sendMessageToOpposite(player, "enterRoom", enterRoomRet);

		enterRoomRet["ui"] = null;
		enterRoomRet["rs"] = this.getRoomStatus();
		player.sendMessage("enterRoom", enterRoomRet);
	}

	/**
	 * 玩家离开房间时
	 * @param {ChessPlayer} player
	 * @return {Boolean} 是否成功离开房间
	 */
	ChessRoom.prototype.playerLeaveRoom = function(player) {
		if(!player) {
			return false;
		}
		let isPlayerLeave = false;
		let leaveRoomRet = {
			pn: player.name
		};

		this.sendMessageToAll("leaveRoom", leaveRoomRet);
		//如果游戏进行中
		if(this.status === CON.ROOM_STATUS.gameStart) {
			var oppPlayer = this.getOppositePlayer(player);
			if(oppPlayer) {
				this.setPlayerVictory(oppPlayer);
			}
		}

		player.leaveRoom();
		if(this.player1 === player) {
			this.player1 = null;
			isPlayerLeave = true;
		}
		if(this.player2 === player) {
			this.player2 = null;
			isPlayerLeave = true;
		}

		return isPlayerLeave;
	}

	/**
	 * 玩家准备时
	 * @param {ChessPlayer} player
	 */
	ChessRoom.prototype.playerReady = function(player) {
		let playerReadyRet = {
			pn: player.name
		};

		this.sendMessageToAll("ready", playerReadyRet);
		this.gameStart();
	}

	/**
	 * 玩家取消准备时
	 * @param {ChessPlayer} player
	 */
	ChessRoom.prototype.playerNotReady = function(player) {
		this.sendMessageToAll("notReady", {
			pn: player.name
		});
	}

	/**
	 * 游戏开始时初始化
	 */
	ChessRoom.prototype.gameStartInit = function() {
		this.initStatusFiled();
		this.stepNum = 0;
		this.no = 0;
		this.initChessboard();
		//this.initTestChessboard();
		this.victory = CON.VICTORY_STATUS.playing;
		this.status = CON.ROOM_STATUS.gameStart;
	};

	/**
	 * 游戏开始
	 */
	ChessRoom.prototype.gameStart = function() {
		let room = this;
		let ready = CON.PLAYER_STATUS.ready;
		if(room.player1 && room.player2 &&
			room.player1.status === ready &&
			room.player2.status === ready) {

			room.gameStartInit();
			room.player1.gameStart();
			room.player2.gameStart();
			room.setPlayerFirstHand();

			let gameStartRet = {
				"hpn": this.hostPlayer.name
			};

			this.sendMessageToAll("gameStart", gameStartRet);
			this.setHostPlayerOutTiming();
		}
	}

	/**
	 * 玩家翻开棋子时
	 * @param {ChessPlayer} player
	 */
	ChessRoom.prototype.playerOverChess = function(player) {
		let rule = this.rule;
		let overChessRet = {
			su: false,
			pn: player.name,
			c: null,
			l: null,
			hpn: null
		};
		let loc = player.sourceLoc;

		if(!player.isPlaying) {
			player.sendMessage("overChess", overChessRet);
			return;
		}
		if(!rule.checkOverChess(this.chessboard, loc)) {
			player.sendMessage("overChess", overChessRet);
			return;
		}

		this.stepNum++;
		let no = new Date().getTime() % this.createChessArr.length;
		//let no = Math.floor(Math.random() * this.createChessArr.length);
		let chess = this.createChessArr[no];
		this.chessboard[loc] = [chess];
		this.createChessArr.splice(no, 1);
		overChessRet.c = chess;
		overChessRet.l = loc;
		overChessRet.su = true;

		//确定玩家阵营
		if(this.stepNum === 1) {
			let camp = rule.getChessCamp([chess]);
			player.camp = camp;
			this.getOppositePlayer(player).camp = CON.getOppositeCamp(camp);
		}

		this.changeHostPlayer();
		overChessRet.hpn = this.hostPlayer.name;
		this.sendMessageToAll("overChess", overChessRet);
		this.setHostPlayerOutTiming();
	}

	/**
	 * 玩家移动棋子时
	 * @param {ChessPlayer} player
	 */
	ChessRoom.prototype.playerMoveChess = function(player) {
		let rule = this.rule;
		let moveChessRet = {
			su: false,
			pn: player.name,
			seA: null,
			sl: null,
			tl: null,
			sA: null,
			tA: null,
			p: null,
			hpn: null
		};
		if(player.isPlaying) {
			if(!rule.checkSelSource(this.chessboard, player.sourceLoc, player.camp)) {
				player.sendMessage("moveChess", moveChessRet);
				return moveChessRet;
			}
			if(!rule.checkSelTarget(this.chessboard, player.targetLoc, player.camp)) {
				player.sendMessage("moveChess", moveChessRet);
				return moveChessRet;
			}
		} else {
			player.sendMessage("moveChess", moveChessRet);
			return moveChessRet;
		}
		let moveRet = rule.checkMoveChess(this.chessboard, player.selectChessArr, player.sourceLoc, player.targetLoc);
		moveChessRet.su = moveRet.isMove;
		moveChessRet.p = moveRet.path;
		moveChessRet.tl = moveRet.tarLoc;
		moveChessRet.tA = moveRet.targetArr;
		moveChessRet.sl = moveRet.souLoc;
		moveChessRet.sA = moveRet.sourceArr;
		moveChessRet.seA = moveRet.selectArr;
		//设置杀子后的棋盘
		if(moveRet.isMove) {
			this.chessboard[moveRet.souLoc] = util.clone(moveRet.sourceArr);
			this.chessboard[moveRet.tarLoc] = util.clone(moveRet.targetArr);
			this.stepNum++;

			this.changeHostPlayer();
			moveChessRet.hpn = this.hostPlayer.name;

			this.sendMessageToAll("moveChess", moveChessRet);
			this.checkGameOver(player);

			this.setHostPlayerOutTiming();
		} else {
			player.sendMessage("moveChess", moveChessRet);
			return moveChessRet;
		}
	}

	/**
	 * 检查游戏是否结束
	 * @param {ChessPlayer} player
	 * @return {Boolean} 
	 */
	ChessRoom.prototype.checkGameOver = function(player) {
		let isGameOver = false;
		//判断输赢
		this.victory = this.rule.getVictory(this.chessboard, player.camp, this.stepNum);

		if(this.victory === CON.VICTORY_STATUS.playing) {

		} else {
			isGameOver = true;
			this.gameOver();
		}
		return isGameOver;
	}

	/**
	 * 游戏结束
	 */
	ChessRoom.prototype.gameOver = function() {
		this.timer.clear();
		this.createChessArr = [];
		this.chessboard = [];

		if(this.player1) {
			this.player1.gameOver(this.victory);
		}
		if(this.player2) {
			this.player2.gameOver(this.victory);
		}

		var gameOverRet = {
			vs: this.victory
		};

		this.status = CON.ROOM_STATUS.waitplayer;
		this.hostPlayer = null;
		this.hostPlayerTimeCount = 0;
		this.sendMessageToAll("gameOver", gameOverRet);
	}

	/**
	 * 玩家聊天
	 * @param {ChessPlayer} player
	 * @param {String} chatMsg
	 */
	ChessRoom.prototype.playerChat = function(player, chatMsg) {
		var oppPlayer = this.getOppositePlayer(player);
		this.sendMessageToAll("chat", {
			pn: player.name,
			cm: chatMsg
		});
	}

	/**
	 * 玩家断开连接中
	 * @param {Player} player
	 */
	ChessRoom.prototype.playerDisconnecting = function(player) {
		var that = this;
		if(!player) {
			return;
		}

		if(this.status === CON.ROOM_STATUS.gameStart) {
			this.sendMessageToOpposite(player, "playerDisconnecting", {
				pn: player.name,
				dtc: player.disconnTimeCount
			});
		} else {
			this.playerLeaveRoom(player);
		}
	}

	/**
	 * 玩家断开连接
	 * @param {Player} player
	 */
	ChessRoom.prototype.playerDisconn = function(player) {
		var that = this;
		if(!player) {
			return;
		}
		if(this.status === CON.ROOM_STATUS.gameStart) {
			var oppPlayer = that.getOppositePlayer(player);
			that.setPlayerVictory(oppPlayer);
		}
		that.playerLeaveRoom(player);
	}

	/**
	 * 玩家重新连接成功
	 * @param {Player} player
	 */
	ChessRoom.prototype.playerConn = function(player) {
		var room = this;
		if(this.status === CON.ROOM_STATUS.gameStart) {
			player.sendMessage("syncRoomStatus", {
				rs: this.getRoomStatus()
			});
		}
	}

	/**
	 *  设置玩家超时定时器
	 */
	ChessRoom.prototype.setHostPlayerOutTiming = function() {
		this.timer.clear();
		var that = this;

		this.hostPlayerTimeCount = this.maxPlayingTime / 1000;

		if(this.status === CON.ROOM_STATUS.gameStart &&
			this.victory === CON.VICTORY_STATUS.playing) {
			this.timer.init({
				repeatCount: this.hostPlayerTimeCount,
				intervalTime: 1000,
				delayTime: 0,
				currentCount: 0,
				timingStartFun: function() {
					that.hostPlayerTiming();
				},
				timingFun: function() {
					that.hostPlayerTiming();
				},
				timingEndFun: function() {
					that.hostPlayerOutTime();
				}
			}).start();
		}
	}

	/**
	 * 玩家超时
	 */
	ChessRoom.prototype.hostPlayerOutTime = function() {
		if(this.hostPlayer) {
			let players = [this.player1, this.player2];
			for(let i = 0; i < players.length; i++) {
				let player = players[i];
				//记录玩家超时次数
				if(player === this.hostPlayer) {
					player.timeoutCount++;
					player.sendMessage("outTime", {
						pn: player.name,
						toc: player.timeoutCount
					});
					//判断超时次数
					if(player.timeoutCount >= this.maxOutTimeCount) {
						let oppPlayer = this.getOppositePlayer(player);
						this.setPlayerVictory(oppPlayer);
						return;
					}
					break;
				}
			}
		}

		this.changeHostPlayer();
		this.setHostPlayerOutTiming();
	}

	/**
	 * 主场玩家 计时
	 */
	ChessRoom.prototype.hostPlayerTiming = function() {
		if(this.status !== CON.ROOM_STATUS.gameStart) {
			this.timer.clear();
			return;
		}
		let playing = {
			hpn: this.hostPlayer.name,
			hptc: this.hostPlayerTimeCount
		};
		this.sendMessageToAll("playingTime", playing);
		this.hostPlayerTimeCount--;
	}

	/**
	 * 玩家认输时
	 * @param {ChessPlayer} player
	 */
	ChessRoom.prototype.playerGiveUp = function(player) {
		let oppPlayer = this.getOppositePlayer(player);
		this.setPlayerVictory(oppPlayer);
	}

	/**
	 * 玩家求和
	 * @param {ChessPlayer} player
	 * @param {Boolean} isRequest
	 */
	ChessRoom.prototype.playerSuePeace = function(player, isRequest) {
		let player1 = this.player1,
			player2 = this.player2;
		if(player1 && player2) {
			if(player1.isSuePeace && player2.isSuePeace) {
				this.victory = CON.VICTORY_STATUS.draw;
				this.gameOver();
			} else {
				this.sendMessageToOpposite(player, "suePeace", {
					pn: player.name,
					isr: isRequest
				});
				if(!isRequest) {
					player1.isSuePeace = false;
					player2.isSuePeace = false;
				}
			}
		}
	}

	return ChessRoom;
}());

export default ChessRoom;