<template>
	<MyDialog :isClickMaskClose="true" :show="dialog.show" :beforeClose="closeModel">
		<h4 slot="header" style="">创建房间</h4>

		<form v-show="createRoomForm.show" class="w3-container" style="text-align: left;">
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">游戏玩法：</label>
					<select class="w3-select w3-border w3-sand" style="width: 100px;" v-model="createRoomForm.rule">
						<option v-for="(rule,index) in ruleSelect" :key="index" :value="rule.key">{{rule.value}}</option>
					</select>
				</div>
			</div>
			<div class="w3-row login-tip">
				<div v-html="createRoomForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: center;">
					<input type="button" class="btn btn-primary" value="创 建" @click="createRoomAction" />
				</div>
			</div>
		</form>
	</MyDialog>
</template>

<script>
	import MyDialog from './dialog'
	import rules from '@/js/game/rule/rules'

	export default {
		data: function() {
			return {
				playerInfo: null,
				errMsgArr: [],
				createRoomForm: {
					show: true,
					rule: 'rule1',
					roomPwd: "",
					tipMsg: ""
				},
				ruleSelect: []
			}
		},
		created: function() {
			this.scene = this.$parent.$parent.scene;
			for(let filed in rules) {
				let rule = rules[filed];
				this.ruleSelect.push({
					"key": rule.name,
					"value": rule.description
				});
			}
		},
		props: {
			dialog: {
				type: Object,
				required: true
			}
		},
		computed: {

		},
		watch: {

		},
		methods: {
			closeModel() {
				this.dialog.show = false;
			},
			createRoomAction() {
				let that = this;
				this.scene.mediator.action.emit({
					event: "createRoom",
					data: {
						isFriendRoom: false,
						rule: this.createRoomForm.rule
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.scene.dialogManage.searchRoom.show = false;
							that.scene.dialogManage.roomInfo.show = true;
						} else {
							that.createRoomForm.tipMsg = data["errMsg"];
						}
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