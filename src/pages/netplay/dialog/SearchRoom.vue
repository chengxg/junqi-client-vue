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
		<h4 slot="header" style="">匹配房间</h4>

		<div class="w3-row" style="padding: 5px;text-align: left;">
			当前在线玩家：{{playerNum}}
		</div>
		<form class="w3-container" style="text-align: left;">
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: left;">
					<label for="searchModelRule">玩法：</label>
					<select class="w3-select w3-border w3-sand" style="width: 100px;" v-model="searchModel.rule">
						<option v-for="(rule,index) in ruleSelect" :key="index" :value="rule.key">{{rule.value}}</option>
					</select>
				</div>
			</div>
			<div class="w3-row" style="padding: 5px;">
				<div class="w3-col s12" style="text-align: right;">
					<input type="button" class="btn btn-primary" value="查询" @click="searchRoomsNoPage" />
					<input type="button" class="btn btn-default" value="新建房间" @click="openRoomCreateDialog" />
				</div>
			</div>
		</form>

		<div class="w3-row" style="padding: 5px;height: 280px;overflow: auto;">
			<table class="w3-table w3-bordered w3-striped w3-border my-table">
				<thead>
					<tr class="w3-blue">
						<th>玩法</th>
						<th colspan="2">玩家名称</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody v-if="rooms.length">
					<tr v-for="room in rooms" v-if="room">
						<td>
							<span>{{getPlayRuleName(room.ruleName)}}</span>
						</td>
						<td>
							<a href="javascript:;" class="my-a" @click.prevent="openPlayerInfoDialog(room.p1n)">{{room.p1n}}</a>
						</td>
						<td>
							<a href="javascript:;" class="my-a" @click.prevent="openPlayerInfoDialog(room.p2n)">{{room.p2n}}</a>
						</td>
						<td>
							<a class="my-a" @click="enterRoomAction(room.id)">
								<i class="fa fa-sign-in fa-2x" aria-hidden="true"></i>
							</a>
						</td>
					</tr>
				</tbody>
				<tbody v-if="rooms.length === 0">
					<tr>
						<td colspan="4" style="text-align: center;color: red;">
							<span>没有找到符合条件的房间</span>
							<br/>
							<span>您可以创建一个房间</span>
						</td>
					</tr>
				</tbody>
				<tbody v-if="showPagination">
					<tr>
						<td colspan="4" style="text-align: center;color: red;">
							<ul class="w3-pagination w3-border w3-round">
								<li>
									<a href="#" :class="{'page-disabled':!isEnablePrevious}" @click="searchRoomsPrevious">&#10094; 上一页</a>
								</li>
								<li>
									<a href="#" :class="{'page-disabled':!isEnableNext}" @click="searchRoomsNext">下一页 &#10095;</a>
								</li>
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<PlayerInfo :dialog="playerInfoDialog"></PlayerInfo>
		<RoomCreate :dialog="roomCreateDialog"></RoomCreate>
	</MyDialog>
</template>

<script>
	import store from '@/store'
	
	import CON from '@/js/ConEnum'
	import rules from '@/js/rule/rules'
	
	import MyDialog from './dialog'
	import PlayerInfo from './PlayerInfo'
	import RoomCreate from './RoomCreate'
	
	let scene = null;

	export default {
		data: function() {
			return {
				playerNum: 0,
				searchModel: {
					rule: 'rule1',
					minRoomId: 0,
					maxRoomId: 0,
					isPrevious: false,
					isNext: false
				},
				isEnablePrevious: false,
				isEnableNext: false,
				rooms: [],
				playerInfoDialog: {
					show: false,
					playerName: null
				},
				roomCreateDialog: {
					show: false
				},
				ruleSelect: []
			}
		},
		props: [],
		created: function() {
			for(let filed in rules) {
				let rule = rules[filed];
				this.ruleSelect.push({
					"key": rule.name,
					"value": rule.description
				});
			}
			
			scene = store.net.scene;

			this.searchPlayerNum();
			this.searchRoomsNoPage();
		},
		computed: {
			showPagination: function() {
				return this.isEnablePrevious || this.isEnableNext
			}
		},
		methods: {
			getPlayRuleName(ruleName) {
				if(ruleName in rules && rules[ruleName]) {
					return rules[ruleName].description;
				}
				return "待定";
			},
			closeModel() {
				scene.dialogManage.searchRoom.show = false;
			},
			searchRoomsAction(callback) {
				let that = this;

				scene.mediator.action.emit({
					event: "searchRooms",
					data: this.searchModel,
					isShowSpinner: true,
					success: function(rooms) {
						if(callback) {
							callback(rooms);
						}
					}
				});
			},
			searchRoomsNoPage() {
				let that = this;
				this.searchModel.isPrevious = false;
				this.searchModel.isNext = false;
				this.searchRoomsAction(function(rooms) {
					that.rooms = rooms;
					if(rooms && (rooms.length >= 5)) {
						that.isEnablePrevious = false;
						that.isEnableNext = true;
					}
				});
			},
			searchRoomsPrevious() {
				let that = this;
				this.searchModel.isPrevious = true;
				this.searchModel.isNext = false;
				this.searchModel.maxRoomId = this.rooms[0].id;
				this.searchRoomsAction(function(rooms) {
					if(rooms && rooms.length > 0) {
						that.isEnableNext = true;
						if(rooms.length >= 5) {
							that.isEnablePrevious = true;
						} else {
							that.isEnablePrevious = false;
						}
						that.rooms = rooms;
					} else {
						that.isEnablePrevious = false;
						that.isEnableNext = true;
					}
				});
			},
			searchRoomsNext() {
				let that = this;
				this.searchModel.isPrevious = false;
				this.searchModel.isNext = true;
				this.searchModel.minRoomId = this.rooms[this.rooms.length - 1].id;
				this.searchRoomsAction(function(rooms) {
					if(rooms && rooms.length > 0) {
						that.rooms = rooms;
						that.isEnablePrevious = true;
						if(rooms.length >= 5) {
							that.isEnableNext = true;
						} else {
							that.isEnableNext = false;
						}
					} else {
						that.isEnablePrevious = true;
						that.isEnableNext = false;
					}
				});
			},
			createRoomAction() {
				let that = this;

				scene.mediator.action.emit({
					event: "createRoom",
					data: {

					},
					isShowSpinner: true,
					success: function(data) {
						scene.dialogManage.searchRoom.show = false;
						scene.dialogManage.roomInfo.show = true;
					}
				});
			},
			enterRoomAction(roomId) {
				let that = this;

				scene.mediator.action.emit({
					event: "enterRoom",
					data: {
						"rid": roomId
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							scene.dialogManage.searchRoom.show = false;
							scene.dialogManage.roomInfo.show = true;
						} else {
							scene.messageCenter.addErrMsgArr(data.errMsgArr);
						}
					}
				});
			},
			searchPlayerNum() {
				let that = this;

				scene.mediator.action.emit({
					event: "playerNum",
					data: null,
					success: function(data) {
						that.playerNum = data.num;
					}
				});
			},
			cancel() {
				this.beforeClose();
			},
			openPlayerInfoDialog(playerName) {
				this.playerInfoDialog.show = true;
				this.playerInfoDialog.playerName = playerName;
			},
			openRoomCreateDialog() {
				this.roomCreateDialog.show = true;
			},
			closePlayerInfoDialog() {

			}
		},
		components: {
			MyDialog,
			PlayerInfo,
			RoomCreate
		}
	}
</script>