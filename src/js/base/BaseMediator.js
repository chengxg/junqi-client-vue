'use strict';
import Player from './Player'
import Room from './Room'
import rules from './../rule/rules'

let BaseMediator = (function() {
	/**
	 * 游戏的中介对象，用于连接其他对象，通过该对象可以实现其他对象间的互相访问
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function BaseMediator() {
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
		 * @type {String} 游戏模式
		 */
		this.gameMode = "";
	}

	/**
	 * 初始化本地游戏
	 */
	BaseMediator.prototype.initGame = function() {
		
	}

	/**
	 * 游戏开始
	 * @param {Object} form
	 */
	BaseMediator.prototype.gameStart = function(param) {
		
	}
	
	/**
	 * 设置游戏规则
	 * @param {String} ruleName
	 */
	BaseMediator.prototype.setRoomRule = function(ruleName) {
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
	BaseMediator.prototype.createRoom = function(roomId) {
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
	BaseMediator.prototype.initRoomStatus = function(roomStatus) {
		if(!this.room) {
			this.createRoom(roomStatus["id"]);
		}
		this.room.initStatus(roomStatus);
	};

	/**
	 * 删除房间
	 */
	BaseMediator.prototype.deleteRoom = function() {
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
	BaseMediator.prototype.isMeByPlayerName = function(playerName) {
		if(this.player && (this.player.name === playerName)) {
			return true;
		}
		return false;
	};

	/**
	 * 获取玩家自己
	 * @return {Player}
	 */
	BaseMediator.prototype.getMePlayer = function() {
		if(this.room && this.room.id) {
			return this.room.hostPlayer;
		}
		return null;
	};

	return BaseMediator;

})();

export default BaseMediator;