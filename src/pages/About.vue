<template>
	<div class="page">
		<div class="page-layer">
			<div class="page-back-wrap">
				<router-link to="/">
					<mt-button type="primary" size="small">
						<i class="fa fa-chevron-left" aria-hidden="true"></i>
					</mt-button>
				</router-link>
			</div>
			<div style="position: absolute;left: 50%;transform: translate(-50%);width: 100%;">
				<h5>
					<img src="../assets/image/logo.png" class="app-icon" style="width: 30px;" />
					<span class="title">关于</span>
				</h5>
			</div>
		</div>
		<div class="page-layer">
			<div style="position: absolute;width:80%;left: 50%;top:50%;transform: translate(-50%, -50%);text-align: left;">
				<p>【工兵扛军旗】是我们几个小伙伴改良的一种玩法, 此种玩法以杀光对方所有棋子为目标,展开的攻防作战。 与主流的玩法存在一些不同点，如:除工兵、炸弹外的普通棋子只能一步一步的走， 特定棋子可以组合为棋子组，军旗被扛不再是胜负的条件，而是变成杀人的工具。游戏采用html5制作，跨平台，手机电脑均支持。</p>
				<p><span class="title">游戏网址1：</span><br><a href="http://junqi.chengxg.com" class="my-a">http://junqi.chengxg.com</a></p>
				<p><span class="title">游戏网址2：</span><br><a href="https://chengxiaogang.gitee.io/junqi" class="my-a">https://chengxiaogang.gitee.io/junqi</a></p>
				<p><span class="title">安装包下载：</span><br><a href="https://chengxiaogang.gitee.io/junqi/junqi.apk" class="my-a">https://chengxiaogang.gitee.io/junqi/junqi.apk</a></p>
				<p><span class="title">测试用户：</span>qwe asd zxc fgh 密码为: 123</p>
				<p><span class="title">当前版本：</span>1.6.0</p>
				<p><span class="title">版本更新：</span>点击游戏网址可获取最新版本</p>
				<p><span class="title">反馈邮箱：</span>skdcxg@163.com</p>
				<p><span class="title">版权所有</span>©2018-2019 程小刚 孔维宝</p>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		components: {
			
		}
	}
</script>

<style scoped>
	.title{
		font-weight: bold;
		color: orange;
	}
	.my-a{
		font-size: 14px;
	}
</style>