'use strict';
import CON from './../ConEnum'
import BaseRule from './BaseRule'
import util from './../../util'
import PathSearch from './PathSearch'

var Rule2 = (function() {

	/**
	 * @description 工兵扛军旗玩法2
	 * @author chengxg
	 * @since 2017-09-01
	 * @extends {BaseRule}
	 * @constructor
	 */
	function Rule2() {
		BaseRule.call(this);
		this.name = "rule2";
		this.description = "工兵夺军旗"; //玩法
		this.chessTypeKillsMap = {}; //棋子类型杀子map
		this.init();
	}

	Rule2.prototype = new BaseRule();

	/**
	 * 规则初始化
	 */
	Rule2.prototype.init = function() {
		this.extendBaseChessType();
		this.initChessAttr();
		this.initKillRule();
	}

	/**
	 * 扩展基础棋子类型
	 */
	Rule2.prototype.extendBaseChessType = function() {
		
	}

	/**
	 * 初始化棋子类型属性
	 */
	Rule2.prototype.initChessAttr = function() {
		this.initBaseChessTypeAttr();
		let getChessTypeAttr = this.getChessTypeAttr;
		let chessTypeAttr = this.chessTypeAttr;
		let ct = this.chessType;
		let moveType = CON.MOVE_TYPE;
		
		//在铁路线上所有的棋子可以在无阻碍的情况下 直行
		chessTypeAttr["leader"] = getChessTypeAttr(ct.leader, moveType.line, "司令");
		chessTypeAttr["jun"] = getChessTypeAttr(ct.jun, moveType.line, "军长");
		chessTypeAttr["shi"] = getChessTypeAttr(ct.shi, moveType.line, "师长");
		chessTypeAttr["lv"] = getChessTypeAttr(ct.lv, moveType.line, "旅长");
		chessTypeAttr["tuan"] = getChessTypeAttr(ct.tuan, moveType.line, "团长");
		chessTypeAttr["ying"] = getChessTypeAttr(ct.ying, moveType.line, "营长");
		chessTypeAttr["lian"] = getChessTypeAttr(ct.lian, moveType.line, "连长");
		chessTypeAttr["pai"] = getChessTypeAttr(ct.pai, moveType.line, "排长");
		chessTypeAttr["gong"] = getChessTypeAttr(ct.gong, moveType.curve, "工兵");
		chessTypeAttr["lei"] = getChessTypeAttr(ct.lei, moveType.unable, "地雷");
		chessTypeAttr["qi"] = getChessTypeAttr(ct.qi, moveType.unable, "军旗");
		chessTypeAttr["zha"] = getChessTypeAttr(ct.zha, moveType.line, "炸弹");
	}

	/**
	 * 初始化杀子规则
	 */
	Rule2.prototype.initKillRule = function() {
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
				[ct.gong, kt.kill]
			],
			"gong": [
				[ct.kong, kt.kill],
				[ct.gong, kt.die],
				[ct.lei, kt.kill],
				[ct.qi, kt.kill]
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
				[ct.pai, kt.die],
				[ct.gong, kt.die],
				[ct.lei, kt.die],
				[ct.qi, kt.die],
				[ct.zha, kt.die]
			]
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
	 * rule.kill([108,209],[201]);
	 * @param {Array} souArr 源棋子数组
	 * @param {Array} tarArr 被杀棋子数组
	 * @return {Object} 返回的结果
	 */
	Rule2.prototype.kill = function(souArr, tarArr) {
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
		normalKillRule();
		return ret;

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
	}

	/**
	 * 得到棋子组的类型
	 * @param {Array} chessArr 棋子数组  输入[109,210,210] => 910
	 * @return {Number} 棋子组类型
	 */
	Rule2.prototype.getChessType = function(chessArr) {
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
	Rule2.prototype.getChessAttr = function(chessArr) {
		return this.chessTypeAttr[this.chessType[this.getChessType(chessArr)]];
	}

	/**
	 * 得到棋子组的阵营
	 * @param {Array} chessArr 棋子数组
	 * @return {Number} 阵营 CON.CAMP
	 */
	Rule2.prototype.getChessCamp = function(chessArr) {
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
	Rule2.prototype.checkMoveChess = function(chessboard, selectArr, souLoc, tarLoc) {
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
				if(isKong) {
					return true;
				} else {
					return false;
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
	Rule2.prototype.checkOverChess = function(chessboard, loc) {
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
	Rule2.prototype.checkSelSource = function(chessboard, loc, myCamp) {
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
	Rule2.prototype.checkSelTarget = function(chessboard, loc, myCamp) {
		var chessGroupAttr = this.getChessAttr(chessboard[loc]);
		var chessCamp = this.getChessCamp(chessboard[loc]);
		var chessMove = chessGroupAttr.moveType;
		var chessType = chessGroupAttr.type;

		if(chessType === this.chessType.kong) { //此处空子,行琪
			return true;
		} else {
			//杀子
			if(chessCamp !== myCamp) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * 得到胜利状态
	 * @param {Array} chessboard 棋盘数组
	 * @param {Number} camp 阵营
	 * @param {Number} stepNum 当前行琪步数
	 * @param {Array} createChessArr 棋盘数组的创建数组
	 * @return {Number}  胜利状态 CON.VICTORY_STATUS
	 */
	Rule2.prototype.getVictory = function(chessboard, camp, stepNum, createChessArr) {
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

		if(!checkHaveJunqi()){
			if(camp === CON.CAMP.red) {
				return VICTORY_STATUS.redwin;
			} else {
				return VICTORY_STATUS.bluewin;
			}
		}

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
		 * 检查对方的军旗是否存在
		 */
		function checkHaveJunqi() {
			let oppCamp = CON.getOppositeCamp(camp);
			let haveJunqi = false;
			let len = createChessArr.length;
			for(let i = 0; i < len; i++) {
				let chess = createChessArr[i];
				let chessType = rule.getChessType([chess]);
				if(oppCamp === Math.floor(chess / 100) && chessType === ct.qi) {
					haveJunqi = true;
					break;
				}
			}
			if(!haveJunqi){
				for(let i = 0; i < 60; i++) {
					let chess = chessboard[i][0];
					let chessType = rule.getChessType(chessboard[i]);
					if(oppCamp === Math.floor(chess / 100) && chessType === ct.qi) {
						haveJunqi = true;
						break;
					}
				}
			}
			return haveJunqi;
		}

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
	return Rule2
})();
export default Rule2