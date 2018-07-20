<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">求和</h4>

		<div class="w3-container" v-if="suePeace.isRequest">
			<div class="w3-row" style="text-align: center;padding: 5px;height: 150px;">
				您确定要求和吗？
			</div>

			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
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

			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="同意" @click.prevent="okConfirm" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="拒绝" @click.prevent="refused" />
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
				suePeace: null
			}
		},
		props: [],
		created: function() {
			scene = store.net.scene;
			this.suePeace = scene.dialogManage.suePeace;
		},
		computed: {

		},
		methods: {
			closeModel() {
				scene.dialogManage.suePeace.show = false;
			},
			okRequest() {
				let that = this;
				scene.mediator.action.emit({
					event: "suePeace",
					data: {
						iss: true,
						isr: true
					},
					success: function(data) {
						that.closeModel();
					}
				});
			},
			okConfirm() {
				let that = this;
				scene.mediator.action.emit({
					event: "suePeace",
					data: {
						iss: true,
						isr: false
					},
					success: function(data) {
						that.closeModel();
					}
				});
			},
			refused() {
				let that = this;
				scene.mediator.action.emit({
					event: "suePeace",
					data: {
						iss: false,
						isr: false
					},
					success: function(data) {
						that.closeModel();
					}
				});
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