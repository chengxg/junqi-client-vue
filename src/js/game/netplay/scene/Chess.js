'use strict';
import CBP from './../../ChessboardPara'

var Chess = (function() {
	/**
	 * 棋子类构造函数
	 * @author chengxg
	 * @since 2017-09-01
	 * @param {Number} chessType 棋子类型
	 * @param {Number} camp 阵营
	 * @param {ChessGroup} chessGroup 所属棋子组
	 * @param {Object} chessAttr 棋子属性
	 * @constructor
	 */
	function Chess(chessType, camp, chessGroup, chessAttr) {
		Object.defineProperty(this, "chessGroup", {
			value: chessGroup,
			enumerable: false
		});
		this.moveClass = "";
		this.isSelect = false; //是否被选择
		this.width = CBP.stationW; //棋子的宽度
		this.height = CBP.stationH;
		this.x = 0; //棋子左上角的坐标
		this.y = 0;
		this.chessType = chessType;
		this.camp = camp;
		this.chessAttr = chessAttr;
		this.touchEnabled = false; //当前是否可以触摸
	}

	/**
	 * 点击棋子
	 */
	Chess.prototype.clickChess = function() {
		if(this.isSelect) {
			this.chessGroup.selectChess(this, false);
		} else {
			this.chessGroup.selectChess(this, true);
		}
	}

	return Chess
})();

export default Chess