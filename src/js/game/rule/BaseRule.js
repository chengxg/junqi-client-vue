'use strict';
import CON from './../ConEnum'

var BaseRule = (function() {
	/**
	 * 工兵扛军旗基础规则
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function BaseRule() {
		this.chessTypeAttr = {};
	}

	/**
	 * @description 工兵抗军旗 基础规则 棋子类型map
	 * 基本棋子类型（与颜色、数量无关）：
	 * 【空子：0，未翻开：500，司令：1，军长：2，师长：3，旅长：4，团长：5，营长：6，
	 * 连长：7，排长：8，工兵：9，地雷：10，军旗：22，炸弹：30】
	 * 蓝色棋子：基本类型棋子+100
	 * 红色棋子：基本类型棋子+200
	 */
	BaseRule.prototype.chessType = {
		kong: 0,
		cover: 500, //未知 类型
		//基本棋子类型
		leader: 1,
		jun: 2,
		shi: 3,
		lv: 4,
		tuan: 5,
		ying: 6,
		lian: 7,
		pai: 8,
		gong: 9,
		lei: 10,
		qi: 22,
		zha: 30,

		0: "kong",
		500: "cover",
		1: "leader",
		101: "leader",
		201: "leader",
		2: "jun",
		102: "jun",
		202: "jun",
		3: "shi",
		103: "shi",
		203: "shi",
		4: "lv",
		104: "lv",
		204: "lv",
		5: "tuan",
		105: "tuan",
		205: "tuan",
		6: "ying",
		106: "ying",
		206: "ying",
		7: "lian",
		107: "lian",
		207: "lian",
		8: "pai",
		108: "pai",
		208: "pai",
		9: "gong",
		109: "gong",
		209: "gong",
		10: "lei",
		110: "lei",
		210: "lei",
		22: "qi",
		122: "qi",
		222: "qi",
		30: "zha",
		130: "zha",
		230: "zha"
	}

	/**
	 * 工兵抗军旗 基础规则 所有棋子数组，共50个棋子
	 */
	BaseRule.prototype.allChessArr = [101, 102, 103, 103, 104, 104, 105, 105, 106, 106, 107, 107, 107, 108, 108, 108, 109, 109, 109, 110, 110, 110, 122, 130, 130,
		201, 202, 203, 203, 204, 204, 205, 205, 206, 206, 207, 207, 207, 208, 208, 208, 209, 209, 209, 210, 210, 210, 222, 230, 230
	];
	/**
	 * 工兵抗军旗  初始化基本棋子类型 属性
	 */
	BaseRule.prototype.initBaseChessTypeAttr = function() {
		let getChessTypeAttr = this.getChessTypeAttr;
		let chessTypeAttr = this.chessTypeAttr;
		let ct = this.chessType;
		let moveType = CON.MOVE_TYPE;
		chessTypeAttr["kong"] = getChessTypeAttr(ct.kong, moveType.unable, "");
		chessTypeAttr["cover"] = getChessTypeAttr(ct.cover, moveType.unable, "");

		chessTypeAttr["leader"] = getChessTypeAttr(ct.leader, moveType.oneStep, "司令");
		chessTypeAttr["jun"] = getChessTypeAttr(ct.jun, moveType.oneStep, "军长");
		chessTypeAttr["shi"] = getChessTypeAttr(ct.shi, moveType.oneStep, "师长");
		chessTypeAttr["lv"] = getChessTypeAttr(ct.lv, moveType.oneStep, "旅长");
		chessTypeAttr["tuan"] = getChessTypeAttr(ct.tuan, moveType.oneStep, "团长");
		chessTypeAttr["ying"] = getChessTypeAttr(ct.ying, moveType.oneStep, "营长");
		chessTypeAttr["lian"] = getChessTypeAttr(ct.lian, moveType.oneStep, "连长");
		chessTypeAttr["pai"] = getChessTypeAttr(ct.pai, moveType.oneStep, "排长");
		chessTypeAttr["gong"] = getChessTypeAttr(ct.gong, moveType.curve, "工兵");
		chessTypeAttr["lei"] = getChessTypeAttr(ct.lei, moveType.unable, "地雷");
		chessTypeAttr["qi"] = getChessTypeAttr(ct.qi, moveType.unable, "军旗");
		chessTypeAttr["zha"] = getChessTypeAttr(ct.zha, moveType.line, "炸弹");
	}

	/**
	 * 得到棋子类型对象
	 * @param {Number} type 棋子类型
	 * @param {Number} moveType 棋子移动类型
	 * @param {String} description 棋子描述
	 */
	BaseRule.prototype.getChessTypeAttr = function(type, moveType, description) {
		return {
			type: type,
			camp: 0,
			moveType: moveType,
			description: description
		}
	}

	BaseRule.prototype.kill = function(sourceType, targetType) {
		let isDiffCamp = (sourceType + targetType) % 100 === 3;
		let ret = -1;
		if(isDiffCamp) {
			let sou = sourceType % 100,
				tar = targetType % 100;
			if(sou < tar) {
				ret = 1;
			}
			if(sou === tar) {
				ret = 0;
			}
		}
		return ret;
	}

	return BaseRule;
})();

export default BaseRule