<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">游戏结束</h4>

		<div class="w3-container">
			<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
				<div v-if="victory === VICTORY_STATUS.draw">
					<span>很遗憾，您战平了！</span>
				</div>
				<div v-if="victory === VICTORY_STATUS.win">
					<span>恭喜您，胜利了！</span>
				</div>
				<div v-if="victory === VICTORY_STATUS.lose">
					<span>您失败了，不要气馁奥。</span>
				</div>
			</div>

			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="再来一局" @click.prevent="continueGame" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="取消" @click.prevent="cancel" />
				</div>
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
			scene = store.net.scene;

			let myName = scene.mediator.player.name;
			let player = scene.mediator.room.getPlayerByName(myName);
			this.me = player;
			if(player) {
				this.victory = player.victory;
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
				scene.dialogManage.roomInfo.show = true;
			},
			cancel() {
				let that = this;

				scene.mediator.action.emit({
					event: "leaveRoom",
					data: {

					},
					success: function(data) {
						that.closeModel();
						scene.dialogManage.searchRoom.show = true;
					}
				});
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>

</style>