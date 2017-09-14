<style>
	.home-btn-group {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
<template>
	<div class="page">
		<div class="page-layer">
			<div style="position: absolute;left: 50%;top:20%;transform: translate(-50%, -50%);">
				<h2>工兵扛军旗</h2>
				<h6><a href="http://junqi.chengxg.site" class="my-a">http://junqi.chengxg.site</a></h6>
			</div>
		</div>
		<div class="page-layer pointer-events-through">
			<div class="home-btn-group">
				<div class="w3-row w3-padding-8">
					<Vlink href="/localplay">
						<button class="btn btn-primary" style="width: 100px;">两人对战</button>
					</Vlink>
				</div>
				<div class="w3-row w3-padding-4">
					<Vlink href="/netplay">
						<button class="btn btn-primary" style="width: 100px;">联机对战</button>
					</Vlink>
				</div>
				<div class="w3-row w3-padding-8">
					<Vlink href="/about">
						<button class="btn btn-primary" style="width: 100px;">关于</button>
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