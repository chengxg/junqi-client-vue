<style>
	.my-table td {
		vertical-align: middle;
	}
	
	.page-disabled {
		opacity: 0.3;
	}
</style>
<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel">
		<h4 slot="header" style="">好友房间</h4>

		<div v-show="isShowIndex">
			<div class="w3-row" style="padding: 5px;">
				<input type="button" class="btn btn-primary" value="创建房间" @click="toCreateForm" />
			</div>
			<div class="w3-row" style="padding: 5px;">
				<input type="button" class="btn btn-primary" value="加入房间" @click="toEnterForm" />
			</div>
		</div>

		<form v-show="createRoomForm.show" class="w3-container" style="text-align: left;">
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">房间密码：</label>
					<input class="form-control" type="text" v-model="createRoomForm.roomPwd" placeholder="可不填">
				</div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">玩法：</label>
					<select class="w3-select w3-border" id="searchModelRule" style="width: 100px;" v-model="createRoomForm.rule">
						<option value="rule1" selected="selected">玩法1</option>
						<option value="rule2" >玩法2</option>
					</select>
				</div>
			</div>
			<div class="w3-row login-tip">
				<div v-html="createRoomForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: right;">
					<input type="button" class="btn btn-primary" value="创 建" @click="createFriendRoom" />
					<input type="button" class="btn btn-default" value="返 回" @click="back" />
				</div>
			</div>
		</form>

		<form v-show="enterRoomForm.show" class="w3-container" style="text-align: left;">
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">房间编号：</label>
					<input class="form-control" type="text" v-model="enterRoomForm.roomId" placeholder="请填写编号">
				</div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">房间密码：</label>
					<input class="form-control" type="text" v-model="enterRoomForm.roomPwd" placeholder="可不填">
				</div>
			</div>
			<div class="w3-row login-tip">
				<div v-html="enterRoomForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: right;">
					<input type="button" class="btn btn-primary" value="加 入" @click="enterFriendRoom" />
					<input type="button" class="btn btn-default" value="返 回" @click="back" />
				</div>
			</div>
		</form>
	</MyDialog>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'
	import rules from '@/js/game/rule/rules'

	export default {
		data: function() {
			return {
				isShowIndex: true,
				createRoomForm: {
					show: false,
					rule: 'rule1',
					roomPwd: "",
					tipMsg: ""
				},
				enterRoomForm: {
					show: false,
					roomId: "",
					roomPwd: '',
					tipMsg: ""
				}
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
				this.scene.dialogManage.friendRoom.show = false;
			},
			back() {
				this.isShowIndex = true;
				this.createRoomForm.show = false;
				this.enterRoomForm.show = false;
			},
			toCreateForm() {
				this.isShowIndex = false;
				this.createRoomForm.show = true;
				this.enterRoomForm.show = false;
			},
			toEnterForm() {
				this.isShowIndex = false;
				this.createRoomForm.show = false;
				this.enterRoomForm.show = true;
			},
			createFriendRoom() {
				let that = this;
				this.scene.mediator.action.emit({
					event: "createRoom",
					data: {
						isFriendRoom: true,
						rule: this.createRoomForm.rule,
						rpwd: this.createRoomForm.roomPwd
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.createRoomForm.tipMsg = "创建成功，请邀请好友进入房间！";
						} else {
							that.createRoomForm.tipMsg = data["errMsg"];
						}
					}
				});
			},
			enterFriendRoom() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.enterRoomForm.tipMsg = "";
					}, 3000);
				}

				let roomId = this.enterRoomForm.roomId;
				if(!roomId) {
					this.enterRoomForm.tipMsg = "房间编号不能为空！";
					clearTipMsg();
					return false;
				}
				if(Math.floor(roomId) != roomId) {
					this.enterRoomForm.tipMsg = "房间编号必须为整数！";
					clearTipMsg();
					return false;
				}

				this.scene.mediator.action.emit({
					event: "enterRoom",
					data: {
						rid: this.enterRoomForm.roomId,
						rpwd: this.enterRoomForm.roomPwd
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.closeModel();
						} else {
							that.enterRoomForm.tipMsg = data["errMsg"];
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