<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="beforeClose">
		<h4 slot="header" style="">游戏设置</h4>
		<form class="w3-container" style="text-align: left;">
			<p>
				<label class="w3-label w3-text-brown">
					<b>游戏动画：</b>
				</label>
				<select class="w3-select w3-border" style="width: 100px;" v-model="form.gameAnimation">
					<option v-for="(type,value) in ANIMATION_TYPE" :key="value" :value="value">{{value}}</option>
				</select>
			</p>
			<div class="w3-row" style="text-align: center;padding: 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="确定" @click.prevent="ok" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="取消" @click.prevent="cancel" />
				</div>
			</div>
		</form>
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
				form: {
					gameAnimation: CON.ANIMATION_TYPE.js
				},
				ANIMATION_TYPE: CON.ANIMATION_TYPE
			}
		},
		props: [],
		created: function() {
			scene = store.net.scene;

			let netSceneSettingFormJson = localStorage.getItem("netSceneSettingForm");
			if(netSceneSettingFormJson) {
				let form = null;
				try {
					form = JSON.parse(netSceneSettingFormJson);
				} catch(e) {}
				if(form) {
					for(let filed in form) {
						if(typeof this.form[filed] !== 'undefined') {
							this.form[filed] = form[filed];
						}
					}
				}
			}
		},
		computed: {

		},
		methods: {
			beforeClose() {
				scene.dialogManage.gameSetting.show = false;
			},
			ok() {
				let formJson = JSON.stringify(this.form);
				localStorage.setItem("netSceneSettingForm", formJson);
				scene.sceneSetting.initSceneSetting();
				this.beforeClose();
			},
			cancel() {
				this.beforeClose();
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>

</style>