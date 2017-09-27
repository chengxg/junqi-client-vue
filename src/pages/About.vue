<template>
	<div class="page">
		<div class="page-layer">
			<div style="position: absolute;width:80%;left: 50%;top:50%;transform: translate(-50%, -50%);text-align: left;">
				<h5><img src="../assets/image/logo.png" style="width: 50px;"/>简介：</h5>
				<p>【工兵扛军旗】是我们几个小伙伴改良的一种玩法, 此种玩法以杀光对方所有棋子为目标,展开的攻防作战。 与主流的玩法存在一些不同点，如:除工兵、炸弹外的普通棋子只能一步一步的走， 特定棋子可以组合为棋子组，军旗被扛不再是胜负的条件，而是变成杀人的工具。</p>
				<p>游戏网址：<a href="http://junqi.chengxg.site" class="my-a">http://junqi.chengxg.site</a></p>
				<p>当前版本：1.0.0</p>
				<p>反馈邮箱：skdcxg@163.com</p>
				<p>版权所有©2017-2018 程小刚</p>
				<div style="text-align: center;">
					<Vlink href="/">
						<button class="btn btn-primary" style="width: 100px;">
							返回
						</button>
					</Vlink>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Vlink from './common/Vlink'

	export default {
		components: {
			Vlink
		}
	}
</script>