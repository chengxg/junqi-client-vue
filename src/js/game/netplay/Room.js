'use strict';
import CON from './../ConEnum'
import util from './../../util'
import Player from './Player'

/**
 * 客户端房间类
 * @author chengxg
 * @since 2017-09-01
 * @constructor
 * @param {Mediator} mediator
 * @param {Number} roomId
 */
function Room(mediator, roomId) {
	Object.defineProperty(this, "mediator", {
		value: mediator,
		enumerable: false
	});
	/**
	 * @property {Number} 房间的id
	 */
	this.id = roomId;

	/**
	 * @property {Player} 房间的第一位玩家
	 */
	this.player1 = null;
	/**
	 * @property {Player} 房间的第二位玩家
	 */
	this.player2 = null;

	/**	
	 * @property {Player} 房间的主场玩家
	 */
	this.hostPlayer = null;

	/**
	 * @property {Array<Number>} 创建棋子的数组
	 */
	Object.defineProperty(this, "createChessArr", {
		value: [],
		enumerable: false,
		writable: true
	});
	/**
	 * @property {Array<Array<Number>>} 存储棋盘的数组
	 */
	Object.defineProperty(this, "chessboard", {
		value: [],
		enumerable: false,
		writable: true
	});
	/**
	 * @property {Number} 记录走棋步数
	 */
	this.stepNum = 0;
	this.no = 0;

	/**
	 * @property {Number} 玩家胜负状态
	 */
	this.victory = CON.VICTORY_STATUS.playing;
	/**
	 * @property {Number} 玩家状态
	 */
	this.status = CON.ROOM_STATUS.waitPlayer;
	/**
	 * @property {Number} 主场玩家走棋计时，来自服务器
	 */
	this.hostPlayerTimeCount = 0;
	/**
	 * @property {Array<Object>} 玩家聊天记录
	 */
	this.playerChatMsgArr = [];
}
/**
 * @description 房间简写属性对应表
 */
Object.defineProperty(Room.prototype, "simpleFiledMap", {
	value: {
		"createChessArr": "cca",
		"chessboard": "cb",
		"stepNum": "sn",
		"victory": "vs",
		"status": "s",
		"hostPlayerTimeCount": "hptc",
		"id": "id",
		"no": "no",
		"cca": "createChessArr",
		"cb": "chessboard",
		"sn": "stepNum",
		"vs": "victory",
		"s": "status",
		"hptc": "hostPlayerTimeCount"
	},
	enumerable: false
});

/**
 * 初始化房间状态
 * @param {Object} roomStatus
 */
Room.prototype.initStatus = function(roomStatus) {
	if(!roomStatus) {
		return;
	}
	for(let simpleFiled in roomStatus) {
		let filed = this.simpleFiledMap[simpleFiled];
		if(typeof filed !== 'undefined') {
			this[filed] = roomStatus[simpleFiled];
		}
	}
	if(roomStatus["p1s"]) {
		this.player1 = this.createPlayer(roomStatus["p1s"].n, roomStatus["p1s"], null);
	}
	if(roomStatus["p2s"]) {
		this.player2 = this.createPlayer(roomStatus["p2s"].n, roomStatus["p2s"], null);
	}
};
/**
 * 初始化房间状态的字段
 */
Room.prototype.initStatusFiled = function() {
	this.stepNum = 0; //当前走棋步数
	this.victory = CON.VICTORY_STATUS.playing;
	this.status = CON.ROOM_STATUS.waitPlayer;
	this.createChessArr = [];
	this.no = 0;
	this.chessboard = [];
	this.hostPlayerTimeCount = 0;
	this.hostPlayerName = "";
	this.hostPlayer = null;
};
/**
 * 初始化房间的所有状态字段
 */
Room.prototype.initAllStatusFiled = function() {
	this.initStatusFiled();
	this.player1 = null;
	this.player2 = null;
	this.playerChatMsgArr = [];
	this.id = 0;
};
/**
 * 初始化房间信息
 * @param {Object} roomInfo
 */
Room.prototype.initRoomInfo = function(roomInfo) {
	this.initStatus(roomInfo);
	if(roomInfo["p1s"]) {
		this.player1 = this.createPlayer(roomInfo["p1s"].n, roomInfo["p1s"], null);
	}
	if(roomInfo["p2s"]) {
		this.player2 = this.createPlayer(roomInfo["p2s"].n, roomInfo["p2s"], null);
	}
};
/**
 * 销毁该房间
 */
Room.prototype.destroyRoom = function() {
	if(this.player1) {
		this.player1.leaveRoom();
	}
	if(this.player2) {
		this.player2.leaveRoom();
	}
	this.initAllStatusFiled();
};

/**
 * 创建玩家
 * @param {String} playerName 玩家名称
 * @param {Object} playerStatus 玩家状态
 * @param {Object} userInfo 玩家信息
 * @return {Player}
 */
Room.prototype.createPlayer = function(playerName, playerStatus, userInfo) {
	return Player.createPlayer(this.mediator, playerName, playerStatus, userInfo);
};

/**
 * 通过名称得到玩家
 * @param {String} playerName
 * @return {Player}
 */
Room.prototype.getPlayerByName = function(playerName) {
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
Room.prototype.setHostPlayer = function(hostPlayerName) {
	let player = this.getPlayerByName(hostPlayerName);
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
 * 设置玩家阵营
 * @param {Object} campRet 阵营描述对象，来自服务器
 * @return {Boolean} 是否成功设置阵营
 */
Room.prototype.setPalyerCamp = function(campRet) {
	let player = this.getPlayerByName(campRet["playerName"]);
	if(!player) {
		return false;
	}
	let oppPlayer = this.getOppositePlayer(player);
	if(!oppPlayer) {
		return false;
	}
	let camp = campRet["camp"];
	player.setCamp(camp);
	oppPlayer.setCamp(CON.getOppositeCamp(camp));
	return true;
};

/**
 * 得到对方的玩家
 * @param {Player} player 玩家
 * @return {Player}
 */
Room.prototype.getOppositePlayer = function(player) {
	if(player == this.player1) {
		return this.player2;
	} else {
		return this.player1;
	}
};

/**
 * 玩家进入房间时
 * @param {String} playerName 玩家名称
 * @param {Object} userInfo 玩家信息
 */
Room.prototype.playerEnterRoom = function(playerName, userInfo) {
	if(!playerName) {
		return;
	}
	this.playerLeaveRoom(playerName);
	var player = this.createPlayer(playerName, null, userInfo);
	if(userInfo) {
		player.setUserInfo(userInfo);
	}
	if(this.player1 === null) {
		this.player1 = player;
	} else {
		if(this.player2 === null) {
			this.player2 = player;
		}
	}
	player.enterRoom(this);
};

/**
 * 玩家离开房间时
 * @param {String} playerName
 */
Room.prototype.playerLeaveRoom = function(playerName) {
	var player = this.getPlayerByName(playerName);
	if(player) {
		player.leaveRoom();
		if(this.player1 === player) {
			this.player1 = null;
		}
		if(this.player2 === player) {
			this.player2 = null;
		}
	}
};

/**
 * 玩家准备时
 * @param {String} playerName
 */
Room.prototype.playerReady = function(playerName) {
	var room = this;
	var player = this.getPlayerByName(playerName);
	if(player) {
		this.victory = CON.VICTORY_STATUS.playing;
		player.ready();
	}
};

/**
 * 玩家取消准备时
 * @param {String} playerName
 */
Room.prototype.playerNotReady = function(playerName) {
	var room = this;
	var player = this.getPlayerByName(playerName);
	if(player) {
		player.notReady();
	}
};

/**
 * 初始化棋盘数组
 */
Room.prototype.initChessboard = function() {
	let rule = this.mediator.rule;

	this.createChessArr = util.clone(rule.allChessArr);
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
Room.prototype.initTestChessboard = function() {
	let rule = this.mediator.rule;

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
 * 游戏开始时，初始化房间状态
 */
Room.prototype.gameStartInit = function() {
	this.initStatusFiled();
	this.stepNum = 0;
	this.no = 0;
	this.initChessboard();
	//this.initTestChessboard();
	this.victory = CON.VICTORY_STATUS.playing;
	this.status = CON.ROOM_STATUS.gameStart;
};
/**
 * 游戏开始时
 * @param {String} hostPlayerName
 */
Room.prototype.gameStart = function(hostPlayerName) {
	this.gameStartInit();
	this.setHostPlayer(hostPlayerName);
	if(this.player1) {
		this.player1.gameStart();
	}
	if(this.player2) {
		this.player2.gameStart();
	}
};

/**
 * 玩家翻开棋子时
 * @param {Object} overChess 翻开棋子的描述对象，来自服务器
 * @return {Boolean} 是否翻开
 */
Room.prototype.overChess = function(overChess) {
	if(!overChess) {
		return false;
	}
	var player = this.getPlayerByName(overChess["pn"]);
	if(!player) {
		return false;
	}
	var oppPlayer = this.getOppositePlayer(player);
	if(!oppPlayer) {
		return false;
	}

	player.initSelectStatus();
	oppPlayer.initSelectStatus();

	this.chessboard[overChess.l] = [overChess.c];
	util.delArrSameVal(this.createChessArr, overChess.c);
	this.stepNum++;
	//确定玩家阵营
	if(this.stepNum === 1) {
		let rule = this.mediator.rule;
		let camp = rule.getChessCamp([overChess.c]);
		player.camp = camp;
		this.getOppositePlayer(player).camp = CON.getOppositeCamp(camp);
	}
	this.setHostPlayer(oppPlayer.name);
	this.hostPlayerTimeCount = null;
	return true;
};

/**
 * 玩家移动棋子
 * @param {Object} moveChess 移动的棋子的描述对象，来自服务器
 */
Room.prototype.moveChess = function(moveChess) {
	if(!moveChess) {
		return false;
	}
	let player = this.getPlayerByName(moveChess.pn);
	if(!player) {
		return false;
	}
	let oppPlayer = this.getOppositePlayer(player);
	if(!oppPlayer) {
		return false;
	}
	player.initSelectStatus();
	oppPlayer.initSelectStatus();

	this.chessboard[moveChess.sl] = moveChess.sA;
	this.chessboard[moveChess.tl] = moveChess.tA;
	this.stepNum++;
	this.setHostPlayer(oppPlayer.name);
	this.hostPlayerTimeCount = null;
	return true;
};

/**
 * 游戏结束时，设置胜负状态
 * @param {Number} victoryStatus 
 */
Room.prototype.gameOver = function(victoryStatus) {
	if(this.status === CON.ROOM_STATUS.gameStart) {
		this.victory = victoryStatus;
		this.status = CON.ROOM_STATUS.waitPlayer;
		this.hostPlayer = null;
		this.hostPlayerTimeCount = 0;
		if(this.player1) {
			this.player1.gameOver(victoryStatus);
		}
		if(this.player2) {
			this.player2.gameOver(victoryStatus);
		}
	}
};

/**
 * 记录玩家聊天
 * @param {Object} msg 来自服务器的信息
 */
Room.prototype.addPlayerChatMsg = function(msg) {
	var playerName = msg["pn"];
	var chatMsg = msg["cm"];

	this.playerChatMsgArr.push({
		playerName: playerName,
		chatMsg: chatMsg,
		time: util.formatDate(new Date(), "hh:mm:ss")
	});
};

/**
 * 主场玩家计时，由服务器控制
 * @param {Object} data
 * @return {Boolean} 是否成功设置玩家阵营
 */
Room.prototype.playingTime = function(data) {
	if(!data) {
		return false;
	}
	let player = this.getPlayerByName(data.hpn);
	if(!player) {
		return false;
	}
	let oppPlayer = this.getOppositePlayer(player);
	if(!oppPlayer) {
		return false;
	}
	this.hostPlayerTimeCount = data["hptc"];
	this.setHostPlayer(player.name);
	return true;
};

/**
 * 玩家准备时间计时，由服务器控制
 * @param {Object} data
 * @return {Boolean} 是否成功设置计时信息
 */
Room.prototype.readyingTime = function(data) {
	if(!data) {
		return false;
	}
	let player = this.getPlayerByName(data.pn);
	if(!player) {
		return false;
	}

	player.readyTimeCount = data.rtc;
	return true;
};

export default Room;