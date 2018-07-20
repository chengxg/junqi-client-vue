var ChessboardPara = (function() {
	/**
	 * 棋盘配置参数类
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function ChessboardPara() {
		this.getWindowPara();
		this.init(this.clientWidth, this.clientHeight);
	}
	/** 
	 * 单例模式
	 */
	ChessboardPara.Shared = function() {
		if(ChessboardPara.shared == null) {
			ChessboardPara.shared = new ChessboardPara();
		}
		return ChessboardPara.shared;
	};

	/**
	 * 刷新
	 */
	ChessboardPara.prototype.refresh = function() {
		this.getWindowPara();
		this.init(this.clientWidth, this.clientHeight);
	};

	/**
	 * 初始化窗口参数
	 */
	ChessboardPara.prototype.getWindowPara = function() {
		var wsw = window.screen.width;
		var wiw = window.innerWidth;
		var wsh = window.screen.height;
		var wih = window.innerHeight;

		//放大
		if(wsw / wiw > 1.25) {
			wiw = wsw;
			wih = wsh;
		}
		//缩小
		if(wsw / wiw < 0.75) {
			wiw = wsw;
			wih = wsh;
		}
		var screenWidth = wiw;
		var screenHeight = wih;
		var clientWidth = 0;
		var clientHeight = 0;
		if(screenHeight < screenWidth) {
			clientHeight = screenHeight;
			clientWidth = clientHeight * 5 / 8;
		} else {
			clientHeight = screenHeight;
			clientWidth = screenWidth;
		}

		this.clientHeight = Math.floor(clientHeight);
		this.clientWidth = Math.floor(clientWidth);
	}

	/**
	 * 初始化参数
	 * @param {Number} chessboardW
	 * @param {Number} chessboardH
	 */
	ChessboardPara.prototype.init = function(chessboardW, chessboardH) {
		var leftOffset = chessboardW / 10;
		var topOffset = chessboardH / 20;
		var stationW = leftOffset * 1.3;
		var stationH = topOffset * 1;
		var locSpaceX = (chessboardW - 2 * leftOffset) / 4;
		var hillSpace = topOffset * 3.5;
		var railwayColorSpace = chessboardW / 40;
		var locSpaceY = (chessboardH - 2 * topOffset - hillSpace) / 10;
		this.chessboardW = chessboardW; //棋盘宽度
		this.chessboardH = chessboardH; //高度
		this.leftOffset = leftOffset; //左上角位置 (11,0) 距离左边的距离
		this.topOffset = topOffset; //左上角位置 (11,0) 距离上边的距离
		this.stationW = stationW; //兵站宽度
		this.stationH = stationH;
		this.chessW = stationW; //棋子宽度
		this.chessH = stationH;
		this.locSpaceX = locSpaceX; //位置坐标间距 x轴
		this.hillSpace = hillSpace; //中间的 "山界" 宽度
		this.railwayColorSpace = railwayColorSpace; //铁路线颜色的间距
		this.locSpaceY = locSpaceY; //位置间距 y轴
	};

	/**
	 * 通过棋盘X位置得到 ，x的像素坐标
	 * @param {Number} X
	 * @return {Number}
	 */
	ChessboardPara.prototype.getPixelByLocX = function(X) {
		return this.locSpaceX * X + this.leftOffset;
	};
	/**
	 * 通过棋盘Y位置得到 ，y的像素坐标
	 * @param {Number} Y
	 * @return {Number}
	 */
	ChessboardPara.prototype.getPixelByLocY = function(Y) {
		if(Y <= 5) {
			return(10 - Y) * this.locSpaceY + this.topOffset + this.hillSpace;
		} else {
			return(11 - Y) * this.locSpaceY + this.topOffset;
		}
	};
	/**
	 * 通过像素坐标获取位置
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Boolean} isInnerStation
	 * @return {Number} 位置
	 */
	ChessboardPara.prototype.getLocByPixel = function(x, y, isInnerStation) {
		var X = 0,
			Y = 0;
		var X = Math.round((x - this.leftOffset) / this.locSpaceX);
		if(y >= this.chessboardH / 2) {
			//位置在棋盘下半部分
			Y = 10 - Math.round((y - this.topOffset - this.hillSpace) / this.locSpaceY);
		} else {
			Y = 11 - Math.round((y - this.topOffset) / this.locSpaceY);
		}
		var isInnerStation = isInnerStation || true;
		if(isInnerStation) {
			var stationx = this.getPixelByLocX(X);
			var stationy = this.getPixelByLocY(Y);
			if(Math.abs(x - stationx) < this.stationW / 2 && Math.abs(y - stationy) < this.stationH / 2) {
				return X + Y * 5;
			} else {
				return -1;
			}
		}
		return X + Y * 5;
	};
	return ChessboardPara;
}());

export default ChessboardPara.Shared()