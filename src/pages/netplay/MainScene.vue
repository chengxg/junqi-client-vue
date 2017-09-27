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
	import MainScene from '@/js/game/netplay/scene/MainScene'
	import Mediator from '@/js/game/netplay/Mediator'

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
			if(!this.$root.state.net) {
				this.$root.state.net = {};
			}
			if(!this.$root.state.net.scene) {
				let mediator = new Mediator();
				let scene = new MainScene(mediator);
				scene.initScene();
				mediator.scene = scene;
				mediator.netServerInit();
				this.$root.state.net.scene = scene;
			}
			this.scene = this.$root.state.net.scene;
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