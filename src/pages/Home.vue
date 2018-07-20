<style scoped>
	.home-btn-group{
		position: absolute;
		left: 50%;
		top: 60%;
		transform: translate(-50%, -50%);
	}
	.mint-button--primary{
		width: 120px;
	}
</style>
<template>
	<div class="page">
		<div class="page-layer">
			<div style="position: absolute;left: 50%;transform: translate(-50%);width: 100%;">
				<h1>
					<img src="../assets/image/logo.png" class="app-icon" style="width: 50px;" />
					<span>工兵扛军旗</span>
				</h1>
				<img src="../assets/image/gongbing.png" style="width: 100%;" />
			</div>
		</div>
		<div class="page-layer pointer-events-through">
			<div class="home-btn-group">
				<div class="w3-row w3-padding-8">
					<router-link to="/localplay">
						<mt-button type="primary" size="small">两人对战</mt-button>
					</router-link>
				</div>
				<div class="w3-row w3-padding-8">
					<router-link to="/netplay">
						<mt-button type="primary" size="small">联网对战</mt-button>
					</router-link>
				</div>
				<div class="w3-row w3-padding-8">
					<router-link to="/setting">
						<mt-button type="primary" size="small">设置</mt-button>
					</router-link>
				</div>
				<div class="w3-row w3-padding-8">
					<router-link to="/about">
						<mt-button type="primary" size="small">关于</mt-button>
					</router-link>
				</div>
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