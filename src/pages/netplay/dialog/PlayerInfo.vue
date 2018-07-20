<template>
	<MyDialog :isClickMaskClose="true" :show="dialog.show" :beforeClose="closeModel">
		<h4 slot="header" style="">玩家信息</h4>

		<div style="width: 100%;min-height: 100px;">
			<template v-if="playerInfo">
				<div class="w3-row" style="padding: 5px 5px;">
					<div class="w3-col s6">
						<img v-if="playerInfo.headImage" :src="playerInfo.headImage.url" style="width: 40px;" />
						<span>用户名：
							<span>{{playerInfo.name}}</span>
						</span>
					</div>
				</div>
				<div class="w3-row" style="padding: 5px 5px;">
					<div class="w3-col s6">
						胜利：
						<span>{{playerInfo.winCount}}</span>
					</div>
					<div class="w3-col s6">
						失败：
						<span>{{playerInfo.loseCount}}</span>
					</div>
				</div>
				<div class="w3-row" style="padding: 5px 5px;">
					<div class="w3-col s6">
						平局：
						<span>{{playerInfo.drawCount}}</span>
					</div>
					<div class="w3-col s6">
						逃跑：
						<span>{{playerInfo.escapeCount}}</span>
					</div>
				</div>
				<div class="w3-row" style="padding: 5px 5px;">
					<div class="w3-col s6">
						分数：
						<span>{{playerInfo.score}}</span>
					</div>
					<div class="w3-col s6">
						游戏豆：
						<span>{{playerInfo.beans}}</span>
					</div>
				</div>
			</template>
			<div v-if="errMsgArr && errMsgArr.length > 0">
				<div v-for="err in errMsgArr" class="w3-row" style="padding: 5px 5px;">
					{{err.errName}}
					<span v-if="err.errDetail">:{{err.errDetail}}</span>
				</div>
			</div>
		</div>
	</MyDialog>
</template>

<script>
	import store from '@/store'
	
	import MyDialog from './dialog'
	
	let scene = null;
	
	export default {
		data: function() {
			return {
				playerInfo: null,
				errMsgArr: []
			}
		},
		created: function() {
			scene = store.net.scene;
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
			"dialog.playerName": function() {
				let that = this;

				that.errMsgArr = [];
				scene.mediator.action.emit({
					event: "playerInfo",
					data: {
						pn: this.dialog.playerName
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.playerInfo = data.userInfo;
						} else {
							that.errMsgArr = data.errMsgArr
						}
					}
				});
			}
		},
		methods: {
			closeModel: function() {
				this.dialog.show = false;
			}
		},
		components: {
			MyDialog
		}
	}
</script>

<style>

</style>