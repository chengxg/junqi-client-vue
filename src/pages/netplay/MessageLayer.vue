<template>
	<div class="page-layer pointer-events-through">
		<div class="messagecenter-wrap" v-if="messageCenter">
			<div class="messagecenter-tip">
				<div class="w3-blue messagecenter-tip-item" v-for="msgObj in messageCenter.tipMsgArr" v-html="msgObj.message"></div>
			</div>
			<div class="messagecenter-error">
				<div class="w3-red messagecenter-error-item" v-for="errObj in messageCenter.errMsgArr">
					<div v-html="errObj.errName"></div>
					<div v-if="errObj.errDetail" v-html="errObj.errDetail"></div>
				</div>
			</div>
		</div>

		<NetSpinner></NetSpinner>
	</div>
</template>

<style>
	.messagecenter-wrap {
		position: absolute;
		width: 80%;
		text-align: center;
		left: 50%;
		top: 10%;
		transform: translate(-50%, 0);
	}
	
	.messagecenter-tip {
		width: 100%;
		text-align: center;
	}
	
	.messagecenter-tip-item {
		padding: 5px;
	}
	
	.messagecenter-error {
		width: 100%;
		text-align: center;
	}
	
	.messagecenter-error-item {
		padding: 5px;
	}
</style>

<script>
	import store from '@/store'
	
	import NetSpinner from './dialog/Spinner'

	export default {
		data() {
			return {
				messageCenter: null
			}
		},
		props: [],
		created: function() {
			let scene = store.net.scene;
			this.messageCenter = scene.messageCenter;
		},
		methods: {

		},
		components: {
			NetSpinner
		}
	}
</script>