'use strict';
import CON from './../ConEnum'

/**
 * 客户端玩家类
 * @author chengxg
 * @since 2017-09-01
 * @constructor
 * @param {Mediator} mediator
 */
function Player(mediator) {
	Object.defineProperty(this, "mediator", {
		value: mediator,
		enumerable: false
	});
	Object.defineProperty(this, "socket", {
		value: null,
		enumerable: false,
		writable: true
	});
	/**
	 * @property {String} 玩家名称
	 */
	this.name = null;

	/**
	 * @property {Room} 玩家的所属房间
	 */
	Object.defineProperty(this, "room", {
		value: null,
		enumerable: false,
		writable: true
	});

	/**
	 * @property {Object} 玩家信息，来自服务器
	 */
	this.userInfo = null;
	/**
	 * @property {Object} 玩家的登录信息，来自服务器
	 */
	this.logindUser = null;

	/**
	 * @property {Number} 与服务器断开连接时间计时，由服务器控制
	 */
	this.disconnTimeCount = 0;
	/**
	 * @property {Number} 玩家准备的时间计时，由服务器控制
	 */
	this.readyTimeCount = 0;
	/**
	 * @property {Number} 玩家超时次数计数，由服务器控制
	 */
	this.timeoutCount = 0;

	this.initFileds();
}

/**
 * 玩家类简写属性对应表，用于减少数据传输的大小
 */
Object.defineProperty(Player.prototype, "simpleFiledMap", {
	value: {
		"name": "n",
		"isPlaying": "isp",
		"camp": "c",
		"status": "s",
		"victory": "vs",
		"status": "s",
		"connect": "con",
		"disconnTimeCount": "dtc",
		"readyTimeCount": "rtc",
		"timeoutCount": "toc",

		"n": "name",
		"isp": "isPlaying",
		"c": "camp",
		"s": "status",
		"vs": "victory",
		"s": "status",
		"con": "connect",
		"dtc": "disconnTimeCount",
		"rtc": "readyTimeCount",
		"toc": "timeoutCount"
	},
	enumerable: false
});

/**
 * 玩家创建方法
 * @static
 * @param {Mediator} mediator 中介者
 * @param {String} playerName 玩家名称
 * @param {Object} playerStatus 玩家状态
 * @param {Object} userInfo 玩家信息
 * @return {Player} 返回创建的对象
 */
Player.createPlayer = function(mediator, playerName, playerStatus, userInfo) {
	let player = new Player(mediator);
	player.name = playerName;
	if(playerStatus) {
		player.initStatus(playerStatus);
	}
	if(userInfo) {
		player.setUserInfo(userInfo);
	}
	if(mediator.player && mediator.player.name === playerName) {
		player.socket = mediator.socket;
	}
	return player;
};

/**
 * 初始化玩家的属性
 */
Player.prototype.initFileds = function() {
	this.sourceLoc = -1;
	this.targetLoc = -1;
	this.selectChessArr = [];
	this.isPlaying = false;
	this.camp = CON.CAMP.neutral;
	this.status = CON.PLAYER_STATUS.undistributed;
	this.victory = CON.VICTORY_STATUS.playing;
	this.connect = CON.LOGINS_TATUS.connect;
};

/**
 * 设置玩家的状态
 * @param {Object} playerStatus
 */
Player.prototype.initStatus = function(playerStatus) {
	if(!playerStatus) {
		return;
	}
	for(let simpleFiled in playerStatus) {
		if(typeof playerStatus[simpleFiled] !== 'undefined') {
			let filed = this.simpleFiledMap[simpleFiled];
			this[filed] = playerStatus[simpleFiled];
		}
	}
};

/**
 * 往服务器发送信息
 * @param {String} event 时间名
 * @param {Object} data 发送的数据
 */
Player.prototype.sendMessage = function(event, data) {
	if(this.socket) {
		this.socket.emit(event, data);
	}
}

Player.prototype.setUserInfo = function(userInfo) {
	this.userInfo = userInfo;
};

Player.prototype.setCamp = function(camp) {
	this.camp = camp;
};

Player.prototype.addSelectChess = function(chess) {
	if(this.selectChessArr.indexOf(chess) === -1) {
		this.selectChessArr.push(chess);
	}
};

Player.prototype.outSelectChess = function(chess) {
	var no = this.selectChessArr.indexOf(chess);
	if(no > -1) {
		this.selectChessArr.splice(no, 1);
	}
};

Player.prototype.cancleAllSelectChess = function() {
	this.selectChessArr = [];
};

Player.prototype.initSelectStatus = function() {
	this.sourceLoc = -1;
	this.targetLoc = -1;
	this.selectChessArr = [];
};

/**
 * 玩家进入房间
 * @param {Room} room
 */
Player.prototype.enterRoom = function(room) {
	this.room = room;
	this.initFileds();
	this.status = CON.PLAYER_STATUS.notReady;
};

/**
 * 玩家离开房间
 */
Player.prototype.leaveRoom = function() {
	this.room = null;
	this.initFileds();
};

/**
 * 玩家准备
 */
Player.prototype.ready = function() {
	this.status = CON.PLAYER_STATUS.ready;
};
/**
 * 玩家取消准备
 */
Player.prototype.notReady = function() {
	this.status = CON.PLAYER_STATUS.notReady;
};
/**
 * 游戏开始
 */
Player.prototype.gameStart = function() {
	this.initFileds();
	this.timeoutCount = 0;
	this.status = CON.PLAYER_STATUS.gameStart;
};
/**
 * 翻开棋子回调
 */
Player.prototype.overChess = function() {};
/**
 * 移动棋子回调
 */
Player.prototype.moveChess = function() {};

/**
 * 玩家发送翻开棋子信息
 */
Player.prototype.overChessAction = function() {
	this.sendMessage("overChess", {
		l: this.sourceLoc
	});
};
/**
 * 玩家发送移动棋子信息
 */
Player.prototype.moveChessAction = function() {
	this.sendMessage("moveChess", {
		sl: this.sourceLoc,
		tl: this.targetLoc,
		seA: this.selectChessArr
	});
};
/**
 * 游戏结束
 * @param {Number} victoryStatus 胜利状态
 */
Player.prototype.gameOver = function(victoryStatus) {
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
};

export default Player;