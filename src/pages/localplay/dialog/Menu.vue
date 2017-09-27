<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="close">
		<h4 slot="header" style="">菜单</h4>

		<div class="w3-row menu-cells-wrap">
			<div class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('roomCreate')">
					<i class="fa fa-refresh menu-icon"></i>
					<div class="menu-desc">重新开始</div>
				</div>
			</div>
			<div v-if="" class="w3-col s3 menu-cell">
				<div class="w3-card" @click="openDialog('ruleInfo')">
					<i class="fa fa-sticky-note-o menu-icon"></i>
					<div class="menu-desc">游戏规则</div>
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
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'

	export default {
		name: 'menu-scene',
		data: function() {
			return {
				dialogManage: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.dialogManage = this.scene.dialogManage;
		},
		computed: {
			isShowSearchRoom() {
				let room = this.scene.mediator.room;
				let player = this.scene.mediator.player;
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
				let room = this.scene.mediator.room;
				if(room) {
					if(room.id) {
						return true;
					}
				}
				return false;
			},
			isShowSuePeace() {
				let room = this.scene.mediator.room;
				if(room) {
					if(room.status === CON.ROOM_STATUS.gameStart) {
						return true;
					}
				}
				return false;
			},
			isShowGiveUp() {
				let room = this.scene.mediator.room;
				if(room) {
					if(room.status === CON.ROOM_STATUS.gameStart) {
						return true;
					}
				}
				return false;
			},
			isShowPersonalCenter() {
				let player = this.scene.mediator.player;
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