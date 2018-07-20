<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="close">
		<h4 slot="header" style="">菜单</h4>

		<div class="w3-row menu-cells-wrap">
			<div v-if="" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('login')">
					<i class="fa fa-user-o menu-icon"></i>
					<div class="menu-desc">登录</div>
				</div>
			</div>
			<div v-if="isShowSearchRoom" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('searchRoom')">
					<i class="fa fa-search menu-icon"></i>
					<div class="menu-desc">查询房间</div>
				</div>
			</div>
			<div v-if="isShowFriendRoom" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('friendRoom')">
					<i class="fa fa-sign-in menu-icon"></i>
					<div class="menu-desc">好友房间</div>
				</div>
			</div>
			<div v-if="isShowRoomInfo" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('roomInfo')">
					<i class="fa fa-info menu-icon"></i>
					<div class="menu-desc">房间信息</div>
				</div>
			</div>
			<div v-if="isShowSuePeace" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openSuePeace">
					<i class="fa fa-meh-o menu-icon"></i>
					<div class="menu-desc">求和</div>
				</div>
			</div>
			<div v-if="isShowGiveUp" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('giveUp')">
					<i class="fa fa-frown-o menu-icon"></i>
					<div class="menu-desc">认输</div>
				</div>
			</div>
			<div v-if="isShowChat" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('chat')">
					<i class="fa fa-comment-o menu-icon"></i>
					<div class="menu-desc">聊天</div>
				</div>
			</div>
			<div v-if="" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('ruleInfo')">
					<i class="fa fa-sticky-note-o menu-icon"></i>
					<div class="menu-desc">游戏规则</div>
				</div>
			</div>
			<div v-if="isShowPersonalCenter" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('personalCenter')">
					<i class="fa fa-address-card-o menu-icon"></i>
					<div class="menu-desc">用户中心</div>
				</div>
			</div>
			<div v-if="" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('gameSetting')">
					<i class="fa fa-cog menu-icon"></i>
					<div class="menu-desc">游戏设置</div>
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
		name: 'menu-scene',
		data: function() {
			return {
				dialogManage: null
			}
		},
		props: [],
		created: function() {
			scene = store.net.scene;
			this.dialogManage = scene.dialogManage;
		},
		computed: {
			isShowSearchRoom() {
				let room = scene.mediator.room;
				let player = scene.mediator.player;
				if(!player) {
					return false;
				}
				if(room) {
					if(room.id) {
						return false;
					}
				}
				return true;
			},
			isShowFriendRoom() {
				let room = scene.mediator.room;
				let player = scene.mediator.player;
				if(!player) {
					return false;
				}
				if(room) {
					if(room.id) {
						return false;
					}
				}
				return true;
			},
			isShowRoomInfo() {
				let room = scene.mediator.room;
				if(room) {
					if(room.id) {
						return true;
					}
				}
				return false;
			},
			isShowSuePeace() {
				let room = scene.mediator.room;
				if(room && room["id"]) {
					if(room.status === CON.ROOM_STATUS.gameStart) {
						return true;
					}
				}
				return false;
			},
			isShowGiveUp() {
				let room = scene.mediator.room;
				if(room && room["id"]) {
					if(room.status === CON.ROOM_STATUS.gameStart) {
						return true;
					}
				}
				return false;
			},
			isShowChat() {
				let room = scene.mediator.room;
				if(room && room["id"]) {
					if(room.status === CON.ROOM_STATUS.gameStart) {
						return true;
					}
				}
				return false;
			},
			isShowPersonalCenter() {
				let player = scene.mediator.player;
				if(player) {
					return true;
				}
				return false;
			}
		},
		methods: {
			openDialog(dialogName) {
				if(this.dialogManage && (dialogName in this.dialogManage)) {
					this.dialogManage.menu.show = false;
					this.dialogManage[dialogName].show = true;
				}
			},
			openSuePeace() {
				this.dialogManage.menu.show = false;
				this.dialogManage.suePeace.show = true;
				this.dialogManage.suePeace.setRequest();
			},
			close() {
				this.dialogManage.menu.show = false;
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>
	.menu-cells-wrap {
		padding: 2px;
	}
	
	.menu-cell {
		padding: 5px;
		position: relative;
		border: 0px solid gray;
	}
	
	.menu-cell>div {
		box-sizing: content-box;
		position: absolute;
		width: 95%;
		height: 95%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	
	.menu-cell>div:active {
		background: gainsboro;
	}
	
	.menu-cell:before {
		content: "";
		display: inline-block;
		padding-bottom: 100%;
		width: .1px;
		vertical-align: middle;
	}
	
	.menu-icon {
		font-size: 50px;
		padding-bottom: 5px;
		color: gray;
	}
	
	.menu-desc {
		color: gray;
	}
	
	.menu-tip {
		margin: 0;
		padding: 0;
		color: orange;
	}
</style>