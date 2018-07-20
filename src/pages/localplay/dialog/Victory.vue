<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">游戏结束</h4>

		<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
			{{victoryMsg}}
		</div>

		<div class="w3-row" style="text-align: center;padding: 5px;">
			<div class="w3-col s6" style="padding-right: 5px;">
				<input type="button" class="btn btn-primary" style="width: 100%;" value="再来一局" @click.prevent="continueGame" />
			</div>

			<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
				<input type="button" class="btn btn-default" style="width: 100%;" value="取消" @click.prevent="cancel" />
			</div>
		</div>
	</MyDialog>
</template>

<script>
	import store from '@/store'
	import CON from '@/js/ConEnum'
	import MyDialog from './dialog'
	
	let scene = null;
	
	export default {
		data: function() {
			return {
				me: null,
				victoryMsg: "",
				victory: null,
				VICTORY_STATUS: CON.VICTORY_STATUS
			}
		},
		props: [],
		created: function() {
			scene = store.local.scene;

			let room = scene.mediator.room;

			if(!room.player1 || !room.player2) {
				this.closeModel();
				return;
			}

			if(room.victory === CON.VICTORY_STATUS.draw) {
				this.victory = room.victory;
				this.victoryMsg = "你们战平了";
			}
			if(room.player1.victory === CON.VICTORY_STATUS.win) {
				this.victoryMsg = room.player1.name + "胜利了";
			}
			if(room.player2.victory === CON.VICTORY_STATUS.win) {
				this.victoryMsg = room.player2.name + "胜利了";
			}
		},
		computed: {

		},
		methods: {
			closeModel() {
				scene.dialogManage.victory.show = false;
			},
			continueGame() {
				this.closeModel();
				scene.dialogManage.roomCreate.show = true;
			},
			cancel() {
				this.closeModel();
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>

</style>