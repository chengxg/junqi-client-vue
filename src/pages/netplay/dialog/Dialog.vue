<template>
	<div v-if="isShow" class="my-dialog" :style="modelStyle" @click="clickMask">
		<div class="w3-card-4 my-dialog-content" :class="selfContentClass">
			<header class="w3-blue my-card-header">
				<slot name="header"></slot>
				<div v-if="isShowCloseBtn" class="my-dialog_closebtn" @click="close">
					<i class="fa fa-times-circle fa-lg" aria-hidden="true"></i>
				</div>
			</header>

			<slot></slot>

			<footer class="w3-container w3-teal">
				<slot name="footer"></slot>
			</footer>
		</div>
	</div>
</template>

<script>
	import store from '@/store'
	
	export default {
		name: 'dialog',
		data: function() {
			return {
				isShow: this.show
			}
		},
		props: {
			beforeClose: Function,
			isClickMaskClose: {
				type: Boolean,
				default: false
			},
			isShowCloseBtn: {
				type: Boolean,
				default: true
			},
			show: {
				type: Boolean,
				default: true
			},
			selfContentClass: {
				type: Array,
				default: function() {
					return [];
				}
			},
			modelStyle: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		computed: {

		},
		watch: {
			show: function() {
				this.isShow = this.show;
			}
		},
		methods: {
			close() {
				if(this.beforeClose) {
					let close = this.beforeClose();
					if(close && close === false) {
						this.isShow = true;
						return;
					}
				}
				this.isShow = false;
			},
			clickMask(e) {
				if(e.target !== e.currentTarget) {
					return false;
				}

				if(this.isClickMaskClose) {
					this.close();
				}
			}
		}
	}
</script>

<style>

</style>