<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">求和</h4>

		<div class="w3-container" v-if="suePeace.isRequest">
			<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
				您确定要求和吗？
			</div>

			<div class="w3-row" style="text-align: center;padding: 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="确认" @click.prevent="okRequest" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="取消" @click.prevent="cancel" />
				</div>
			</div>
		</div>
		<div class="w3-container" v-if="suePeace.isConfirm">
			<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
				对方请求求和
			</div>

			<div class="w3-row" style="text-align: center;padding: 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="同意" @click.prevent="okConfirm" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="拒绝" @click.prevent="refused" />
				</div>
			</div>
		</div>

	</MyDialog>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'

	export default {
		data: function() {
			return {
				suePeace: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.suePeace = this.scene.dialogManage.suePeace;
		},
		computed: {

		},
		methods: {
			closeModel() {
				this.scene.dialogManage.suePeace.show = false;
			},
			okRequest() {
				let that = this;
				this.scene.mediator.room.hostPlayer.socket.emit("suePeace", {
						iss: true,
						isr: true
					},
					function(data) {
						that.closeModel();
					}
				);

			},
			okConfirm() {
				let that = this;
				let hostPlayer = this.scene.mediator.room.hostPlayer;
				let oppPlayer = this.scene.mediator.room.getOppositePlayer(hostPlayer);
				oppPlayer.socket.emit("suePeace", {
						iss: true,
						isr: false
					},
					function(data) {
						that.closeModel();
					}
				);
			},
			refused() {
				let that = this;
				let hostPlayer = this.scene.mediator.room.hostPlayer;
				let oppPlayer = this.scene.mediator.room.getOppositePlayer(hostPlayer);
				oppPlayer.socket.emit("suePeace", {
						iss: false,
						isr: false
					},
					function(data) {
						that.closeModel();
					}
				);
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