<template>

	<div :style="styleobj" class="chess-group-wrap" @mousedown="chessGroup.mouseDown($event)" @touchstart="chessGroup.touchBegin($event)">
		<div class="chess-group" @click="chessGroup.click($event)">
			<chess v-for="(chess,index) in chessShapeArr" v-if="chess.chessType" :key="index" :chess="chess"></chess>
		</div>
		<div v-if="chessGroup.selectPanel.isVisible" class="chess-select-panel" :style="stylePanel" @click="clickPanel($event)">
			<chess v-for="(chess,index) in chessGroup.panelChessShapeArr" v-if="chess.chessType" :key="index" :chess="chess" :isInitClickEvent="true"></chess>
		</div>
	</div>

</template>

<script type="text/javascript">
	import Chess from './Chess'

	export default {
		name: 'chessgroup',
		data: function() {
			return {}
		},
		props: ["chessGroup"],
		created: function() {

		},
		computed: {
			styleobj: function() {
				let chessGroup = this.chessGroup;
				return {
					transform: "translate3D(" + chessGroup.x + "px," + chessGroup.y + "px,0)",
					width: chessGroup.width + "px",
					height: chessGroup.height + "px"
				}
			},
			stylePanel: function() {
				let selectPanel = this.chessGroup.selectPanel;
				return {
					transform: "translate(" + selectPanel.x + "px," + selectPanel.y + "px)",
					width: selectPanel.panelW + "px",
					height: selectPanel.panelH + "px"
				}
			},
			chessShapeArr: function() {
				let reChessShapeArr = [];
				let chessShapeArr = this.chessGroup.chessShapeArr;
				for(let i = chessShapeArr.length - 1; i >= 0; i--) {
					reChessShapeArr.push(chessShapeArr[i]);
				}

				return reChessShapeArr;
			}
		},
		methods: {
			clickPanel(evt) {
				evt.preventDefault();
				evt.stopPropagation();
				return false;
			}
		},
		components: {
			Chess
		}
	}
</script>

<style>
	.chess-group-wrap {
		position: absolute;
		padding: 0;
	}
	
	.chess-group {
		position: absolute;
		height: 100%;
		width: 100%;
		padding: 0;
	}
	
	.chess-select-panel {
		position: absolute;
		padding: 0;
		box-sizing: border-box;
		border: 1px solid black;
		background-color: #eeeeee;
	}
</style>