<template>
	<div class="page-layer pointer-events-through">
		<SceneMenu v-if="dialogManage.menu.show"></SceneMenu>
		<RoomCreate v-show="dialogManage.roomCreate.show"></RoomCreate>
		<GameSetting v-if="dialogManage.gameSetting.show"></GameSetting>
		<RoomInfo v-if="dialogManage.roomInfo.show"></RoomInfo>
		<SuePeace v-if="dialogManage.suePeace.show"></SuePeace>
		<GiveUp v-if="dialogManage.giveUp.show"></GiveUp>
		<RuleInfo v-if="dialogManage.ruleInfo.show"></RuleInfo>
		<Victory v-if="dialogManage.victory.show"></Victory>
	</div>
</template>

<script>
	import SceneMenu from './dialog/Menu'
	import RoomCreate from './dialog/RoomCreate'
	import RoomInfo from './dialog/RoomInfo'
	import RuleInfo from './dialog/RuleInfo'
	import SuePeace from './dialog/SuePeace'
	import GiveUp from './dialog/GiveUp'
	import Victory from './dialog/Victory'
	import GameSetting from './dialog/GameSetting'

	export default {
		data() {
			return {
				dialogManage: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.dialogManage = this.scene.dialogManage;
		},
		methods: {

		},
		components: {
			SceneMenu,
			RoomCreate,
			RoomInfo,
			RuleInfo,
			SuePeace,
			GiveUp,
			Victory,
			GameSetting
		}
	}
</script>

<style>

</style>