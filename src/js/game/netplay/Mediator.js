'use strict';
import Player from './Player'
import Room from './Room'
import CON from './../ConEnum'
import rules from './../rule/rules'
import MainAction from './action/MainAction'
import io from 'socket.io-client';

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
		/**
		 * @type {Socket} websocket的引用 
		 */
		this.socket = null;

		this.gameMode = "";
		this.localServer = null;
		this.sockets = null;
	}

	/**
	 * 初始化websocket
	 */
	Mediator.prototype.netSocketInit = function() {

		if(!this.socket) {
			//let serverUrl = "http://localhost:4000/chess";
			let serverUrl = "https://chengxg.leanapp.cn/chess";

			this.socket = io.connect(serverUrl);
			this.action.initSocketEvent(this.socket);
		}
	}

	/**
	 * 初始化
	 */
	Mediator.prototype.netServerInit = function() {
		this.gameMode = "net";
		if(!this.rule) {
			this.rule = rules.rule1;
		}
		if(!this.action) {
			this.action = new MainAction(this);
		}
		this.createRoom();
	}

	/**
	 * 设置游戏规则
	 * @param {String} ruleName
	 */
	Mediator.prototype.setRoomRule = function(ruleName) {
		if(ruleName in rules) {
			this.rule = rules[ruleName];
		}
	};

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
		if(!roomStatus) {
			return;
		}
		if(!this.room) {
			this.createRoom(roomStatus["id"]);
		}
		this.room.initStatus(roomStatus);
		this.setRoomRule(roomStatus["ru"]);
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
		let player = this.room.getPlayerByName(this.player.name);
		return player;
	};

	return Mediator;

})();

export default Mediator;