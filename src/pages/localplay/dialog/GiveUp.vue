<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">认输</h4>

		<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
			您确定要认输吗？
		</div>

		<div class="w3-row" style="text-align: center;padding: 5px;">
			<div class="w3-col s6" style="padding-right: 5px;">
				<input type="button" class="btn btn-primary" style="width: 100%;" value="确认" @click.prevent="ok" />
			</div>

			<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
				<input type="button" class="btn btn-default" style="width: 100%;" value="取消" @click.prevent="cancel" />
			</div>
		</div>
	</MyDialog>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'
	let scene = null;

	export default {
		data: function() {
			return {

			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
		},
		computed: {

		},
		methods: {
			closeModel() {
				this.scene.dialogManage.giveUp.show = false;
			},
			ok() {
				this.scene.mediator.room.hostPlayer.socket.emit(
					"giveUp"
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