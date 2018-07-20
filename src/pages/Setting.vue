<template>
	<div class="page">
		<div class="page-layer">
			<div class="page-back-wrap">
				<router-link to="/">
					<mt-button type="primary" size="small">
						<i class="fa fa-chevron-left" aria-hidden="true"></i>
					</mt-button>
				</router-link>
			</div>
			<div style="position: absolute;left: 50%;transform: translate(-50%);width: 100%;">
				<h5>
					<img src="../assets/image/logo.png" class="app-icon" style="width: 30px;" />
					<span class="title">设置</span>
				</h5>
			</div>
		</div>
		<div class="page-layer">
			<div style="position: absolute;width:95%;left: 50%;top:10%;transform: translate(-50%, -10%);text-align: left;">
				<form class="" style="text-align: left;">
					<div class="w3-row">
						<div class="w3-col w3-col-middle" style="width: 120px;">
							背景音量:
							<span>{{form.backSoundSize}}</span>
						</div>
						<div class="w3-rest w3-col-middle">
							<mt-range v-model="form.backSoundSize" style="margin-top: 6px;"></mt-range>
						</div>
					</div>
					<div class="w3-row ">
						<div class="w3-col w3-col-middle" style="width: 120px;">
							游戏音量:
							<span>{{form.gameSoundSize}}</span>
						</div>
						<div class="w3-rest w3-col-middle">
							<mt-range v-model="form.gameSoundSize" style="margin-top: 6px;"></mt-range>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '@/store'
	import CON from '@/js/ConEnum'
	import gameSound from '@/js/base/GameSound'
	import { Toast } from 'mint-ui';

	export default {
		name: "Setting",
		data: function() {
			return {
				form: {
					backSoundSize: 0,
					gameSoundSize: 0
				},
			}
		},
		props: [],
		created: function() {
			let setting = store.setting;
			this.form = setting;
		},
		watch: {
			"form.backSoundSize": function() {
				this.save();
			},
			"form.gameSoundSize": function() {
				this.save();
			},
		},
		computed: {

		},
		methods: {
			save() {
				let formJson = JSON.stringify(this.form);
				localStorage.setItem("gameSettingForm", formJson);
				gameSound.playBackSound();
			},
		},
		components: {

		}
	}
</script>

<style scoped>
	.title{
		font-weight: bold;
		color: orange;
	}
	.my-a{
		font-size: 14px;
	}
	.w3-col-middle{
		height: 40px;
		line-height: 40px;
	}
</style>