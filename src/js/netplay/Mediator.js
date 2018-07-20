'use strict';
import CON from './../ConEnum'
import rules from './../rule/rules'
import BaseMediator from './../base/BaseMediator'
import Action from './Action'
import MainScene from './MainScene'
import DialogManage from './DialogManage'
import io from 'socket.io-client';

var Mediator = (function() {
	/**
	 * 游戏的中介对象，用于连接其他对象，通过该对象可以实现其他对象间的互相访问
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function Mediator() {
		BaseMediator.call(this);
		this.sockets = null;
	}

	Mediator.prototype = new BaseMediator();

	/**
	 * 初始化本地游戏
	 */
	Mediator.prototype.initGame = function() {
		this.gameMode = "net";
		if(!this.rule) {
			this.rule = rules.rule1;
		}
		if(!this.action) {
			this.action = new Action(this);
		}
		if(!this.room) {
			this.createRoom();
		}
		if(!this.scene) {
			let dialogManage = new DialogManage();
			this.scene = new MainScene(this, dialogManage);
			this.scene.initScene();
		}
		if(!this.socket) {
			this.socket = io.connect(CON.SERVER_URL);
			this.action.initSocketEvent(this.socket);
		}
	}

	/**
	 * 游戏开始
	 * @param {Object} form
	 */
	Mediator.prototype.gameStart = function(param) {
		
	}

	return Mediator;

})();

export default Mediator;