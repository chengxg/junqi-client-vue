'use strict';
import CON from './../ConEnum'
import rules from './../rule/rules'
import BaseMediator from './../base/BaseMediator'
import Action from './Action'
import MainScene from './MainScene'
import DialogManage from './DialogManage'
import LocalServer from './../server/ChessServer'
import LocalSocket from './../server/LocalSocket'

var Mediator = (function() {
	/**
	 * 游戏的中介对象，用于连接其他对象，通过该对象可以实现其他对象间的互相访问
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function Mediator() {
		BaseMediator.call(this);

		this.localServer = null;
		this.sockets = {
			socketServer1: new LocalSocket(),
			socketServer2: new LocalSocket(),
			socketClient1: new LocalSocket(),
			socketClient2: new LocalSocket()
		};
	}

	Mediator.prototype = new BaseMediator();

	/**
	 * 初始化本地游戏
	 */
	Mediator.prototype.initGame = function() {
		this.gameMode = "local";
		if(!this.rule) {
			this.rule = rules.rule1;
		}
		if(!this.action) {
			this.action = new Action(this);
		}
		if(!this.room) {
			this.createRoom();
		}
		if(!this.localServer) {
			this.localServer = new LocalServer(this);
		}
		if(!this.scene) {
			let dialogManage = new DialogManage();
			this.scene = new MainScene(this, dialogManage);
			this.scene.initScene();
		}

		let sockets = this.sockets;

		//关联 服务端socket 与 客户端socket
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
	Mediator.prototype.gameStart = function(param) {
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
			socketClient1.emit("createRoom", {
				"rule": that.rule.name
			}, function() {
				socketClient2.emit("enterRoom");
				socketClient1.emit("ready");
				socketClient2.emit("ready");
				setTimeout(function(){
					that.room.player1.socket = socketClient1;
					that.room.player2.socket = socketClient2;
				},60)
			});
		}, 20);
	}

	return Mediator;

})();

export default Mediator;