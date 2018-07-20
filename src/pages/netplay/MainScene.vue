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
	import store from '@/store'

	import MainScene from '@/js/netplay/MainScene'
	import Mediator from '@/js/netplay/Mediator'

	import Background from './../common/Background'
	import OptionLayer from './OptionLayer'
	import Chessboard from './Chessboard'
	import DialogLayer from './DialogLayer'
	import MessageLayer from './MessageLayer'

	import CBP from '@/js/ChessboardPara'
	import CON from '@/js/ConEnum'

	export default {
		name: 'NetPlay',
		data: function() {
			return {

			}
		},
		props: [],
		beforeCreate: function() {
			if(!store.net) {
				store.net = {};
			}
			if(!store.net.scene) {
				let mediator = new Mediator();
				mediator.initGame();
				store.net.scene = mediator.scene;
			}
		},
		methods: {

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