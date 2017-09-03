'use strict';
import CON from './../ConEnum'
import BaseRule from './BaseRule'
import util from './../../util'
import PathSearch from './PathSearch'

var Rule1 = (function() {

	/**
	 * @description 工兵扛军旗玩法1
	 * @author chengxg
	 * @since 2017-09-01
	 * @extends {BaseRule}
	 * @constructor
	 */
	function Rule1() {
		BaseRule.call(this);
		this.name = "rule1";
		this.description = "工兵抗军旗"; //玩法
		this.chessTypeKillsMap = {}; //棋子类型杀子map
		this.init();
	}

	Rule1.prototype = new BaseRule();

	/**
	 * 规则初始化
	 */
	Rule1.prototype.init = function() {
		this.extendBaseChessType();
		this.initChessAttr();
		this.initKillRule();
	}

	/**
	 * 扩展基础棋子类型
	 */
	Rule1.prototype.extendBaseChessType = function() {
		/**
		 * 组合棋子类型 ，组合棋子类型有顺序。大大减少冗余
		 * 组合棋子共5中类型 【排长+炸弹】，【工兵+地雷】，【工兵=军旗】、【工兵+地雷+军旗】、【地雷+军旗】
		 */
		let groupChessType = {
			"pai_zha": 830,
			"gong_lei": 910,
			"gong_qi": 922,
			"gong_lei_qi": 91022,
			"lei_qi": 1022,

			830: "pai_zha",
			83030: "pai_zha",
			910: "gong_lei",
			91010: "gong_lei",
			9101010: "gong_lei",
			922: "gong_qi",
			91022: "gong_lei_qi",
			9101022: "gong_lei_qi",
			910101022: "gong_lei_qi",
			1010: "lei_qi",
			101010: "lei_qi",
			1022: "lei_qi",
			101022: "lei_qi",
			10101022: "lei_qi"
		};
		util.extend(this.chessType, groupChessType);
	}

	/**
	 * 初始化棋子类型属性
	 */
	Rule1.prototype.initChessAttr = function() {
		this.initBaseChessTypeAttr();
		let getChessTypeAttr = this.getChessTypeAttr;
		let chessTypeAttr = this.chessTypeAttr;
		let ct = this.chessType;
		let moveType = CON.MOVE_TYPE;

		chessTypeAttr["pai_zha"] = getChessTypeAttr(ct.pai_zha, moveType.oneStep, "");
		chessTypeAttr["gong_lei"] = getChessTypeAttr(ct.gong_lei, moveType.curve, "");
		chessTypeAttr["gong_qi"] = getChessTypeAttr(ct.gong_qi, moveType.curve, "");
		chessTypeAttr["gong_lei_qi"] = getChessTypeAttr(ct.gong_lei_qi, moveType.curve, "");
		chessTypeAttr["lei_qi"] = getChessTypeAttr(ct.lei_qi, moveType.unable, "");
	}

	/**
	 * 初始化杀子规则
	 */
	Rule1.prototype.initKillRule = function() {
		let chessTypeAttr = this.chessTypeAttr;
		let ct = this.chessType;
		let kt = CON.KILL_TYPE;

		let chessTypeKillsMap = {
			"kong": [],
			"cover": [],
			"leader": [
				[ct.kong, kt.kill],
				[ct.leader, kt.die],
				[ct.jun, kt.kill],
				[ct.shi, kt.kill],
				[ct.lv, kt.kill],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"jun": [
				[ct.kong, kt.kill],
				[ct.jun, kt.die],
				[ct.shi, kt.kill],
				[ct.lv, kt.kill],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"shi": [
				[ct.kong, kt.kill],
				[ct.shi, kt.die],
				[ct.lv, kt.kill],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"lv": [
				[ct.kong, kt.kill],
				[ct.lv, kt.die],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"tuan": [
				[ct.kong, kt.kill],
				[ct.tuan, kt.die],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"ying": [
				[ct.kong, kt.kill],
				[ct.ying, kt.die],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"lian": [
				[ct.kong, kt.kill],
				[ct.lian, kt.die],
				[ct.pai, kt.kill],
				[ct.gong, kt.kill]
			],
			"pai": [
				[ct.kong, kt.kill],
				[ct.pai, kt.die],
				[ct.gong, kt.kill],
				[ct.pai_zha, kt.die],
				[ct.zha, kt.capture]
			],
			"gong": [
				[ct.kong, kt.kill],
				[ct.gong, kt.die],
				[ct.lei, kt.capture],
				[ct.qi, kt.capture],
				[ct.gong_lei, kt.die],
				[ct.gong_qi, kt.die],
				[ct.gong_lei_qi, kt.die],
				[ct.lei_qi, kt.capture]
			],
			"lei": [],
			"qi": [],
			"zha": [
				[ct.kong, kt.kill],
				[ct.leader, kt.die],
				[ct.jun, kt.die],
				[ct.shi, kt.die],
				[ct.lv, kt.die],
				[ct.tuan, kt.die],
				[ct.ying, kt.die],
				[ct.lian, kt.die],
				[ct.gong, kt.die],
				[ct.lei, kt.die],
				[ct.qi, kt.die],
				[ct.gong_lei, kt.die],
				[ct.gong_qi, kt.die],
				[ct.gong_lei_qi, kt.die],
				[ct.lei_qi, kt.die],
				[ct.zha, kt.die]
			],
			"pai_zha": [
				[ct.kong, kt.kill],
				[ct.leader, kt.bomb],
				[ct.jun, kt.bomb],
				[ct.shi, kt.bomb],
				[ct.lv, kt.bomb],
				[ct.tuan, kt.bomb],
				[ct.ying, kt.bomb],
				[ct.lian, kt.bomb],
				[ct.pai, kt.die],
				[ct.gong, kt.kill],
				[ct.lei, kt.bomb],
				[ct.qi, kt.bomb],
				[ct.zha, kt.capture],

				[ct.pai_zha, kt.die],
				[ct.gong_qi, kt.bomb],
				[ct.gong_lei, kt.bomb],
				[ct.gong_lei_qi, kt.bomb],
				[ct.lei_qi, kt.bomb]
			],
			"gong_lei": [
				[ct.kong, kt.kill],
				[ct.leader, kt.bomb],
				[ct.jun, kt.bomb],
				[ct.shi, kt.bomb],
				[ct.lv, kt.bomb],
				[ct.tuan, kt.bomb],
				[ct.ying, kt.bomb],
				[ct.lian, kt.bomb],
				[ct.pai, kt.bomb],
				[ct.gong, kt.die],
				[ct.lei, kt.capture],
				[ct.qi, kt.capture],

				[ct.gong_qi, kt.die],
				[ct.gong_lei, kt.die],
				[ct.gong_lei_qi, kt.die],
				[ct.lei_qi, kt.capture]
			],
			"gong_qi": [
				[ct.kong, kt.kill],
				[ct.leader, kt.kill],
				[ct.jun, kt.kill],
				[ct.shi, kt.kill],
				[ct.lv, kt.kill],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.die],
				[ct.lei, kt.capture],

				[ct.gong_qi, kt.die],
				[ct.gong_lei, kt.die],
				[ct.gong_lei_qi, kt.die],
				[ct.lei_qi, kt.capture]
			],
			"gong_lei_qi": [
				[ct.kong, kt.kill],
				[ct.leader, kt.kill],
				[ct.jun, kt.kill],
				[ct.shi, kt.kill],
				[ct.lv, kt.kill],
				[ct.tuan, kt.kill],
				[ct.ying, kt.kill],
				[ct.lian, kt.kill],
				[ct.pai, kt.kill],
				[ct.gong, kt.die],
				[ct.lei, kt.capture],

				[ct.gong_qi, kt.die],
				[ct.gong_lei, kt.die],
				[ct.gong_lei_qi, kt.die],
				[ct.lei_qi, kt.capture]
			],
			"lei_qi": []
		};
		this.chessTypeKillsMap = chessTypeKillsMap;
		//添加到棋子属性中
		for(let filed in chessTypeKillsMap) {
			this.chessTypeAttr[filed]["kills"] = chessTypeKillsMap[filed];
		}
	}

	/**
	 * @description 杀子 规则
	 * @example
	 * rule.kill([108,209],{201});
	 * @param {Array} souArr 源棋子数组
	 * @param {Array} tarArr 被杀棋子数组
	 * @return {Object} 返回的结果
	 */
	Rule1.prototype.kill = function(souArr, tarArr) {
		let ct = this.chessType,
			ca = this.chessTypeAttr;
		souArr = util.clone(souArr);
		tarArr = util.clone(tarArr);
		let souGroupType = getChessType(souArr),
			tarGroupType = getChessType(tarArr);
		let souMainChessType = souArr[0] % 100,
			tarMainChessType = tarArr[0] % 100;
		let souGroupAttr = ca[ct[souGroupType]],
			tarGroupAttr = ca[ct[tarGroupType]];

		//是否为不同的阵营
		let isDiffCamp = Math.floor(souArr[0] / 100) !== Math.floor(tarArr[0] / 100);

		let ret = {
			"kill": false, //棋子是否可以杀掉
			"arr": souArr //杀掉目标棋子后，源棋子组
		};
		specialKillRule() || normalKillRule();
		return ret;

		/**
		 * 特殊杀子规则 己方的【排长+炸弹】或【工兵+地雷】可以炸掉自己的【地雷】或【军旗】
		 * @return {Boolean}
		 */
		function specialKillRule() {
			if(isDiffCamp) {
				return false;
			}
			let souIsBomb = [ct.zha, ct.pai_zha, ct.gong_lei, ct.gong_lei_qi].indexOf(souGroupType) > -1;
			let tarCondition = tarGroupType === ct.lei || tarGroupType === ct.qi;

			if(souIsBomb && tarCondition) {
				ret.kill = true;
				throwOneBomb(ret.arr);
				return true;
			}

			return false;
		}

		/**
		 * 普通杀棋规则
		 * @return {Boolean}
		 */
		function normalKillRule() {
			if(!isDiffCamp) {
				return false;
			}

			let kills = souGroupAttr.kills;

			for(let i = 0, len = kills.length; i < len; i++) {
				let item = kills[i];
				if(item[0] === tarGroupType) {
					let killType = item[1];
					ret.kill = true;
					switch(killType) {
						case CON.KILL_TYPE.kill:
							ret.arr = souArr;
							break;
						case CON.KILL_TYPE.die:
							ret.arr = [0];
							break;
						case CON.KILL_TYPE.bomb:
							throwOneBomb(ret.arr);
							break;
						case CON.KILL_TYPE.capture:
							ret.arr = souArr.concat(tarArr);
							ret.arr = captureSort(ret.arr);
							break;
					}
					return true;
				}
			}

			return false;
		}

		/**
		 * 得到棋子组的类型
		 * @param {Array} chessArr 棋子数组  输入[109,210,210] => 910
		 * @return {Number} 棋子组类型
		 */
		function getChessType(chessArr) {
			let type = "";
			chessArr.forEach(function(item) {
				type += item % 100;
			});
			return ct[ct[type]];
		}

		/**
		 * 捕获棋子，棋子组排序  按照 【工兵】、【地雷】、【军旗】或【排长】、【炸弹】来排序
		 * @param {Array} chessArr 棋子数组  如：[109,210,210]
		 * @return {Array} newChessArr 排序后的棋子
		 */
		function captureSort(chessArr) {
			let newChessArr = [];
			[ct.gong, ct.lei, ct.qi, ct.pai, ct.zha].forEach(function(chessType) {
				chessArr.forEach(function(chess) {
					if(chessType === chess % 100) {
						newChessArr.push(chess);
					}
				})
			})
			return newChessArr;
		}
		/**
		 * 扔掉一个炸
		 * @param {Array} srcArr 棋子数组，该棋子组会被改变
		 * @return {Boolean} 是否扔掉了一个炸
		 */
		function throwOneBomb(srcArr) {
			let bombArr = [ct.lei, ct.zha]; //炸的类型
			let i = 0,
				j = 0,
				srcArrLen = srcArr.length,
				bombLen = bombArr.length;

			for(i = 0; i < srcArrLen; i++) {
				for(j = 0; j < bombLen; j++) {
					if(srcArr[i] % 100 === bombArr[j]) {
						srcArr.splice(i, 1);
						if(srcArr.length === 0) {
							srcArr.push(0);
						}
						return true;
					}
				}
			}
			return false;
		}
	}

	/**
	 * 得到棋子组的类型
	 * @param {Array} chessArr 棋子数组  输入[109,210,210] => 910
	 * @return {Number} 棋子组类型
	 */
	Rule1.prototype.getChessType = function(chessArr) {
		let type = "";
		if(chessArr[0] === this.chessType.cover) {
			return this.chessType.cover;
		}
		chessArr.forEach(function(item) {
			type += item % 100;
		});
		return this.chessType[this.chessType[type]];
	}

	/**
	 * 得到棋子组的属性
	 * @param {Array} chessArr 棋子数组
	 * @return {Object} chessAttr 棋子组的属性
	 */
	Rule1.prototype.getChessAttr = function(chessArr) {
		return this.chessTypeAttr[this.chessType[this.getChessType(chessArr)]];
	}

	/**
	 * 得到棋子组的阵营
	 * @param {Array} chessArr 棋子数组
	 * @return {Number} 阵营 CON.CAMP
	 */
	Rule1.prototype.getChessCamp = function(chessArr) {
		//第一个棋子的类型就决定了棋子组的阵营
		let mainChess = chessArr[0];
		if(mainChess % 100 > 0) {
			return Math.floor(mainChess / 100);
		} else {
			return CON.CAMP.neutral;
		}
	}

	/**
	 * 检查移动棋子
	 * @param {Array} chessboard 棋盘数组
	 * @param {Array} selectArr 选择的棋子数组
	 * @param {Number} souLoc 移动棋子的开始坐标
	 * @param {Number} tarLoc 棋子的终止坐标
	 * @return {Object} 返回结果
	 */
	Rule1.prototype.checkMoveChess = function(chessboard, selectArr, souLoc, tarLoc) {
		let ct = this.chessType,
			ca = this.chessTypeAttr;
		/**
		 * @property {Boolean} isMove 是否可以移动
		 * @property {Number} souLoc 起始位置
		 * @property {Number} tarLoc 终止位置
		 * @property {Array} selectArr 选择的棋子数组
		 * @property {Array} sourceArr 移动后开始位置的棋子数组
		 * @property {Array} targetArr 移动后终止位置的棋子数组
		 * @property {Array} path 移动的位置路径
		 */
		let result = {
			isMove: false,
			souLoc: souLoc,
			tarLoc: tarLoc,
			selectArr: null,
			sourceArr: null,
			targetArr: null,
			path: []
		};

		let sourceArr = util.clone(chessboard[souLoc]),
			targetArr = util.clone(chessboard[tarLoc]);

		let isSelectPart = true; //是否只选择了一部分
		if(selectArr.length === sourceArr.length) {
			isSelectPart = false;
		}

		let selChessGroupType = this.getChessType(selectArr),
			souChessGroupType = this.getChessType(sourceArr),
			tarChessGroupType = this.getChessType(targetArr);

		let selChessGroupAttr = this.getChessAttr(selectArr),
			souChessGroupAttr = this.getChessAttr(sourceArr),
			tarChessGroupAttr = this.getChessAttr(targetArr);

		result.isMove = separateSelChessArr() && xingyingRule() && pathRule();
		if(result.isMove) {
			result.selectArr = selectArr;
			result.sourceArr = sourceArr;
			if(tarChessGroupType === ct.kong) { //行琪
				result.targetArr = selectArr;
			} else { //杀子
				let killRet = this.kill(selectArr, targetArr);
				result.isMove = result.isMove && killRet.kill;
				result.targetArr = killRet.arr;
			}
		}

		return result;

		/**
		 * 去除源棋子数组 中 选择的棋子数组
		 * @return {Boolean} 是否完成分离
		 */
		function separateSelChessArr() {
			//源棋子类型 与 选择的棋子类型相等 则全部选择
			if(!isSelectPart) {
				sourceArr = [0];
				return true;
			}
			//选择一部分
			if(isSelectPart) {
				//将源棋子组 分离出 选择的 棋子
				selectArr.forEach(function(item, index) {
					for(let i = 0; i < sourceArr.length; i++) {
						if(sourceArr[i] === item) {
							sourceArr.splice(i, 1);
							break;
						}
					}
				});
				return true;
			}

			return false;
		}

		/**
		 * 行营的规则
		 * 行营中有棋子不能再进入,炸弹不能进行营
		 * 行营中组合棋子 不能选择一部分
		 * @return {Boolean} 该规则是否验证通过
		 */
		function xingyingRule() {
			if(CON.POSITION_GRAPH[tarLoc].length === 8) {
				//行营中有棋子不能再进入,炸弹不能进行营
				let isKong = tarChessGroupType === ct.kong;
				let isZha = selChessGroupType === ct.zha;
				if(isKong && !isZha) {
					return true;
				} else {
					return false;
				}
			}
			if(CON.POSITION_GRAPH[souLoc].length === 8) {
				//行营中组合棋子 不能选择一部分
				if(isSelectPart) {
					return false;
				} else {
					return true;
				}
			}

			return true;
		}

		/**
		 * 棋子移动规则 如果可以移动则 设置 移动的路径
		 * 单步移动
		 * 在铁路线上走直线
		 * 在铁路线上走弯道
		 * @return {Boolean} 是否可以移动
		 */
		function pathRule() {
			let moveType = selChessGroupAttr.moveType;
			if(moveType === CON.MOVE_TYPE.unable) {
				return false;
			}
			//单步移动
			let isNext = CON.isNextPosition(souLoc, tarLoc);
			if(isNext) {
				result.path.push(souLoc);
				result.path.push(tarLoc);
				return true;
			}
			//在铁路线上走直线
			if(moveType === CON.MOVE_TYPE.line) {
				let lineResult = PathSearch.linePath(chessboard, souLoc, tarLoc);
				if(lineResult.isMove) {
					result.path = lineResult.path;
					return true;
				} else {
					return false;
				}
			}
			//在铁路线上走弯道
			if(moveType === CON.MOVE_TYPE.curve) {
				let curveResult = PathSearch.curvePath(chessboard, souLoc, tarLoc);
				if(curveResult.isMove) {
					result.path = curveResult.path;
					return true;
				} else {
					return false;
				}
			}
			return false;
		}

	}

	/**
	 * 检查是否可以翻开棋子
	 * @param {Array} chessboard 棋盘数组
	 * @param {Number} loc 翻开的棋子位置
	 * @return {Boolean} 结果
	 */
	Rule1.prototype.checkOverChess = function(chessboard, loc) {
		if(chessboard[loc][0] === this.chessType.cover) {
			return true;
		}
		return false;
	}

	/**
	 * 检查是否可以选择起始位置
	 * @param {Array} chessboard 棋盘数组
	 * @param {Number} loc 棋子组位置
	 * @param {Number} myCamp 我的阵营
	 * @return {Boolean} 是否可以选择
	 */
	Rule1.prototype.checkSelSource = function(chessboard, loc, myCamp) {
		var chessGroupAttr = this.getChessAttr(chessboard[loc]);
		var chessCamp = this.getChessCamp(chessboard[loc]);
		var chessMove = chessGroupAttr.moveType;
		if(chessCamp === myCamp && chessMove !== CON.MOVE_TYPE.unable) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 检查是否可以选择目标位置 
	 * @param {Array} chessboard 棋盘数组
	 * @param {Number} loc 棋子组位置
	 * @param {Number} myCamp 我的阵营
	 * @return {Boolean} 是否可以选择
	 */
	Rule1.prototype.checkSelTarget = function(chessboard, loc, myCamp) {
		var chessGroupAttr = this.getChessAttr(chessboard[loc]);
		var chessCamp = this.getChessCamp(chessboard[loc]);
		var chessMove = chessGroupAttr.moveType;
		var chessType = chessGroupAttr.type;

		if(chessType === this.chessType.kong) { //此处空子,行琪
			return true;
		} else {
			//杀子
			if(chessCamp === myCamp && chessMove !== CON.MOVE_TYPE.unable) {
				//可以炸掉自己的地雷,军旗
				return false;
			} else {
				return true;
			}
		}
	}

	/**
	 * 得到胜利状态
	 * @param {Array} chessboard 棋盘数组
	 * @param {Number} camp 阵营
	 * @param {Number} stepNum 当前行琪步数
	 * @return {Number}  胜利状态 CON.VICTORY_STATUS
	 */
	Rule1.prototype.getVictory = function(chessboard, camp, stepNum) {
		let VICTORY_STATUS = CON.VICTORY_STATUS,
			POSITION_GRAPH = CON.POSITION_GRAPH,
			MOVE_TYPE = CON.MOVE_TYPE;
		//棋子步数 大于等于 1000步平局
		if(stepNum >= 1000) {
			return VICTORY_STATUS.draw;
		}
		let rule = this;
		let ca = this.chessTypeAttr,
			ct = this.chessType;

		//对方是否能够移动
		let oppIsMove = checkOppIsMove();
		let myChessNum = countMyChessNum();
		//双方都无子可走,平局
		if(!oppIsMove && myChessNum === 0) {
			return VICTORY_STATUS.draw;
		}
		//对方无子可走,判胜
		if(!oppIsMove) {
			if(camp === CON.CAMP.red) {
				return VICTORY_STATUS.redwin;
			} else {
				return VICTORY_STATUS.bluewin;
			}
		}
		//自己没有棋子了,判输
		if(myChessNum === 0) {
			if(camp === CON.CAMP.red) {
				return VICTORY_STATUS.bluewin;
			} else {
				return VICTORY_STATUS.redwin;
			}
		}

		return VICTORY_STATUS.playing;

		/**
		 * 统计己方的可移动棋子数量
		 * @return {Number} 数量
		 */
		function countMyChessNum() {
			let chessObj = null;
			let myChessCount = 0; //记录自己棋子的数量
			for(let i = 0; i < 60; i++) {
				chessObj = rule.getChessAttr(chessboard[i]);
				if(camp === Math.floor(chessboard[i][0] / 100) && chessObj.moveType !== CON.MOVE_TYPE.unable) {
					myChessCount++;
				}
				if(chessObj.type === 500) {
					myChessCount++;
				}
			}
			return myChessCount;
		}

		/**
		 * 检查对方的棋子是否有能够移动的
		 * @return {Boolean} 对方是否可以移动
		 */
		function checkOppIsMove() {
			let oppCamp = CON.getOppositeCamp(camp); //得到对方的阵营
			let i = 0,
				j = 0,
				len = 0;
			let chessObj = null, //该位置 棋子属性
				chessNextObj = null, //相邻位置棋子属性
				nextPositionArr = [], //相邻棋子数组
				nextPosition = -1; //相邻棋子位置

			//1.检查对方无子可走
			for(i = 0; i < 60; i++) {
				chessObj = rule.getChessAttr(chessboard[i]);
				//有未翻开的
				if(chessObj.type === ct.cover) {
					return true;
				}

				if(oppCamp === Math.floor(chessboard[i][0] / 100) &&
					chessObj.moveType !== MOVE_TYPE.unable) { //对方的可移动棋子

					nextPositionArr = POSITION_GRAPH[i];
					len = nextPositionArr.length;
					//检查 该棋子是否可以移动
					for(j = 0; j < len; j++) {
						nextPosition = nextPositionArr[j];
						chessNextObj = rule.getChessAttr(chessboard[nextPosition]);
						//判断是否可以移动
						if(chessNextObj.type === ct.kong) {
							return true;
						} else {
							//对方 杀 己方
							let ret = rule.kill(chessboard[i], chessboard[nextPosition]);
							if(ret.kill) {
								return true;
							}
						}
					}
				}
			}
			return false;
		}

	}
	return Rule1
})();
export default Rule1