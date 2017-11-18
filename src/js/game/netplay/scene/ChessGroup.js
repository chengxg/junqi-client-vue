'use strict';
import CBP from './../../ChessboardPara'
import BC from './../../BrowseCompatibility'
import CON from './../../ConEnum'
import Chess from './Chess'
import gameSound from './GameSound'

/**
 * 棋子组类
 * @property {Number} chessOffset 多个棋子的偏移
 */
var ChessGroup = (function() {
	/**
	 * 棋子组构造函数
	 * @author chengxg
	 * @since 2017-09-01
	 * @author chengxg
	 * @since 2017-08-01
	 * @param {MainScene} scene 主场景
	 * @param {Number} loc 棋子的位置（0-59），左下角：0，右上角59
	 * @constructor
	 */
	function ChessGroup(scene, loc) {
		//场景
		Object.defineProperty(this, "scene", {
			value: scene,
			enumerable: false
		});

		this.chessOffset = 3; //多个棋子的偏移
		this.loc = loc; //棋子组的位置
		this.x = 0; //棋子组的横纵坐标 （中心点）
		this.y = 0;

		this.camp = CON.CAMP.neutral; //棋子组的阵营
		this.chessAttr = null; //棋子组的属性
		this.chessArr = []; //棋子组中的 棋子 类型 数组，如[108,230]
		this.selectChessArr = []; // 被选择的 棋子类型
		this.chessShapeArr = []; //对应 chessArr 的棋子对象 按照 【工兵】、【地雷】、【军旗】或【排长】、【炸弹】来排序
		this.panelChessShapeArr = []; // 选择面板中的棋子组对象
		this.selectPanel = {

		}; //棋子选择面板

		this.touchEnabled = true; //当前是否可以触摸
		this.initSelectChessPanel();
	}
	/**
	 * 初始化棋子选择面板
	 */
	ChessGroup.prototype.initSelectChessPanel = function() {
		let X = this.loc % 5;
		let Y = Math.floor(this.loc / 5);
		let chessW = CBP.chessW;
		let chessH = CBP.chessH;
		let panelW = chessW * 2.3; //面板宽度
		let paddingX = chessW * 0.1; //棋子x间距
		let panelH = chessH * 2.6;
		let paddingY = chessH * 0.2;

		this.selectPanel = {
			panelW: panelW, //面板宽度
			panelH: panelH,
			paddingX: paddingX, //面板内棋子的间距
			paddingY: paddingY,
			isVisible: false,
			x: 0, //面板相对于棋子组的位置
			y: 0
		};

		//设置面板的位置
		if(X < 3) {
			this.selectPanel.x = chessW + 10;
		} else {
			this.selectPanel.x = -20 - panelW;
		}
		if(Y > 0) {
			this.selectPanel.y = 0;
		} else {
			this.selectPanel.y = chessH - panelH;
		}
	};

	/**
	 * 设置棋子组的类型
	 * @param {Array} chessArr 对应棋子组的数字Array，每个数字代表一个棋子,如[108,230]
	 */
	ChessGroup.prototype.setChessGroup = function(chessArr) {
		this.chessArr = chessArr;
		this.selectChessArr = [];
		this.chessAttr = this.scene.mediator.rule.getChessAttr(this.chessArr);
		this.camp = this.scene.mediator.rule.getChessCamp(this.chessArr);
		this.initChessGroup();
	};
	/**
	 * 初始化棋子组
	 */
	ChessGroup.prototype.initChessGroup = function() {
		let chessW = CBP.chessW;
		let chessH = CBP.chessH;
		this.width = chessW;
		this.height = chessH;
		this.x = Math.floor(CBP.getPixelByLocX(this.loc % 5) - chessW / 2);
		this.y = Math.floor(CBP.getPixelByLocY(Math.floor(this.loc / 5)) - chessH / 2);
		let len = this.chessArr.length;

		this.chessShapeArr = [];
		this.panelChessShapeArr = [];
		let rule = this.scene.mediator.rule;
		for(let i = 0; i < len; i++) {
			let chessType = this.chessArr[i];
			let chessAttr = rule.getChessAttr([chessType]);
			let camp = rule.getChessCamp([chessType]);
			let chess = new Chess(chessType, camp, this, chessAttr);
			this.chessShapeArr.push(chess);
			if(len <= 1) {
				continue;
			}
			//棋子组的 非 主要棋子(棋子组不能移动的 或者 不和该棋子组同阵营的棋子)
			if(chessAttr.moveType === CON.MOVE_TYPE.unable ||
				this.camp !== chess.camp) {
				let panelChess = new Chess(chessType, camp, this, chessAttr);
				this.panelChessShapeArr.push(panelChess);
			}
		}
		this.refreshChessGroup();
	};

	/**
	 * 刷新 棋子组 ,以便正确显示，如（棋子选择的状态）
	 */
	ChessGroup.prototype.refreshChessGroup = function() {
		let chessGroup = this;
		let len = this.chessShapeArr.length - 1;
		this.chessShapeArr.forEach(function(chess, i) {
			chess.x = -chessGroup.chessOffset * (len - i);
			chess.y = -chessGroup.chessOffset * (len - i);
		});
		let chessW = CBP.chessW,
			chessH = CBP.chessH,
			paddingX = this.selectPanel.paddingX,
			paddingY = this.selectPanel.paddingY;
		let row = 0,
			col = 0; //棋子面板中 棋子的行和列
		this.panelChessShapeArr.forEach(function(chess, i) {
			row = Math.floor(i / 2);
			col = i % 2;
			chess.x = chessW * col + paddingX + paddingX * col;
			chess.y = chessH * row + paddingY + paddingY * row;
		});
		this.refreshPanelChessShapeSelectStatus();
	};

	/**
	 * 刷新棋子选择面板的选择状态
	 */
	ChessGroup.prototype.refreshPanelChessShapeSelectStatus = function() {
		let chessShapeArr = this.chessShapeArr;
		if(this.panelChessShapeArr.length < this.chessShapeArr.length) {
			this.panelChessShapeArr.forEach(function(panelChess, i) {
				let chess = chessShapeArr[i + 1];
				panelChess.isSelect = chess.isSelect;
			});
		} else {
			//存在【地雷+地雷】等这样不可移动的棋子组
			this.panelChessShapeArr.forEach(function(panelChess, i) {
				let chess = chessShapeArr[i];
				panelChess.isSelect = chess.isSelect;
			});
		}
	};

	/**
	 * 显示或隐藏棋子选择面板
	 */
	ChessGroup.prototype.showOrHideSelectPanel = function() {
		if(this.selectPanel.isVisible) {
			this.selectPanel.isVisible = false;
			return;
		}
		//棋子组中至少两个两个棋子才显示选择棋子面板
		if(this.chessArr.length < 2) {
			return;
		}

		this.acquireFocus();

		//棋子是否可以点击 ,当前下棋者可以点击选择 自己 的棋子
		let isClickChess = false;
		let player = this.scene.mediator.getMePlayer();
		if(player) {
			if(player.isPlaying && player.camp === this.camp) {
				isClickChess = true;
			}
		}

		this.panelChessShapeArr.forEach(function(chess, i) {
			chess.touchEnabled = isClickChess;
		});
		this.selectPanel.isVisible = true;
	};

	/**
	 * 得到棋子组的主要棋子，如：【工兵+地雷】中的工兵
	 * @return {Chess}
	 */
	ChessGroup.prototype.getMainChess = function() {
		let mainChess = null;

		//棋子组的 主要棋子(棋子组能能移动的 并且 和该棋子组同阵营的棋子)
		if(this.chessAttr.moveType != CON.MOVE_TYPE.unable &&
			this.camp === this.chessShapeArr[0].camp) {
			mainChess = this.chessShapeArr[0];
		}

		return mainChess;
	};

	/**
	 * 是否选择棋子组
	 * @param {Boolean} isSelect 是否选择
	 */
	ChessGroup.prototype.selectChessGroup = function(isSelect) {
		this.chessShapeArr.forEach(function(chess) {
			chess.isSelect = isSelect;
		});
		this.refreshPanelChessShapeSelectStatus();
	};

	/**
	 * 得到选择的棋子类型数组
	 * @return {Array<Number>}
	 */
	ChessGroup.prototype.getSelectChessArr = function() {
		let selectChessArr = [];
		this.chessShapeArr.forEach(function(chess) {
			if(chess.isSelect) {
				selectChessArr.push(chess.chessType);
			}
		});
		return selectChessArr;
	};

	/**
	 * 设置选择的棋子
	 * @param {Array} selectChessArr 棋子类型数组
	 * @param {Boolean} isSelect 是否选择数组中的棋子，默认为true，false为反选
	 */
	ChessGroup.prototype.setSelectChessArr = function(selectChessArr, isSelect = true) {
		this.selectChessGroup(!isSelect);
		let chessShapeArr = this.chessShapeArr;
		let len = chessShapeArr.length;
		selectChessArr.forEach(function(chessType, index) {
			for(let i = 0; i < len; i++) {
				let chess = chessShapeArr[i];
				if(chess.isSelect !== isSelect) {
					if(chess.chessType === chessType) {
						chess.isSelect = isSelect;
						break;
					}
				}
			}
		});
		this.refreshPanelChessShapeSelectStatus();
	};

	/**
	 * 选择棋子组中的 单个棋子
	 * @param {Number} chessType 棋子类型
	 * @param {Boolean} isSelect 是否选择
	 */
	ChessGroup.prototype.selectChess = function(panelChess, isSelect) {
		let chessGroup = this;

		this.scene.clickChessGroup(this, function() {
			selectSuccess();
		});

		function selectSuccess() {
			let panelChessIndex = chessGroup.panelChessShapeArr.indexOf(panelChess);
			let chess = chessGroup.chessShapeArr[panelChessIndex + 1];

			chess.isSelect = isSelect;
			let mainChess = chessGroup.getMainChess();
			if(isSelect) {
				//主要棋子必须选择
				if(mainChess) {
					mainChess.isSelect = true;
				}
			} else {
				//主要棋子取消选择，则全部取消选择
				if(mainChess === chess) {
					chessGroup.selectChessGroup(false);
				}
			}
			chessGroup.refreshPanelChessShapeSelectStatus();
		}

	};

	/**
	 * 在棋盘上，该棋子组获取焦点
	 */
	ChessGroup.prototype.acquireFocus = function(callback) {
		this.scene.acquireChessGroupFocus(this, callback);
	};
	
	/**
	 * 隐藏棋子选择面板
	 */
	ChessGroup.prototype.hideSelecChessPanel = function() {
		this.selectPanel.isVisible = false;
	};

	/**
	 * 移动棋子 （js实现）
	 * @param {Number} targetLoc 目标位置，范围 0-59
	 * @param {Array} path 棋子的运行路径坐标数组
	 * @param {Array} selectChessArr 选择得棋子组中的棋子类型数组
	 * @param {Function} callback 棋子组移动完成后的回调
	 */
	ChessGroup.prototype.moveChessUseJs = function(targetLoc, path, selectChessArr, callback) {
		let chessGroup = this;
		let startTime = new Date(),
			diffframetime = 0; // 上一帧动画的时间，   两帧时间差
		let pathPixelLength = 0; //路径总长度
		let len = path.length;
		let startXPixel = 0,
			startYPixel = 0,
			endXPixel = 0,
			endYPixel = 0,
			twoLocPixel = 0;
		//计算路径总长度 单位px
		for(let i = 0; i < len; i++) {
			if((i + 1) < len) {
				startXPixel = CBP.getPixelByLocX(path[i] % 5);
				startYPixel = CBP.getPixelByLocY(Math.floor(path[i] / 5));
				endXPixel = CBP.getPixelByLocX(path[i + 1] % 5);
				endYPixel = CBP.getPixelByLocY(Math.floor(path[i + 1] / 5));
				twoLocPixel = Math.sqrt((endXPixel - startXPixel) * (endXPixel - startXPixel) + (endYPixel - startYPixel) * (endYPixel - startYPixel));
				pathPixelLength += twoLocPixel;
			}
		}
		//运动方程 s = A * (1 - Math.cos(ω * t))
		//速度为正弦函数，运动的路程为余弦函数
		let T = 400 + len * 20; //运行总时间
		let A = pathPixelLength / 2; //运动方程振幅
		let ω = Math.PI / T; //运动方程的频率参数
		
		this.acquireFocus(function(){
			chessGroup.setSelectChessArr(selectChessArr);
			//执行移动
			executeMove();
		});

		function executeMove(event) {
			let now = new Date();
			let t = now.getTime() - startTime.getTime();
			let s = A * (1 - Math.cos(ω * t));
			//var s = 0.5*a*t*t;
			let sum = 0;
			//得到棋子移动的 当前路径
			for(var i = 0; i < len; i++) {
				if((i + 1) < len) {
					startXPixel = CBP.getPixelByLocX(path[i] % 5);
					startYPixel = CBP.getPixelByLocY(Math.floor(path[i] / 5));
					endXPixel = CBP.getPixelByLocX(path[i + 1] % 5);
					endYPixel = CBP.getPixelByLocY(Math.floor(path[i + 1] / 5));
					twoLocPixel = Math.sqrt((endXPixel - startXPixel) * (endXPixel - startXPixel) + (endYPixel - startYPixel) * (endYPixel - startYPixel));
					sum += twoLocPixel;
					//得到当前路径段
					if(sum > s) {
						sum -= twoLocPixel;
						//得到本段路径 投影到x轴的长度 
						let dx = (s - sum) * (endXPixel - startXPixel) / twoLocPixel;
						//得到本段路径 投影到y轴的长度 
						let dy = (s - sum) * (endYPixel - startYPixel) / twoLocPixel;
						if(Math.abs(dx) < 0.1) {
							dx = 0;
						}
						if(Math.abs(dy) < 0.1) {
							dy = 0;
						}
						//改变 被选择的棋子位置
						chessGroup.chessShapeArr.forEach(function(chess, i) {
							if(chess.isSelect) {
								let x = startXPixel + dx - chessGroup.x - 4 * i - chess.width / 2;
								let y = startYPixel + dy - chessGroup.y - 4 * i - chess.height / 2;
								let transform = "translate3d(" + x + "px," + y + "px,0)";
								chess.el.style.transform = transform;
							}
						});
						break;
					}
				}
			}
			//执行完毕时
			if(t >= T) {
				if(callback && typeof callback === 'function') {
					callback();
				}
			} else {
				requestAnimationFrame(executeMove);
			}
		}
	};

	/**
	 * 移动棋子 （css3实现）
	 * @param {Number} targetLoc 目标位置，范围 0-59
	 * @param {Array} path 棋子的运行路径坐标数组
	 * @param {Array} selectChessArr 选择得棋子组中的棋子类型数组
	 * @param {Function} callback 棋子组移动完成后的回调
	 */
	ChessGroup.prototype.moveChessUseCss = function(targetLoc, path, selectChessArr, callback) {
		let chessGroup = this;
		let startTime = new Date(),
			diffframetime = 0; // 上一帧动画的时间，   两帧时间差
		let pathPixelLength = 0; //路径总长度
		let len = path.length;
		let startXPixel = 0,
			startYPixel = 0,
			endXPixel = 0,
			endYPixel = 0,
			twoLocPixel = 0;
		//计算路径总长度 单位px
		for(let i = 0; i < len; i++) {
			if((i + 1) < len) {
				startXPixel = CBP.getPixelByLocX(path[i] % 5);
				startYPixel = CBP.getPixelByLocY(Math.floor(path[i] / 5));
				endXPixel = CBP.getPixelByLocX(path[i + 1] % 5);
				endYPixel = CBP.getPixelByLocY(Math.floor(path[i + 1] / 5));
				twoLocPixel = Math.sqrt((endXPixel - startXPixel) * (endXPixel - startXPixel) + (endYPixel - startYPixel) * (endYPixel - startYPixel));
				pathPixelLength += twoLocPixel;
			}
		}

		let moveRule = []; //移动的css动画规则
		let sum = 0;

		//运动方程 s = A * (1 - Math.cos(ω * t))
		let T = 300 + len * 20; //运行总时间
		let A = pathPixelLength / 2; //运动方程振幅
		let ω = Math.PI / T; //运动方程的频率参数

		//计算动画关键帧规则
		for(let i = 0; i < len; i++) {
			if((i + 1) < len) {
				startXPixel = CBP.getPixelByLocX(path[i] % 5);
				startYPixel = CBP.getPixelByLocY(Math.floor(path[i] / 5));
				endXPixel = CBP.getPixelByLocX(path[i + 1] % 5);
				endYPixel = CBP.getPixelByLocY(Math.floor(path[i + 1] / 5));
				twoLocPixel = Math.sqrt((endXPixel - startXPixel) * (endXPixel - startXPixel) + (endYPixel - startYPixel) * (endYPixel - startYPixel));

				if(i === 0) {
					//开始
					let tran = "transform: translate3D(" + (startXPixel - chessGroup.x - CBP.chessW / 2) + "px, " + (startYPixel - chessGroup.y - CBP.chessH / 2) + "px,0);";
					let rule = "0% {" + tran + "-webkit-" + tran + "}";
					moveRule.push(rule);
				}

				//细化每一段的css动画
				for(let j = 1; j <= 5; j++) {
					//得到本段路径 投影到x轴的长度 
					let dx = j / 5 * (endXPixel - startXPixel);
					//得到本段路径 投影到y轴的长度 
					let dy = j / 5 * (endYPixel - startYPixel);
					if(Math.abs(dx) < 0.1) {
						dx = 0;
					}
					if(Math.abs(dy) < 0.1) {
						dy = 0;
					}
					let rate = Math.ceil(Math.acos(1 - (sum + Math.sqrt(dx * dx + dy * dy)) / A) / Math.PI * 100); //计算百分比
					let tran = "transform: translate3D(" + (startXPixel + dx - chessGroup.x - CBP.chessW / 2) + "px, " + (startYPixel + dy - chessGroup.y - CBP.chessH / 2) + "px,0);";
					//动画关键帧规则
					let rule = rate + "% {" + tran + "-webkit-" + tran + "}";
					moveRule.push(rule);
				}
				sum += twoLocPixel;
			}
		}

		let keyFrame = "";
		//拼接得到关键帧
		moveRule.forEach(function(rule) {
			keyFrame += rule;
		});

		try {
			//得到 动画的样式表
			let sheet = document.getElementById("chessMoveStyle").sheet;
			let prefixAnimation = BC.prefixCss3Animation;
			sheet.deleteRule(0); //先删除原先的动画样式
			sheet.deleteRule(0);
			//添加新的运动规则
			BC.addCSSRule(sheet, "@" + prefixAnimation + "keyframes chess-move", keyFrame, 0);
			let chessMoveCssClass = "-webkit-animation: chess-move linear " + T + "ms;" +
				"animation: chess-move linear " + T + "ms;";
			BC.addCSSRule(sheet, ".move", chessMoveCssClass, 1);
		} catch(e) {

		}

		let delayTime = 80; //延时ms，等待css加载完毕
		
		this.acquireFocus(function(){
			chessGroup.setSelectChessArr(selectChessArr);
			//执行移动
			executeMove();
		});
		
		function executeMove(){
			//改变 被选择的棋子位置
			chessGroup.chessShapeArr.forEach(function(chess, i) {
				if(chess.isSelect) {
					chess.moveClass = "move";
				}
			});
			
			//监听动画结束事件
			let firstChess = chessGroup.chessShapeArr[0].el;
			firstChess.addEventListener(BC.animationEndEvent, moveEnd, false);

			function moveEnd(){
				firstChess.removeEventListener(BC.animationEndEvent,moveEnd);
				//运动完成后回调
				if(callback && typeof callback === 'function') {
					callback();
				}
			}
		}
	};

	/**
	 * 翻开棋子
	 * @param {Number} newChessType 翻开棋子后的棋子类型
	 * @param {Function} callback 翻开棋子后的回调
	 */
	ChessGroup.prototype.overChess = function(newChessType, callback) {
		this.selectChessGroup(true);
		this.acquireFocus();
		var chessW = CBP.chessW;
		var chessGroup = this;
		var startTime = new Date();
		var chess = this.chessShapeArr[0];
		chess.isSelect = false;
		var T = 1000;
		var nowScale = 1;
		if(callback && typeof callback === 'function') {
			callback();
		}
	};

	/**
	 * 点击棋子组
	 * @param {Event} evt
	 */
	ChessGroup.prototype.click = function(evt) {
		evt.preventDefault();
		evt.stopPropagation();

		let target = evt.target;
		if(target.className.indexOf("chess-select-panel") > -1) {
			return false;
		}

		let chessGroup = this;

		//gameSound.selectChessSound();
		this.scene.clickChessGroup(this, selectSuccess);

		/**
		 * 选择成功后进行的回调
		 */
		function selectSuccess() {
			//已经选择了,取消选择
			let mainChess = chessGroup.getMainChess();
			if(mainChess && mainChess.isSelect) {
				chessGroup.selectChessGroup(false);
			} else {
				chessGroup.selectChessGroup(true);
			}

			chessGroup.scene.hideAllChessGroupSelectChessPanel();
			chessGroup.scene.cancelAllSelectChessGroup(chessGroup);
		}

	};

	/**
	 * 设置棋子组的鼠标按下事件，适用于pc端
	 * 用于显示或隐藏棋子选择面板
	 * @param {Event} evt
	 */
	ChessGroup.prototype.mouseDown = function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		let target = evt.currentTarget;

		if(this.chessArr.length < 2) {
			return;
		}

		let chessGroup = this;
		let touchMoveStartX = evt.pageX,
			touchMoveStartY = evt.pageY;

		target.addEventListener("mousemove", touchMove, false);
		target.addEventListener("mouseup", touchEnd, false);

		setTimeout(function() {
			removeEvent();
		}, 600)

		function removeEvent() {
			target.removeEventListener("mousemove", touchMove, false);
			target.removeEventListener("mouseup", touchEnd, false);
		}

		function touchMove(e) {
			e.preventDefault();
			e.stopPropagation();

			if(Math.abs(e.pageX - touchMoveStartX) > CBP.stationW / 3) {
				chessGroup.showOrHideSelectPanel();
				removeEvent();
			}
		}

		function touchEnd(e) {
			e.preventDefault();
			e.stopPropagation();
			removeEvent();
			return false;
		}
	}

	/**
	 * 设置棋子组的触摸开始事件，适用于移动端
	 * 用于显示或隐藏棋子选择面板
	 * @param {Event} evt
	 */
	ChessGroup.prototype.touchBegin = function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		let target = evt.currentTarget;

		let chessGroup = this;

		var touch = evt.touches[0]; //获取第一个触点
		var touchMoveStartX = Number(touch.pageX); //页面触点X坐标
		var touchMoveStartY = Number(touch.pageY); //页面触点Y坐标

		if(this.chessArr.length > 1) {
			target.addEventListener("touchmove", touchMove, false);
		}

		target.addEventListener("touchend", touchEnd, false);
		setTimeout(function() {
			removeEvent();
		}, 600)

		function removeEvent() {
			target.removeEventListener("touchmove", touchMove, false);
			target.removeEventListener("touchend", touchEnd, false);
		}

		function touchMove(e) {
			e.preventDefault();
			e.stopPropagation();
			let touch = e.touches[0]; //获取第一个触点
			let x = Number(touch.pageX); //页面触点X坐标
			let y = Number(touch.pageY); //页面触点Y坐标

			if(Math.abs(x - touchMoveStartX) > CBP.stationW / 3) {
				chessGroup.showOrHideSelectPanel();
				removeEvent();
			}
		}

		function touchEnd(e) {
			e.preventDefault();
			e.stopPropagation();
			removeEvent();
			let touch = e.changedTouches[0]; //获取第一个触点
			let x = Number(touch.pageX); //页面触点X坐标
			let y = Number(touch.pageY); //页面触点Y坐标

			//如果是点击事件，则触发一个点击事件
			//（解决在父元素上注册了一个touchstart事件，子元素上的click事件不能触发的问题）
			if(Math.abs(x - touchMoveStartX) < 10) {
				let clickEvent = document.createEvent('Event');
				clickEvent.initEvent("click", true, true);
				e.target.dispatchEvent(clickEvent);
			}
			return false;
		}
	}

	return ChessGroup;
})();

export default ChessGroup