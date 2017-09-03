<template>
	<div class="page-layer pointer-events-through">
		<chess-group v-for="(chessGroup,index) in chessGroupArr" :key="index" :chess-group="chessGroup"></chess-group>
	</div>
</template>

<script>
	import ChessGroupVue from './../common/ChessGroup'

	export default {
		name: 'chessboard',
		data: function() {
			return {
				scene: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.scene.initChessboardView();
		},
		methods: {

		},
		watch: {

		},
		computed: {
			chessGroupArr: function() {
				return this.scene.chessGroupArr;
			}
		},
		components: {
			ChessGroup: ChessGroupVue
		}
	}
</script>

<style>
	.chessboard-wrap {
		border: 1px solid red;
	}
</style>