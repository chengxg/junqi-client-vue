<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="closeModel">
		<h4 slot="header" style="">聊天</h4>

		<div class="w3-row" style="text-align: center;padding: 5px;">
			<div class="w3-col s9" style="padding-right: 5px;">
				<input class="form-control" type="text" v-model="myMsg" placeholder="请输入聊天信息">
			</div>

			<div class="w3-col s3" style="text-align: right;padding-left: 5px;">
				<input type="button" class="btn btn-primary" style="width: 100%;" value="发 送" @click.prevent="send" />
			</div>
		</div>
		<div class="w3-row" style="text-align: center;padding: 5px;height: 250px;overflow: auto;">
			<div class="chat-list-wrap" v-for="(item, index) in playerChatMsgArr">
				<div v-if="item.playerName === myName" class="chat-item" style="text-align: right;">
					<div class="w3-card-2 w3-green chat-msg-content">
						{{item.chatMsg}}
					</div>
					<div class="w3-card-2 w3-blue chat-name">
						{{item.playerName}}
					</div>
				</div>
				<div v-if="item.playerName != myName" class="chat-item" style="text-align: left;">
					<div class="w3-card-2 w3-blue chat-name">
						{{item.playerName}}
					</div>
					<div class="w3-card-2 w3-light-grey chat-msg-content">
						{{item.chatMsg}}
					</div>
				</div>
			</div>
		</div>
	</MyDialog>
</template>

<style>
	.chat-list-wrap {
		padding: 5px 0;
		background: white;
	}
	
	.chat-item {
		padding: 5px;
	}
	
	.chat-name {
		display: inline-block;
		padding: 5px;
	}
	
	.chat-msg-content {
		display: inline-block;
		border-radius: 5px;
		text-align: left;
		padding: 5px;
		min-width: 30%;
		max-width: 75%;
		word-wrap: break-word;
	}
	
	.chat-time-wrap {
		background: gray;
		color: white;
	}
</style>

<script>
	import store from '@/store'
	
	import CON from '@/js/ConEnum'
	import MyDialog from './dialog'

	let scene = null;

	export default {
		data: function() {
			return {
				playerChatMsgArr: [],
				myMsg: "",
				myName: ""
			}
		},
		props: [],
		created: function() {
			scene = store.net.scene;
			this.playerChatMsgArr = scene.mediator.room.playerChatMsgArr;
			this.myMsg = scene.dialogManage.chat.myMsg;
			this.myName = scene.mediator.player.name;
		},
		computed: {

		},
		destroyed: function() {
			scene.dialogManage.chat.myMsg = this.myMsg;
		},
		methods: {
			closeModel() {
				scene.dialogManage.chat.show = false;
			},
			send() {
				let that = this;
				if(!this.myMsg) {
					scene.messageCenter.addTipMsg("发送的消息不能为空！");
					return;
				}
				if(this.myMsg.length > 100) {
					scene.messageCenter.addTipMsg("发送的消息不能超过100个字！");
					return;
				}

				scene.mediator.action.emit({
					event: "chat",
					data: {
						msg: this.myMsg
					},
					success: function(data) {
						that.myMsg = "";
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