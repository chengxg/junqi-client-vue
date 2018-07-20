'use strict';
import CBP from './../ChessboardPara'
import CON from './../ConEnum'
import ChessGroup from './ChessGroup'
import MessageCenter from './MessageCenter'
import gameSound from './GameSound'

/**
 * 游戏场景数据类  存储游戏场景中的数据
 * @author chengxg
 * @since 2017-09-01
 * @param {Mediator} mediator 中介者
 */
function BaseMainScene(mediator, dialogManage) {
	Object.defineProperty(this, "mediator", {
		value: mediator,
		enumerable: false
	});

	/**
	 * @type {Array} 棋子组对象chessGroup 数组
	 */
	this.chessGroupArr = [];
	/**
	 * @type {MessageCenter} 消息中心
	 */
	this.messageCenter = new MessageCenter();
	/**
	 * @type {DialogManage} 对话框管理中心
	 */
	this.dialogManage = dialogManage;
	/**
	 * @type {Object} 游戏缓冲对象
	 */
	this.spinner = {
		show: false,
		duration: 2000
	};

	/**
	 * 该场景的动画实现类型
	 */
	this.sceneSetting = {
		//游戏动画
		gameAnimation: CON.ANIMATION_TYPE.css,

		//初始化场景设置
		initSceneSetting: function() {
			let localSceneSettingFormJson = localStorage.getItem("localSceneSettingForm");
			if(localSceneSettingFormJson) {
				let form = null;
				try {
					form = JSON.parse(localSceneSettingFormJson);
				} catch(e) {}
				if(form) {
					for(let filed in form) {
						if(typeof form[filed] !== 'undefined') {
							this[filed] = form[filed];
						}
					}
				}
			}
		}
	};
}

/**
 * 初始化场景
 */
BaseMainScene.prototype.initScene = function() {
	this.sceneSetting.initSceneSetting();
}

/**
 * 初始化棋盘数组 this.chessGroupArr
 */
BaseMainScene.prototype.initChessboardView = function() {
	let room = this.mediator.room;
	if(!room || !room.id) {
		return;
	}
	this.chessGroupArr.splice(0, this.chessGroupArr.length);

	let chessboard = room.chessboard;
	for(let i = 0; i < 60; i++) {
		let chessGroup = new ChessGroup(this, i);
		chessGroup.setChessGroup(chessboard[i]);
		this.chessGroupArr.push(chessGroup);
	}
}

/**
 * 获取棋子组的焦点
 * @param {ChessGroup} chessGroup 当前操作的chessGroup
 */
BaseMainScene.prototype.acquireChessGroupFocus = function(chessGroup, callback) {
	let index = this.chessGroupArr.indexOf(chessGroup);
	if(index > -1) {
		let that = this;
		setTimeout(function() {
			let temp = that.chessGroupArr[index];
			//		let len = this.chessGroupArr.length;
			//		this.chessGroupArr[index] = this.chessGroupArr[len-1];
			//		this.chessGroupArr[len-1] = temp;
			that.chessGroupArr.splice(index, 1);
			that.chessGroupArr.push(temp);
			if(callback && typeof callback === 'function') {
				setTimeout(function() {
					callback();
				}, 20)
			}
		}, 40);
	}
}

/**
 * 通过位置获取 棋子组对象
 * @param {Number} loc
 * @return {ChessGroup}
 */
BaseMainScene.prototype.getChessGroupByLoc = function(loc) {
	let chessGroup = null;
	this.chessGroupArr.every(function(item) {
		if(item.loc === loc) {
			chessGroup = item;
			return false;
		}
		return true;
	})
	return chessGroup;
}

/**
 * 所有选择的棋子组 取消选择
 * @param {ChessGroup|null} exceptChessGroup 除去此棋子组
 */
BaseMainScene.prototype.cancelAllSelectChessGroup = function(exceptChessGroup) {
	this.chessGroupArr.forEach(function(chessGroup) {
		if(!(exceptChessGroup && (exceptChessGroup === chessGroup))) {
			chessGroup.selectChessGroup(false);
		}
	});
}

/**
 * 所有棋子组隐藏选择面板
 * @param {ChessGroup|null} exceptChessGroup 除去此棋子组
 */
BaseMainScene.prototype.hideAllChessGroupSelectChessPanel = function(exceptChessGroup) {
	this.chessGroupArr.forEach(function(chessGroup) {
		if(!(exceptChessGroup && (exceptChessGroup === chessGroup))) {
			chessGroup.hideSelecChessPanel();
		}
	});
}

/**
 * 玩家点击棋子组 用于翻棋，行棋
 * @param {ChessGroup} chessGroup 被点击的棋子组
 * @param {Function} selectSuccess 选择棋子成功后回调
 */
BaseMainScene.prototype.clickChessGroup = function(chessGroup, selectSuccess) {
	let mediator = this.mediator;
	let scene = this;
	let room = mediator.room;
	let rule = mediator.rule;
	let player = null;

	if(!(room && room.id)) {
		return;
	}
	if(mediator.gameMode === 'net') {
		player = room.getPlayerByName(mediator.player.name);
		if(!player.isPlaying) {
			return;
		}
	}
	if(mediator.gameMode === 'local') {
		player = room.hostPlayer;
	}

	if(!player || !player.isPlaying) {
		return;
	}

	let chessboard = room.chessboard;
	let loc = chessGroup.loc;

	//翻开棋子
	if(rule.checkOverChess(chessboard, loc)) {
		player.sourceLoc = loc;
		player.overChessAction();
		return;
	}
	//玩家有阵营了之后
	if(player.camp !== CON.CAMP.neutral) {
		//选择目的棋子及位置
		if(rule.checkSelTarget(chessboard, loc, player.camp)) {
			if(player.sourceLoc !== -1) {
				let checkRet = rule.checkMoveChess(chessboard, player.selectChessArr, player.sourceLoc, loc);
				if(checkRet.isMove) {
					player.targetLoc = loc;
					player.moveChessAction();
					return;
				}
			}
		} else {
			if(rule.checkSelSource(chessboard, loc, player.camp)) {
				if(selectSuccess) {
					selectSuccess();
				}
				player.sourceLoc = loc;
				player.selectChessArr = chessGroup.getSelectChessArr();
			} else {
				player.sourceLoc = -1;
			}
			return;
		}
	}
	if(player.sourceLoc === -1) {
		player.selectChessArr = [];
	}

}

/**
 * @todo 玩家进入房间时回调
 */
BaseMainScene.prototype.enterRoomRet = function() {

}

/**
 * @todo 玩家准备时回调
 */
BaseMainScene.prototype.readyRet = function() {

}

/**
 * @todo 玩家离开房间时回调
 */
BaseMainScene.prototype.leaveRoomRet = function() {

}

/**
 * 游侠开始时回调
 */
BaseMainScene.prototype.gameStartRet = function() {
	this.initChessboardView();
	this.dialogManage.closeAllDialog();
}

/**
 * 玩家翻开棋子时回调 由服务器控制
 * @param {Object} overChess 翻开的棋子描述对象 来自服务器
 */
BaseMainScene.prototype.overChessRet = function(overChess) {
	var that = this;
	var chessGroup = this.getChessGroupByLoc(overChess.l);

	chessGroup.overChess(overChess.c, function() {
		that.cancelAllSelectChessGroup();
		chessGroup.setChessGroup([overChess.c]);
		chessGroup.selectChessGroup(true);
	});
}

/**
 * 玩家移动棋子时的回调 由服务器控制
 * @param {Object} moveChess 移动的棋子描述对象 来自服务器
 */
BaseMainScene.prototype.moveChessRet = function(moveChess) {
	let that = this;
	var chessGroup = this.getChessGroupByLoc(moveChess.sl);
	var targetChessGroup = this.getChessGroupByLoc(moveChess.tl);
	//记录移动前的棋子
	let sourceChessArr = chessGroup.chessArr;
	let targetChessArr = targetChessGroup.chessArr;

	//棋子移动
	var gameAnimationMap = {};
	gameAnimationMap[CON.ANIMATION_TYPE.css] = "moveChessUseCss";
	gameAnimationMap[CON.ANIMATION_TYPE.js] = "moveChessUseJs";

	var moveChessFun = gameAnimationMap[this.sceneSetting.gameAnimation];
	if(!moveChessFun) {
		moveChessFun = "moveChessUseJs";
	}
	//移动棋子
	chessGroup[moveChessFun](moveChess.tl, moveChess.p, moveChess.seA, moveEnd);
	//播放声音
	playMoveSound();

	function moveEnd() {
		chessGroup.setChessGroup(moveChess.sA);
		chessGroup.selectChessGroup(true);
		targetChessGroup.setChessGroup(moveChess.tA);
		targetChessGroup.selectChessGroup(true);
	}

	function playMoveSound() {
		let rule = that.mediator.rule;
		let chessTypeMap = rule.chessType;

		//行棋
		if(rule.isContainsChessType(targetChessArr, chessTypeMap.kong)) {
			gameSound.playGameSound("move");
			return;
		}
		if(rule.name = 'rule1') {
			if(rule.isContainsChessType(sourceChessArr, chessTypeMap.gong) &&
				rule.isContainsChessType(targetChessArr, chessTypeMap.qi) &&
				!rule.isContainsChessType(targetChessArr, chessTypeMap.gong) &&
				moveChess.tA.length > sourceChessArr.length) {
				gameSound.playGameSound("kangshang");
				return;
			}
			if(rule.isContainsChessType(sourceChessArr, chessTypeMap.gong) &&
				rule.isContainsChessType(targetChessArr, chessTypeMap.lei) &&
				!rule.isContainsChessType(targetChessArr, chessTypeMap.gong) &&
				moveChess.tA.length > sourceChessArr.length) {
				gameSound.playGameSound("washang");
				return;
			}
			if(rule.isContainsChessType(sourceChessArr, chessTypeMap.pai) &&
				rule.isContainsChessType(targetChessArr, chessTypeMap.zha) &&
				!rule.isContainsChessType(targetChessArr, chessTypeMap.pai)) {
				gameSound.playGameSound("paishang");
				return;
			}
			if(rule.isContainsChessType(sourceChessArr, chessTypeMap.lei) &&
				!rule.isContainsChessType(sourceChessArr, chessTypeMap.qi) &&
				!rule.isContainsChessType(targetChessArr, chessTypeMap.gong)) {
				gameSound.playGameSound("lei");
				return;
			}
			if(rule.isContainsChessType(sourceChessArr, chessTypeMap.zha) &&
				!rule.isContainsChessType(targetChessArr, chessTypeMap.pai)) {
				gameSound.playGameSound("zha");
				return;
			}
		}
		//相对了
		if(rule.isContainsChessType(moveChess.sA, chessTypeMap.kong) &&
			rule.isContainsChessType(moveChess.tA, chessTypeMap.kong)) {
			gameSound.playGameSound("xiangjiao");
			return;
		}
		gameSound.playGameSound("kill");
	}
}

/**
 * 游戏结束时回调 由服务器控制
 */
BaseMainScene.prototype.gameOverRet = function() {
	this.dialogManage.closeAllDialog();
	this.dialogManage.victory.show = true;
	//游戏结束清空棋盘
	//this.chessGroupArr.splice(0, this.chessGroupArr.length);
	if(!this.mediator.player) {
		return;
	}
	let myName = this.mediator.player.name;
	let player = this.mediator.room.getPlayerByName(myName);
	if(player) {
		if(CON.VICTORY_STATUS.win == player.victory) {
			gameSound.playGameSound("win");
		}
		if(CON.VICTORY_STATUS.lose == player.victory) {
			gameSound.playGameSound("lose");
		}
		if(CON.VICTORY_STATUS.draw == player.victory) {
			gameSound.playGameSound("ping");
		}
	}
}

/**
 * 求和操作时的回调 由服务器控制
 * @param {Object} data 来自服务器的数据
 */
BaseMainScene.prototype.suePeaceRet = function(data) {
	//是否请求求和
	let isRequest = data["isr"];
	if(isRequest) {
		this.dialogManage.suePeace.show = true;
		this.dialogManage.suePeace.setConfirm();
	} else {
		this.messageCenter.addTipMsg("对方拒绝和棋！");
	}
}

export default BaseMainScene