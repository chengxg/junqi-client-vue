<template>
	<div class="page-layer pointer-events-through">
		<div v-if="messageCenter">
			<div>
				<div v-for="msgObj in messageCenter.tipMsgArr" v-html="msgObj.message"></div>
			</div>
			<div>
				<div v-for="errObj in messageCenter.errMsgArr">
					<div v-html="errObj.errName"></div>
					<div v-if="errObj.errDetail" v-html="errObj.errDetail"></div>
				</div>
			</div>
		</div>

		<NetSpinner></NetSpinner>
	</div>
</template>

<script>
	import NetSpinner from './dialog/Spinner'

	export default {
		data() {
			return {
				messageCenter: null
			}
		},
		props: [],
		created: function() {
			this.scene = this.$parent.scene;
			this.messageCenter = this.scene.messageCenter;
		},
		methods: {

		},
		components: {
			NetSpinner
		}
	}
</script>

<style>

</style>