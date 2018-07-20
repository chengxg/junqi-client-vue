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
	import Mediator from '@/js/localplay/Mediator'

	import Background from './../common/Background'
	import OptionLayer from './OptionLayer'
	import Chessboard from './Chessboard'
	import DialogLayer from './DialogLayer'
	import MessageLayer from './MessageLayer'

	import CBP from '@/js/ChessboardPara'
	import CON from '@/js/ConEnum'
	import store from '@/store'

	export default {
		name: 'mainscene',
		data: function() {
			return {

			}
		},
		props: [],
		beforeCreate: function() {
			if(!store.local) {
				store.local = {};
			}
			if(!store.local.scene) {
				let mediator = new Mediator();
				mediator.initGame();
				store.local.scene = mediator.scene;
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