<template>
	<div class="page-layer">
		<div class="btn-home">
			<Vlink href="/">
				<button class="btn btn-default"><i class="fa fa-home self-btn" style="font-size: 1.6em;"></i></button>
			</Vlink>
		</div>
		<div class="btn-menu" @click.prevent="openMenu">
			<button class="btn btn-default"><i class="fa fa-bars self-btn" style="font-size: 1.6em;"></i></button>
		</div>
		<div class="current-tip">
			<div v-if="room&&room.hostPlayer" :class="[currentCampClass]">
				<span>{{room.hostPlayer.name}}</span>
				<br/>
				<span>{{room.hostPlayerTimeCount}}</span>
			</div>
			<div v-if="gameOverMsg.gameOver">
				<span :class="[gameOverMsg.campClass]">{{gameOverMsg.playerName}}</span>
				<br/>
				<span>{{gameOverMsg.victoryMsg}}</span>
			</div>
			<div v-if="room && room.stepNum">
				<span :class="[currentCampClass]">第{{room.stepNum}}步</span>
			</div>
		</div>
	</div>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import Vlink from './../common/Vlink'

	export default {
		data: function() {
			return {
				room: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.room = this.scene.mediator.room;
		},
		methods: {
			goHome: function() {

			},
			openMenu: function() {
				this.scene.dialogManage.menu.show = true;
			}
		},

		computed: {
			currentCampClass: function() {
				let room = this.room;
				if(room && room.hostPlayer) {
					let campClass = "";
					switch(room.hostPlayer.camp) {
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
			gameOverMsg: function() {
				let room = this.room;
				let obj = {
					gameOver: false,
					campClass: null,
					playerName: null,
					victoryMsg: null
				};
				if(room && room.victory !== CON.VICTORY_STATUS.playing && room.player1 && room.player2) {
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
							obj.playerName = "";
							obj.victoryMsg = " 平局";
							break;
					}

				}
				return obj;
			}
		},
		components: {
			Vlink
		}
	}
</script>

<style>
	.btn-home {
		position: absolute;
		top: 50%;
		left: 35%;
		transform: translate(-50%, -50%);
	}
	
	.btn-menu {
		position: absolute;
		top: 50%;
		left: 20%;
		transform: translate(-50%, -50%);
	}
	
	.current-tip {
		position: absolute;
		top: 50%;
		left: 70%;
		transform: translate(-50%, -50%);
	}
	
	.current-tip>div {
		display: inline-block;
		vertical-align: middle;
	}
</style>