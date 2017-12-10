<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="beforeClose">
		<h4 slot="header" style="">创建房间</h4>
		<form class="w3-container" style="text-align: left;">
			<p>
				<label class="w3-label w3-text-brown">
					<b>您的名称：</b>
				</label>
				<input class="w3-input w3-border w3-sand" type="text" v-model="form.player1Name">
			</p>
			<p>
				<label class="w3-label w3-text-brown">
					<b>棋友名称：</b>
				</label>
				<input class="w3-input w3-border w3-sand" type="text" v-model="form.player2Name">
			</p>
			<p>
				<label class="w3-label w3-text-brown">
					<b>游戏玩法：</b>
				</label>
				<select class="w3-select w3-border w3-sand" style="width: 100px;" v-model="form.ruleName">
					<option v-for="(rule,index) in ruleSelect" :key="index" :value="rule.key">{{rule.value}}</option>
				</select>
			</p>

			<div class="w3-row" style="text-align: center;padding: 5px 0 15px 0;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<button class="btn btn-primary" style="width: 100%;" @click.prevent="createRoom">创建</button>
				</div>

				<div class="w3-col s6" style="padding-right: 5px;">
					<button class="btn btn-default" style="width: 100%;" @click.prevent="cancel">取消</button>
				</div>
			</div>
		</form>
	</MyDialog>
</template>

<script>
	import rules from '@/js/game/rule/rules'
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'

	export default {
		data: function() {
			return {
				form: {
					player1Name: '棋圣',
					player2Name: '棋神',
					ruleName: ''
				},
				ruleSelect: []
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.form.ruleName = "rule1";
			let createRoomFormJson = localStorage.getItem("createRoomForm");
			if(createRoomFormJson) {
				let form = null;
				try {
					form = JSON.parse(createRoomFormJson);
				} catch(e) {}
				if(form) {
					if(form["player1Name"]) {
						this.form.player1Name = form["player1Name"];
					}
					if(form["player2Name"]) {
						this.form.player2Name = form["player2Name"];
					}
					if(form["ruleName"]) {
						this.form.ruleName = form["ruleName"];
					}
				}
			}
			for(let filed in rules) {
				let rule = rules[filed];
				this.ruleSelect.push({
					"key": rule.name,
					"value": rule.description
				});
			}
		},
		computed: {

		},
		methods: {
			beforeClose() {
				this.scene.dialogManage.roomCreate.show = false;
				let formJson = JSON.stringify(this.form);
				localStorage.setItem("createRoomForm", formJson);
			},
			createRoom() {
				if(this.scene && this.scene.mediator) {
					this.scene.mediator.localGameStart(this.form);
					this.beforeClose();
				}
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