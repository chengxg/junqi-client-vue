<style>
	.rule-container {
		max-height: 350px;
		overflow-y: auto;
		text-align: left;
		padding-bottom: 10px;
	}
	
	.rule-item-wrap {
		padding: 5px 0;
	}
	
	.rule-item-1 {
		color: blue;
	}
	
	.rule-item-2 {
		color: #FF9000;
		padding-left: 25px;
	}
	
	.rule-span-chess {
		color: green;
		padding: 2px 5px;
		text-align: center;
	}
</style>
<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="closeModel">
		<h4 slot="header" style="">游戏规则</h4>

		<div class="w3-container rule-container">
			<h4>【工兵扛军旗】规则:</h4>
			<div class="rule-item-wrap">
				<span class="rule-item-1">简介：</span>
				此玩法为翻棋玩法，
				<span class="rule-span-chess">地雷</span>被
				<span class="rule-span-chess">工兵</span>挖上不会消失，反而被
				<span class="rule-span-chess">工兵</span>所用；
				<span class="rule-span-chess">军旗</span>被
				<span class="rule-span-chess">工兵</span>扛上游戏不会结束，
				<span class="rule-span-chess">军旗</span>变成了
				<span class="rule-span-chess">工兵</span>的杀人工具；
				<span class="rule-span-chess">炸弹</span>会被
				<span class="rule-span-chess">排长</span>俘获,变成自己阵营的棋子； 该玩法意在双方进行攻防厮杀,而非进行夺棋厮杀。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">1.军棋棋盘： </span>
				军棋棋盘包含铁路线、公路线，包括10个行营、46个兵站、4个大本营。在该玩法中,大本营等同于兵站。 兵站是棋子的摆放位置；铁路线是部分棋子的快行线，只要在直线上或弯路棋子走步数不限； 公路线是慢行线，每次只能移动一步； 行营是棋子的安全岛，在行营中的棋子可以免受其他任何棋子的攻击。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">2.棋子类型： </span>
				<br/>
				<span class="rule-item-2" style="padding-left: 20px;">普通棋子类型有；</span>
				<span class="rule-span-chess">司令</span>,
				<span class="rule-span-chess">军长</span>,
				<span class="rule-span-chess">师长</span>,
				<span class="rule-span-chess">旅长</span>,
				<span class="rule-span-chess">团长</span>,
				<span class="rule-span-chess">营长</span>,
				<span class="rule-span-chess">连长</span>,
				<span class="rule-span-chess">排长</span>,
				<span class="rule-span-chess">工兵</span>,
				<span class="rule-span-chess">地雷</span>,
				<span class="rule-span-chess">军旗</span>
				<br/>
				<span class="rule-item-2" style="padding-left: 20px;">组合棋子类型有；</span>
				<span class="rule-span-chess">工兵+地雷</span>,
				<span class="rule-span-chess">工兵+军旗</span>,
				<span class="rule-span-chess">工兵+地雷+军旗</span>,
				<span class="rule-span-chess">排长+炸弹</span>， 其中（
				<span class="rule-span-chess">地雷</span>,
				<span class="rule-span-chess">军旗</span>,
				<span class="rule-span-chess">炸弹</span>均为对方棋子）。

			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">3.杀棋规则： </span>
				<div style="">
					<span class="rule-item-2">普通棋子大小：</span>
					<span class="rule-span-chess">司令</span>>
					<span class="rule-span-chess">军长</span>>
					<span class="rule-span-chess">师长</span>>
					<span class="rule-span-chess">旅长</span>>
					<span class="rule-span-chess">团长</span>>
					<span class="rule-span-chess">营长</span>>
					<span class="rule-span-chess">连长</span>>
					<span class="rule-span-chess">排长</span>>
					<span class="rule-span-chess">工兵</span>

					<span class="rule-span-chess">地雷</span>和
					<span class="rule-span-chess">军旗</span>不能移动，

					<span class="rule-span-chess">炸弹</span>可以移动,但是不能进入行营，
					<span class="rule-span-chess">炸弹</span>可以炸掉除
					<span class="rule-span-chess">排长</span>之外的棋子； 相同的棋子相遇后同时消失。
					<span class="rule-span-chess">工兵</span>遇到对方的
					<span class="rule-span-chess">地雷</span>或
					<span class="rule-span-chess">军旗</span>，将变成组合棋子
					<span class="rule-span-chess">工兵+地雷</span>或
					<span class="rule-span-chess">工兵+军旗</span>或
					<span class="rule-span-chess">工兵+地雷+军旗</span>。
					<span class="rule-span-chess">排长</span>遇到对方的
					<span class="rule-span-chess">炸弹</span>变成组合棋子
					<span class="rule-span-chess">排长+炸弹</span>。
				</div>
				<div style="">
					<span class="rule-item-2">组合棋子大小： </span>
					<span class="rule-span-chess">工兵+地雷</span>可以炸掉比
					<span class="rule-span-chess">工兵</span>大的单个棋子同时扔掉一个
					<span class="rule-span-chess">地雷</span>，
					<span class="rule-span-chess">工兵+军旗</span>可以杀掉比
					<span class="rule-span-chess">工兵</span>大的单个棋子，
					<span class="rule-span-chess">排长+炸弹</span>的威力与
					<span class="rule-span-chess">炸弹</span>相同。
					<span class="rule-span-chess">工兵+地雷</span>、
					<span class="rule-span-chess">炸弹</span>、
					<span class="rule-span-chess">排长+炸弹</span>可以炸掉己方的
					<span class="rule-span-chess">地雷</span>、
					<span class="rule-span-chess">军旗</span>，让对方的
					<span class="rule-span-chess">工兵</span>无
					<span class="rule-span-chess">地雷</span>可挖，
					<span class="rule-span-chess">军旗</span>可扛，由此
					<span class="rule-span-chess">工兵</span>、
					<span class="rule-span-chess">地雷</span>、
					<span class="rule-span-chess">军旗</span>、
					<span class="rule-span-chess">排长</span>、
					<span class="rule-span-chess">炸弹</span>成为了双方关注的焦点。
				</div>
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">4.行棋规则： </span>
				<span class="rule-span-chess">工兵</span>
				及工兵的组合棋子可以在铁路线上在没有阻挡的情况下任意行棋；
				<span class="rule-span-chess">炸弹</span>
				在铁路线上走直线,其余棋子在铁路线上每次只能移动一步(和公路线上一样)； 所有棋子在公路线上只能移动一步。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">5.阵营选择： </span>
				游戏开始时首先翻开的棋子的颜色为该玩家的阵营，然后双方进行厮杀。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">6.胜负规则： </span>
				杀光对方的棋子或对方无棋可走（军旗被扛不会输奥），方可胜利。 玩家超时5次或断开网络链接90s自动判负。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">7.玩法说明： </span>
				游戏开始时，系统随机指定一人为先手，玩家轮流进行翻棋或行棋， 轮到自己行棋时，点击自己的棋子即可选择，然后点击目的位置即可完成行棋。 左右滑动组合棋子可查看该组合棋子的棋子组成，在移动组合棋子时也可选择部分棋子进行移动。 一方的行棋时间最长为30s，超时则由另一方进行行棋。
			</div>
			
			<h4>【工兵夺军旗】规则:</h4>
			<div class="rule-item-wrap">
				<span class="rule-item-1">简介：</span>
				此玩法为经典的翻棋玩法（已夺取对方的军旗为目标），只要
				<span class="rule-span-chess">工兵</span>或
				<span class="rule-span-chess">炸弹</span>先把对方的
				<span class="rule-span-chess">地雷</span>排除掉, 然后
				<span class="rule-span-chess">工兵</span>扛上对方的
				<span class="rule-span-chess">军旗</span>就赢了
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">1. 杀棋规则： </span>
				
				<span class="rule-span-chess">司令</span>>
				<span class="rule-span-chess">军长</span>>
				<span class="rule-span-chess">师长</span>>
				<span class="rule-span-chess">旅长</span>>
				<span class="rule-span-chess">团长</span>>
				<span class="rule-span-chess">营长</span>>
				<span class="rule-span-chess">连长</span>>
				<span class="rule-span-chess">排长</span>>
				<span class="rule-span-chess">工兵</span>

				<span class="rule-span-chess">地雷</span>和
				<span class="rule-span-chess">军旗</span>不能移动，

				<span class="rule-span-chess">炸弹</span>可以移动,也可以进入行营，
				<span class="rule-span-chess">炸弹</span>与对方的棋子相遇后同时消失。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">2.行棋规则： </span>
				<span class="rule-span-chess">工兵</span>
				可以在铁路线上在没有阻挡的情况下任意行棋；
				其他棋子在铁路线上走直线； 所有棋子在公路线上只能移动一步。
			</div>
			<div class="rule-item-wrap">
				<span class="rule-item-1">其他规则同【工兵扛军旗】玩法</span>
			</div>
		</div>
	</MyDialog>
</template>

<script>
	import MyDialog from './dialog'

	export default {
		name: 'player-info',
		data: function() {
			return {

			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
		},
		methods: {
			closeModel: function() {
				this.scene.dialogManage.ruleInfo.show = false;
			}
		},
		components: {
			MyDialog
		}
	}
</script>