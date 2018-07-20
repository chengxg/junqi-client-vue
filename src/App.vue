<template>
	<div id="app" :style="styleobj">
		<router-view v-if="!isRefresh"></router-view>
		<Refresh v-if="isRefresh"></Refresh>
	</div>
</template>

<script>
	import CBP from '@/js/ChessboardPara'
	import Refresh from './pages/Refresh'

	let data = {
		styleobj: {
			width: CBP.clientWidth + "px",
			height: CBP.clientHeight + "px"
		},
		isRefresh: true
	};

	export default {
		name: 'app',
		data: function() {
			return data
		},
		props: [],
		mounted: function() {
			this.isRefresh = false;
		},
		computed: {

		},
		components: {
			Refresh
		},
	}

	let isResize = false;
	let resizeTimeoutId = 0;
	//监听浏览器窗口变化
	window.addEventListener('resize', () => {
		if(!isResize) {
			isResize = true;
			clearTimeout(resizeTimeoutId);
			resizeTimeoutId = setTimeout(() => {
				CBP.refresh();
				data.styleobj = {
					width: CBP.clientWidth + "px",
					height: CBP.clientHeight + "px"
				};
				data.isRefresh = true;
				setTimeout(() => {
					data.isRefresh = false;
				}, 10);
				isResize = false;
			}, 500);
		}
	})

	window.addEventListener('focus', () => {
		isResize = true;
	}, true)
	window.addEventListener('blur', () => {
		isResize = false;
	}, true)
</script>