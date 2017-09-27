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
			<div style="position: absolute;left: 50%;transform: translate(-50%);width: 100%;">
				<h1><img src="../assets/image/logo.png" style="width: 50px;"/>工兵扛军旗</h1>
				<img src="../assets/image/gongbing.png" style="width: 100%;"/>
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