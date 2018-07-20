<template>
	<div class="page-layer pointer-events-through">
		<chess-group v-for="(chessGroup,index) in chessGroupArr" :key="index" :chess-group="chessGroup"></chess-group>
	</div>
</template>

<script>
	import store from '@/store'
	import ChessGroupVue from './../common/ChessGroup'

	export default {
		name: 'chessboard',
		data: function() {
			return {
				chessGroupArr: []
			}
		},
		props: [],
		created: function() {
			let scene = store.local.scene;
			scene.initChessboardView();
			this.chessGroupArr = scene.chessGroupArr;
		},
		methods: {

		},
		watch: {

		},
		computed: {
			
		},
		components: {
			ChessGroup: ChessGroupVue
		}
	}
</script>

<style>
	.chessboard-wrap {
		border: 1px solid red;
		box-sizing: content-box;
	}
</style>