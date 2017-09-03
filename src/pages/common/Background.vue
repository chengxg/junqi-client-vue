<template>
	<div class="page-layer">
		<svg xmlns="http://www.w3.org/2000/svg" style="width: 100%;height: 100%;">
			<g>
				<line v-for="item in highwayArr" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" stroke="gray" stroke-width="1"></line>
			</g>
			<g>
				<g v-for="sections in railwayArr">
					<line v-for="item in sections" :x1="item.x1" :y1="item.y1" :x2="item.x2" :y2="item.y2" :stroke="item.color" stroke-width="4"></line>
				</g>
			</g>
			<g>
				<g v-for="item in stationArr" :transform="item.transform" :width="item.width" :height="item.height">
					<rect v-if="item.text === '兵 站'" x="0" y="0" :width="item.width" :height="item.height" class="station">

					</rect>
					<rect v-if="item.text === '大本营'" x="0" y="0" :width="item.width" :height="item.height" class="station-dabenying">

					</rect>
					<ellipse v-if="item.text === '行 营'" :cx="item.cx" :cy="item.cy" :rx="item.cx*1.2" :ry="item.cy*1.2" class="station-xingying">

					</ellipse>
					<text :x="item.cx" :y="item.cy" :width="item.width" :height="item.height" class="station-text">
						{{item.text}}
					</text>
				</g>
			</g>
		</svg>
	</div>
</template>

<style>
	svg .station-text {
		stroke: gray;
		stroke-width: 0.1;
		font-size: 12px;
		font-weight: normal;
		text-anchor: middle;
		/* 文本水平居中 */
		dominant-baseline: central;
		/* 文本垂直居中 */
	}
	
	svg .station {
		stroke: gray;
		stroke-width: 1;
		fill: white;
	}
	
	svg .station-dabenying {
		stroke: gray;
		stroke-width: 1;
		fill: white;
	}
	
	svg .station-xingying {
		stroke: gray;
		stroke-width: 1;
		fill: white;
	}
</style>

<script>
	import CBP from '@/js/game/ChessboardPara'
	import CON from '@/js/game/ConEnum'

	export default {
		data: function() {
			return {
				highwayArr: [],
				railwayArr: [],
				stationArr: []
			}
		},
		props: [

		],
		created: function() {
			this.initArr();
		},
		computed: {

		},
		methods: {
			/**
			 * 初始化棋盘的数据
			 */
			initArr() {
				//公路线起止位置
				var highwayS = [0, 1, 2, 3, 4, 55, 56, 57, 58, 59, 0, 10, 15, 20, 35, 40, 45, 55, 5, 9, 7, 7, 15, 19, 30, 34, 32, 32, 40, 44];
				var highwayE = [5, 26, 27, 28, 9, 50, 31, 32, 33, 54, 4, 14, 19, 24, 39, 44, 49, 59, 29, 25, 15, 19, 27, 27, 54, 50, 40, 44, 52, 52];
				//铁路线起止位置
				var railwayS = [5, 50, 54, 9, 25, 30, 27];
				var railwayE = [50, 54, 9, 5, 29, 34, 32];

				var len = highwayS.length;
				for(let i = 0; i < len; i++) {
					let obj = this.getHighway(highwayS[i], highwayE[i]);
					this.highwayArr.push(obj);
				}
				len = railwayS.length;
				for(let i = 0; i < len; i++) {
					let obj = this.getRailway(railwayS[i], railwayE[i]);
					this.railwayArr.push(obj);
				}

				for(let i = 0; i < 60; i++) {
					//判断是否是行营
					if(CON.POSITION_GRAPH[i].length < 8) {
						let obj = this.getStationByPosition(i);
						this.stationArr.push(obj);
					} else {
						let obj = this.getXingyingByPosition(i);
						this.stationArr.push(obj);
					}
				}
			},
			/**
			 * 通过起始位置得到公路的数据
			 * @param {Number} startLoc
			 * @param {Number} endLoc
			 * @return {Object}
			 */
			getHighway(startLoc, endLoc) {
				var startXPixel = CBP.getPixelByLocX(startLoc % 5);
				var startYPixel = CBP.getPixelByLocY(Math.floor(startLoc / 5));
				var endXPixel = CBP.getPixelByLocX(endLoc % 5);
				var endYPixel = CBP.getPixelByLocY(Math.floor(endLoc / 5));

				return {
					x1: startXPixel,
					y1: startYPixel,
					x2: endXPixel,
					y2: endYPixel
				}
			},
			/**
			 * 通过起始位置得到铁路路的数据
			 * @param {Number} startLoc
			 * @param {Number} endLoc
			 * @return {Array}
			 */
			getRailway(startLoc, endLoc) {
				var startXPixel = CBP.getPixelByLocX(startLoc % 5);
				var startYPixel = CBP.getPixelByLocY(Math.floor(startLoc / 5));
				var endXPixel = CBP.getPixelByLocX(endLoc % 5);
				var endYPixel = CBP.getPixelByLocY(Math.floor(endLoc / 5));

				var railwayColorSpace = CBP.railwayColorSpace;
				//线路的长度
				var lengthPixel = Math.sqrt((endXPixel - startXPixel) * (endXPixel - startXPixel) + (endYPixel - startYPixel) * (endYPixel - startYPixel));
				//得到railwayColorSpace 投影到x轴的长度 
				var dx = railwayColorSpace * (endXPixel - startXPixel) / lengthPixel;
				//得到railwayColorSpace 投影到y轴的长度 
				var dy = railwayColorSpace * (endYPixel - startYPixel) / lengthPixel;
				//得到要画的段数
				var num = Math.floor(lengthPixel / railwayColorSpace);
				var sx = 0, //每段开始的x像素坐标
					sy = 0,
					ex = 0, //每段结束的x像素坐标
					ey = 0;

				var isDrawRed = true;
				let railWaySectionArr = [];
				for(let i = 0; i < num; i++) {
					sx = startXPixel + dx * i;
					sy = startYPixel + dy * i;
					ex = sx + dx;
					ey = sy + dy;
					if(i == num - 1) {
						ex = endXPixel;
						ey = endYPixel;
					}

					let color = "#EAC611";
					//交换颜色
					if(isDrawRed) {
						color = "#111";
					}
					isDrawRed = !isDrawRed;

					railWaySectionArr.push({
						x1: sx,
						y1: sy,
						x2: ex,
						y2: ey,
						color: color
					})
				}
				return railWaySectionArr;
			},
			/**
			 * 通过兵站位置得到兵站的数据
			 * @param {Number} loc
			 * @return {Object}
			 */
			getStationByPosition(loc) {
				var bigCampPosition = [1, 3, 56, 58];

				var stationW = CBP.stationW;
				var stationH = CBP.stationH;
				var locX = loc % 5;
				var locY = Math.floor(loc / 5);
				var x = CBP.getPixelByLocX(locX);
				var y = CBP.getPixelByLocY(locY);
				var text = "";
				if(bigCampPosition.indexOf(loc) > -1) {
					text = "大本营";
				} else {
					text = "兵 站";
				}
				return {
					cx: stationW / 2,
					cy: stationH / 2,
					width: stationW,
					height: stationH,
					text: text,
					transform: "translate(" + Math.floor(x - stationW / 2) + "," + Math.floor(y - stationH / 2) + ")"
				}
			},
			/**
			 * 通过行营位置的到行营数据
			 * @param {Number} loc
			 * @return {Object}
			 */
			getXingyingByPosition(loc) {
				var stationW = CBP.stationW;
				var stationH = CBP.stationH;
				var locX = loc % 5;
				var locY = Math.floor(loc / 5);
				var x = CBP.getPixelByLocX(locX);
				var y = CBP.getPixelByLocY(locY);
				var width = stationW * 1.2;
				var height = stationH * 1.2;

				return {
					cx: stationW / 2,
					cy: stationH / 2,
					width: stationW,
					height: stationH,
					text: "行 营",
					transform: "translate(" + Math.floor(x - stationW / 2) + "," + Math.floor(y - stationH / 2) + ")"
				}
			}
		},
		components: {

		},
		watch: {

		}
	}
</script>