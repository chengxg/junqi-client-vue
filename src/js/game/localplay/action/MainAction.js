import CON from './../../ConEnum'
import Player from './../Player'

var MainAction = (function() {

	/**
	 * 与服务器交互的action类
	 * @author chengxg
	 * @since 2017-09-01
	 * @param {Mediator} mediator
	 */
	function MainAction(mediator) {
		Object.defineProperty(this, "mediator", {
			value: mediator,
			enumerable: false,
			writable: true
		});
	}

	/**
	 * 初始化socket时间
	 * @param {Object} socket
	 */
	MainAction.prototype.initSocketEvent = function(socket) {
		let action = this;
		let eventMap = {
			"login": action.loginEvent,
			"enterRoom": action.enterRoomEvent,
			"ready": action.readyEvent,
			"notReady": action.notReadyEvent,
			"leaveRoom": action.leaveRoomEvent,
			"gameStart": action.gameStartEvent,
			"overChess": action.overChessEvent,
			"moveChess": action.moveChessEvent,
			"playingTime": action.playingTimeEvent,
			"outTime": action.outTimeEvent,
			"gameOver": action.gameOverEvent,
			"suePeace": action.suePeaceEvent,
			"syncRoomStatus": action.syncRoomStatusEvent,
			"playerDisconnecting": action.playerDisconnectingEvent,
			"readyingTime": action.readyingTimeEvent
		};
		for(let evt in eventMap) {
			socket.on(evt, function(data) {
				eventMap[evt].call(action, data, socket);
			});
		}

		socket.on('connecting', function() {
			action.mediator.scene.messageCenter.addTipMsg("正在连接到服务器...");
		});
		socket.on('disconnect', function() {
			action.mediator.scene.messageCenter.addTipMsg("与服务器断开链接");
			action.mediator.player = null;
			action.mediator.room.destroyRoom();
		});
		socket.on('reconnect', function() {
			// console.log("重新连接到服务器");
			// action.mediator.player = null;
			// action.mediator.room.destroyRoom();
		});
		socket.on("connect_failed", function() {
			action.mediator.scene.messageCenter.addTipMsg("链接到服务器失败...");
			action.mediator.player = null;
			action.mediator.room.destroyRoom();
		});
		socket.on("reconnect_failed", function() {
			action.mediator.scene.messageCenter.addTipMsg("链接到服务器失败...");
			action.mediator.player = null;
			action.mediator.room.destroyRoom();
		});
		socket.on("error", function(data) {
			action.mediator.scene.messageCenter.addTipMsg("发生错误：" + data);
		});
		socket.on("reconnecting", function(data) {
			action.mediator.scene.messageCenter.addTipMsg("正在重新连接到服务器...");
		});

		return socket;
	}

	/**
	 * 封装socket请求
	 * @param {Object} option
	 */
	MainAction.prototype.emit = function(option) {
		this.mediator.netSocketInit();
		let mediator = this.mediator;

		let event = option.event; //时间名
		let data = option.data; //发送的数据
		let success = option.success; //请求成功后的回调
		let timeout = option.timeout; //请求超时后的回调
		let isShowSpinner = option.isShowSpinner || false; //是否显示spinner
		let spinnerDelay = option.spinnerDelay || 100; //spinner显示延时
		let spinnerDuration = option.spinnerDuration || 15000; //超时时间

		let timeDelayId = 0,
			timeoutId = 0;

		timeDelayId = setTimeout(function() {
			if(isShowSpinner) {
				mediator.scene.spinner.show = true;
				mediator.scene.spinner.duration = spinnerDuration;
			}
			timeoutId = setTimeout(function() {
				if(isShowSpinner) {
					mediator.scene.spinner.show = false;
				}
				if(timeout) {
					timeout();
				}
			}, spinnerDuration);
		}, spinnerDelay);

		mediator.socket.emit(event, data, function(data) {
			if(timeDelayId) {
				clearTimeout(timeDelayId);
				timeDelayId = 0;
			}
			if(timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = 0;
			}
			if(isShowSpinner) {
				mediator.scene.spinner.show = false;
			}
			if(success) {
				success(data);
			}
		});
	};

	/**
	 * 登录
	 * @param {Object} data
	 * @param {Function} callback
	 */
	MainAction.prototype.login = function(data, callback) {
		let mediator = this.mediator;
		this.emit({
			isShowSpinner: true,
			event: "login",
			data: data,
			success: function(ret) {
				if(ret["success"]) {
					let playerName = data["userName"];
					let player = new Player(mediator);
					player.name = playerName;
					player.userInfo = ret["userInfo"];
					player.logindUser = ret["logindUser"];
					player.socket = mediator.socket;
					mediator.player = player;
				}
				if(callback) {
					callback(ret);
				}
			}
		});
	};

	/**
	 * 服务器拦截登录时间
	 * @param {Object} data
	 */
	MainAction.prototype.loginEvent = function(data) {
		this.mediator.scene.dialogManage.login.show = true;
	};

	/**
	 * 玩家进入房间事件
	 * @param {Object} data
	 */
	MainAction.prototype.enterRoomEvent = function(data, socket) {
		var roomId = data["id"];
		var playerName = data["pn"];
		var userInfo = data["ui"];
		var roomStatus = data["rs"];

		if(roomStatus) {
			this.mediator.initRoomStatus(roomStatus);
		}
		//console.log("客户端玩家进入房间：" + JSON.stringify(data));
		this.mediator.room.playerEnterRoom(playerName, userInfo);
	};

	/**
	 * 玩家准备事件
	 * @param {Object} data
	 */
	MainAction.prototype.readyEvent = function(data) {
		//console.log("玩家准备：" + data);
		if(data["pn"]) {
			if(this.mediator.room) {
				this.mediator.room.playerReady(data["pn"]);
			}
		}
	};

	/**
	 * 玩家取消准备事件
	 * @param {Object} data
	 */
	MainAction.prototype.notReadyEvent = function(data) {
		//console.log("玩家取消准备：" + data);
		if(data["pn"]) {
			if(this.mediator.room) {
				this.mediator.room.playerNotReady(data["pn"]);
			}
		}
	};

	/**
	 * 玩家离开房间事件
	 * @param {Object} data
	 */
	MainAction.prototype.leaveRoomEvent = function(data) {
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		let playerName = data["pn"];

		if(playerName) {
			var isMe = this.mediator.isMeByPlayerName(playerName);
			room.playerLeaveRoom(playerName);
			if(isMe) {
				this.mediator.deleteRoom();
			}
		}
	};

	/**
	 * 游戏开始事件
	 * @param {Object} data
	 */
	MainAction.prototype.gameStartEvent = function(data) {
		let room = this.mediator.room;
		if(data["hpn"]) {
			room.gameStart(data["hpn"]);
			this.mediator.scene.gameStartRet();
		}
	};

	/**
	 * 翻开棋子事件
	 * @param {Object} data
	 */
	MainAction.prototype.overChessEvent = function(data) {
		if(!data["su"]) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		let isOver = room.overChess(data);
		if(isOver) {
			this.mediator.scene.overChessRet(data);
		}
	};

	/**
	 * 移动棋子事件
	 * @param {Object} data
	 */
	MainAction.prototype.moveChessEvent = function(data) {
		if(!data || !data["su"]) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		let isMove = room.moveChess(data);
		if(isMove) {
			this.mediator.scene.moveChessRet(data);
		}
	};

	/**
	 * 主场玩家计时事件
	 * @param {Object} data
	 */
	MainAction.prototype.playingTimeEvent = function(data) {
		if(!data) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		room.playingTime(data);
	};

	/**
	 * 玩家超时事件
	 * @param {Object} data
	 */
	MainAction.prototype.outTimeEvent = function(data) {
		if(!data) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		let player = room.getPlayerByName(data["pn"]);
		if(player) {
			let timeoutCount = data["toc"];
			if(typeof timeoutCount === 'number') {
				player.timeoutCount = timeoutCount;
			}
		}
	};

	/**
	 * 游戏结束事件
	 * @param {Object} data
	 */
	MainAction.prototype.gameOverEvent = function(data) {
		if(!data || !data["vs"]) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		//console.log("客户端游戏结束" + data["vs"]);
		room.gameOver(data["vs"]);
		this.mediator.scene.gameOverRet();
	};

	/**
	 * 玩家求和事件
	 * @param {Object} data
	 */
	MainAction.prototype.suePeaceEvent = function(data) {
		if(!data || !data["pn"]) {
			return;
		}
		let room = this.mediator.room;
		if(!room) {
			return;
		}
		//console.log("客户端请求求和" + data["pn"]);
		this.mediator.scene.suePeaceRet(data);
	};

	/**
	 * 同步房间状态事件
	 * @param {Object} data
	 */
	MainAction.prototype.syncRoomStatusEvent = function(data) {
		var roomStatus = data["rs"];
		if(roomStatus) {
			this.mediator.deleteRoom();
			this.mediator.initRoomStatus(roomStatus);
		}
		//console.log('同步房间信息：' + JSON.stringify(data));
		let room = this.mediator.room;
		if(room && roomStatus["id"]) {
			if(room.status === CON.ROOM_STATUS.gameStart) {
				room.setHostPlayer(roomStatus["hpn"]);
				this.mediator.scene.gameStartRet();
			}
		} else {
			this.mediator.deleteRoom();
		}
	};

	/**
	 * 玩家断开网路连接事件
	 * @param {Object} data
	 */
	MainAction.prototype.playerDisconnectingEvent = function(data) {
		if(!data) {
			return;
		}
		let room = this.mediator.room;
		if(!room && !room.id) {
			return;
		}
		let playerName = data["pn"];
		let disconnTimeCount = data["dtc"];
		let player = room.getPlayerByName(playerName);
		if(player) {
			player.disconnTimeCount = disconnTimeCount;
			this.mediator.scene.messageCenter.addTipMsg("对方断开网路连接..." + disconnTimeCount);
		}

	};

	/**
	 * 玩家准备事件
	 * @param {Object} data
	 */
	MainAction.prototype.readyingTimeEvent = function(data) {
		if(!data) {
			return;
		}

		let room = this.mediator.room;
		if(!room && !room[id]) {
			return;
		}
		room.readyingTime(data);
	};

	return MainAction;
})();

export default MainAction;