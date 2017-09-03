<template>
	<div class="page">
		<Background></Background>
		<OptionLayer></OptionLayer>
		<Chessboard></Chessboard>
		<DialogLayer></DialogLayer>
		<MessageLayer></MessageLayer>
	</div>
</template>

<script>
	import MainScene from '@/js/game/localplay/scene/MainScene'
	import Mediator from '@/js/game/localplay/Mediator'

	import Background from './../common/Background'
	import OptionLayer from './OptionLayer'
	import Chessboard from './Chessboard'
	import DialogLayer from './DialogLayer'
	import MessageLayer from './MessageLayer'

	import CBP from '@/js/game/ChessboardPara'
	import CON from '@/js/game/ConEnum'
	import Store from '@/Store'

	export default {
		name: 'mainscene',
		data: function() {
			return {

			}
		},
		props: [],
		created: function() {
			if(!this.$root.state.local) {
				this.$root.state.local = {};
			}
			if(!this.$root.state.local.scene) {
				let mediator = new Mediator();
				let scene = new MainScene(mediator);
				mediator.scene = scene;
				mediator.initLocalGame();
				this.$root.state.local.scene = scene;
			}
			this.scene = this.$root.state.local.scene;
		},
		methods: {
			open2: function() {

			},
			openMenu: function() {
				this.showDialog.menu = true;
			}
		},

		computed: {
			styleobj: function() {
				return {
					width: CBP.clientWidth + "px",
					height: CBP.clientHeight + "px"
				}
			}
		},
		components: {
			Background,
			OptionLayer,
			Chessboard,
			DialogLayer,
			MessageLayer
		}
	}
</script>

<style>

</style>