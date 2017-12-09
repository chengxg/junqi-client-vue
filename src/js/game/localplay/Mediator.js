'use strict';
import Player from './Player'
import Room from './Room'
import CON from './../ConEnum'
import rules from './../rule/rules'
import MainAction from './action/MainAction'
import io from 'socket.io-client';
import LocalServer from './server/ChessServer'
import LocalSocket from './server/LocalSocket'

var Mediator = (function() {
	/**
	 * 游戏的中介对象，用于连接其他对象，通过该对象可以实现其他对象间的互相访问
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function Mediator() {
		/**
		 * @type {BaseRule} 游戏规则的引用
		 */
		this.rule = null;
		/**
		 * @type {Room} 游戏房间的引用，只初始化一次
		 */
		this.room = null;
		/**
		 * @type {Player} 当前登录的玩家,用于保存登录的玩家信息
		 */
		this.player = null;
		/**
		 * @type {MainScene} 游戏场景的引用
		 */
		this.scene = null;
		/**
		 * @type {MmainAction} 与服务器交互动作的引用
		 */
		this.action = null;

		this.gameMode = "";
		this.localServer = null;
		this.sockets = {
			socketServer1: new LocalSocket(),
			socketServer2: new LocalSocket(),
			socketClient1: new LocalSocket(),
			socketClient2: new LocalSocket()
		};
	}

	/**
	 * 初始化本地游戏
	 */
	Mediator.prototype.initLocalGame = function() {
		this.gameMode = "local";
		if(!this.rule) {
			this.rule = rules.rule1;
		}
		if(!this.action) {
			this.action = new MainAction(this);
		}
		if(!this.localServer) {
			this.localServer = new LocalServer(this);
		}
		this.createRoom();

		let sockets = this.sockets;

		sockets.socketServer1.clientSocket = sockets.socketClient1;
		sockets.socketServer2.clientSocket = sockets.socketClient2;
		sockets.socketClient1.clientSocket = sockets.socketServer1;
		sockets.socketClient2.clientSocket = sockets.socketServer2;

		this.localServer.initIO(sockets.socketServer1);
		this.localServer.initIO(sockets.socketServer2);
		this.action.initSocketEvent(sockets.socketClient1);
		this.action.initSocketEvent(sockets.socketClient2);
	}

	/**
	 * 游戏开始
	 * @param {Object} form
	 */
	Mediator.prototype.localGameStart = function(param) {
		let socketClient1 = this.sockets.socketClient1,
			socketClient2 = this.sockets.socketClient2;
		
		let ruleName = param.ruleName;
		if(ruleName && rules[ruleName]) {
			this.rule = rules[ruleName];
		}
		
		socketClient1.emit("login", {
			n: param.player1Name
		});
		socketClient2.emit("login", {
			n: param.player2Name
		});

		let that = this;
		
		setTimeout(function() {
			socketClient1.emit("createRoom",{
				"rule": that.rule.name
			},function(){
				socketClient2.emit("enterRoom");
				socketClient1.emit("ready");
				socketClient2.emit("ready");
			});
		}, 20);
	}

	/**
	 * 创建房间（由于vue需要观察room数据，保持对象的引用不变，所以只能创建一次）
	 * 通过room。id 来判断该房间是否有效
	 * @param {Number} roomId 房间的id
	 * @return {Room} 返回创建的房间
	 */
	Mediator.prototype.createRoom = function(roomId) {
		var room = this.room;
		if(!room) {
			room = new Room(this, roomId);
			this.room = room;
		} else {
			room.id = roomId;
		}
		return room;
	};

	/**
	 * 初始化房间的状态
	 * @param {Object} roomStatus 房间状态
	 */
	Mediator.prototype.initRoomStatus = function(roomStatus) {
		if(!this.room) {
			this.createRoom(roomStatus["id"]);
		}
		this.room.initStatus(roomStatus);
	};

	/**
	 * 删除房间
	 */
	Mediator.prototype.deleteRoom = function() {
		var room = this.room;
		if(!room) {
			return;
		}
		room.destroyRoom();
	};

	/**
	 * 通过玩家名判断是否是自己
	 * @param {String} playerName 
	 * @return {Boolean}
	 */
	Mediator.prototype.isMeByPlayerName = function(playerName) {
		if(this.player && (this.player.name === playerName)) {
			return true;
		}
		return false;
	};

	/**
	 * 获取玩家自己
	 * @return {Player}
	 */
	Mediator.prototype.getMePlayer = function() {
		if(this.room && this.room.id) {
			return this.room.hostPlayer;
		}
		return null;
	};

	return Mediator;

})();

export default Mediator;