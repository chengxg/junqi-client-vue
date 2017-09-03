<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel" v-if="isShow">
		<h4 slot="header" style="">房间信息</h4>

		<div class="w3-row" style="padding: 5px;text-align: left;">
			<span>房间编号: {{room.id}}</span>
			<br>
			<span v-if="room.hostPlayer">
				<span :class="playerCampClass(room.hostPlayer)">
					当前下棋者：
					<span>{{room.hostPlayer.name}}</span>
					&nbsp;
					<span>{{room.hostPlayerTimeCount}}</span>
				</span>
				<span>当前第
					<span>{{room.stepNum+1}}</span>步</span>
			</span>
			<span v-if="gameOverMsg.gameOver" :class="[gameOverMsg.campClass]">
				<span>游戏结束：</span>
				<span>{{gameOverMsg.playerName}}</span>
				<span>{{gameOverMsg.victoryMsg}}</span>
			</span>
		</div>

		<div class="w3-row">
			<div class="w3-col s5 w3-center" style="min-height: 100px;">
				<div v-if="room.player1">
					<ul class="w3-ul">
						<li @click.prevent="openPlayerInfoDialog(p1StatusInfo.name)">
							<span :class="p1StatusInfo.playerCampClass">{{p1StatusInfo.name}}</span>
						</li>
						<li>
							<span v-html="p1StatusInfo.status"></span>
							<span v-if="p1StatusInfo.readyTimeCount">
								请准备：{{p1StatusInfo.readyTimeCount}}
							</span>
						</li>
						<li v-if="p1StatusInfo.connect">
							<span v-html="p1StatusInfo.connect"></span>
						</li>
						<li v-if="p1StatusInfo.timeoutCount">
							<span>超时次数：{{p1StatusInfo.timeoutCount}}</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="w3-col s2 w3-center">
				<p>vs</p>
			</div>
			<div class="w3-col s5 w3-center" style="min-height: 100px;">
				<div v-if="room.player2">
					<ul class="w3-ul">
						<li @click.prevent="openPlayerInfoDialog(p2StatusInfo.name)">
							<span :class="p2StatusInfo.playerCampClass">{{p2StatusInfo.name}}</span>
						</li>
						<li>
							<span v-html="p2StatusInfo.status"></span>
							<span v-if="p2StatusInfo.readyTimeCount" v-html="p2StatusInfo.readyTimeCount"></span>
						</li>
						<li v-if="p2StatusInfo.connect">
							<span v-html="p2StatusInfo.connect"></span>
						</li>
						<li v-if="p2StatusInfo.timeoutCount">
							<span>超时次数：{{p2StatusInfo.timeoutCount}}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="w3-row">
			<div class="w3-col s6 w3-center" style="min-height: 10px;">
				<input style="width: 80%;" class="btn btn-primary" :class="{'disabled':isDisableReadyBtn}" v-if="playerReadyBtnVal" type="button" :value="playerReadyBtnVal" @click="playerReadyAction()">
			</div>
			<div class="w3-col s6 w3-center">
				<input style="width: 80%;" class="btn btn-primary" type="button" value="离开" @click="playerLeaveAction()">
			</div>
		</div>

	</MyDialog>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'

	let scene = null;
	export default {
		name: 'room-info',
		data: function() {
			return {
				room: null,
				isDisableReadyBtn: false,
				playerInfoDialog: {
					show: false,
					playerName: null
				}
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			scene = this.scene;
			this.room = scene.mediator.room;
		},
		watch: {
			"room.status": function() {
				let room = this.room;
				if(room && room.status === CON.ROOM_STATUS.gameStart) {
					this.isDisableReadyBtn = true;
				} else {
					this.isDisableReadyBtn = false;
				}
			}
		},
		computed: {
			isShow() {
				let room = this.room;
				if(room && room.id) {
					return true;
				}
				return false;
			},
			playerReadyBtnVal() {
				let room = this.room;
				if(!room) {
					return "";
				}
				let myName = scene.mediator.player.name;
				let player = room.getPlayerByName(myName);
				if(!player) {
					return "";
				}
				if(player.status === CON.PLAYER_STATUS.notReady || player.status === CON.PLAYER_STATUS.gameOver) {
					return "准备";
				}
				if(player.status === CON.PLAYER_STATUS.ready) {
					return "取消准备";
				}
				return "";
			},
			p1StatusInfo: function() {
				return this.playerStatusInfo(this.room.player1);
			},
			p2StatusInfo: function() {
				return this.playerStatusInfo(this.room.player2);
			},
			gameOverMsg: function() {
				let room = this.room;
				let obj = {
					gameOver: false,
					campClass: null,
					playerName: null,
					victoryMsg: null
				};
				if(room && room.victory !== CON.VICTORY_STATUS.playing &&
					room.player1 && room.player2) {
					obj.gameOver = true;
					switch(room.victory) {
						case CON.VICTORY_STATUS.redwin:
							obj.campClass = "player-camp-red";
							break;
						case CON.VICTORY_STATUS.bluewin:
							obj.campClass = "player-camp-blue";
							break;
						case CON.VICTORY_STATUS.draw:
							obj.campClass = "player-camp-neutral";
							break;
					}
					switch(room.player1.victory) {
						case CON.VICTORY_STATUS.win:
							obj.playerName = room.player1.name;
							obj.victoryMsg = "胜利";
							break;
						case CON.VICTORY_STATUS.lose:
							obj.playerName = room.player2.name;
							obj.victoryMsg = "胜利";
							break;
						case CON.VICTORY_STATUS.draw:
							obj.playerName = "双方";
							obj.victoryMsg = " 战平";
							break;
					}

				}
				return obj;
			}
		},
		methods: {
			playerCampClass: function(player) {
				let room = this.room;
				if(room && player) {
					let campClass = "";
					switch(player.camp) {
						case CON.CAMP.blue:
							campClass = "player-camp-blue";
							break;
						case CON.CAMP.red:
							campClass = "player-camp-red";
							break;
						case CON.CAMP.neutral:
							campClass = "player-camp-neutral";
							break;
					}
					return campClass;
				} else {
					return "";
				}
			},
			closeModel() {
				scene.dialogManage.roomInfo.show = false;
			},
			playerStatusInfo(player) {
				let room = this.room;
				let status = "";
				let statusInfo = {};
				if(room && player) {
					statusInfo.name = player.name;
					statusInfo.status = CON.PLAYER_STATUS[player.status];
					statusInfo.readyTimeCount = 0;
					if(player.status === CON.PLAYER_STATUS.notReady ||
						player.status === CON.PLAYER_STATUS.gameOver) {
						statusInfo.readyTimeCount = player.readyTimeCount;
					}

					statusInfo.connect = "";
					statusInfo.timeoutCount = player.timeoutCount;
					if(player.connect === CON.CONNECT_STATUS.disconnect) {
						statusInfo.connect = "断开连接..." + player.disconnTimeCount + "s";
					}
					statusInfo.playerCampClass = this.playerCampClass(player);

				}
				return statusInfo;
			},
			playerReadyAction() {
				if(this.isDisableReadyBtn) {
					return;
				}

				this.isDisableReadyBtn = true;
				setTimeout(() => {
					this.isDisableReadyBtn = false;
				}, 3000);

				let room = scene.mediator.room;
				if(!room || !room.id) {
					return;
				}
				let socket = scene.mediator.socket;
				let myName = scene.mediator.player.name;
				let player = room.getPlayerByName(myName);
				if(!player) {
					return;
				}
				if(player.status === CON.PLAYER_STATUS.notReady || player.status === CON.PLAYER_STATUS.gameOver) {
					socket.emit("ready");
				}
				if(player.status === CON.PLAYER_STATUS.ready) {
					socket.emit("notReady");
				}
			},
			playerLeaveAction(player) {
				let socket = scene.mediator.socket;
				if(!socket) {
					return;
				}
				let that = this;
				socket.emit("leaveRoom", null, function(data) {
					that.closeModel();
				});
			},
			openPlayerInfoDialog(playerName) {
				this.playerInfoDialog.show = true;
				this.playerInfoDialog.playerName = playerName;
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>

</style>