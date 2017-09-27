<template>

	<div :style="styleobj" :class="['chess',selectClass,moveCLass]">
		<span class="chess-label">{{chess.chessAttr.description}}</span>
	</div>

</template>

<script>
	import CON from '@/js/game/ConEnum'
	import CBP from '@/js/game/ChessboardPara'

	export default {
		name: 'chess',
		data: function() {
			return {}
		},
		props: {
			"chess": Object,
			"isInitClickEvent": {
				type: Boolean,
				default: false
			}
		},
		computed: {
			styleobj: function() {
				let chess = this.chess;
				let color = "black";
				if(chess.camp === CON.CAMP.blue) {
					color = "blue";
				}
				if(chess.camp === CON.CAMP.red) {
					color = "red";
				}
				return {
					transform: "translate3d(" + chess.x + "px," + chess.y + "px,0)",
					height: chess.height + "px",
					width: chess.width + "px",
					color: color,
					fontSize: Math.round(CBP.chessW / 3) - 2 + "px"
				};
			},
			selectClass: function() {
				if(this.chess.isSelect) {
					return 'chess-select'
				} else {
					return 'chess-noselect'
				}
			},
			moveCLass: function() {
				return this.chess.moveClass;
			}
		},
		mounted: function() {
			let chess = this;
			if(this.isInitClickEvent) {
				this.$el.addEventListener("click", function(e) {
					chess.clickChess(e);
				}, false);
			}
			this.chess.el = this.$el;
		},
		methods: {
			clickChess: function(e) {
				if(this.chess.touchEnabled) {
					e.preventDefault();
					e.stopPropagation();
					this.chess.clickChess();
				}
			}
		},
		watch: {
			chess:function(newChess){
				newChess.el = this.$el;
			}
		},
		components: {

		}
	}
</script>

<style id="style_chess">
	.chess {
		cursor: pointer;
		background-color: #FEF7CC;
		box-sizing: border-box;
		position: absolute;
		display: flex;
		justify-content: center;
		align-items:center;
	}
	
	.chess-select {
		border: 2px solid red;
	}
	
	.chess-noselect {
		border: 2px solid #FDC44C;
	}
	
	.chess-label {
		white-space: nowrap;
		font-weight: bold;
		user-select: none;
	}
</style>