<template>
	<div v-if="isShow" class="modal" :style="modelStyle" @click="clickMask">
		<div :class="modalContentClass">
			<header class="w3-container w3-teal">
				<slot name="header"></slot>
			</header>

			<slot></slot>

			<footer class="w3-container w3-teal">
				<slot name="footer"></slot>
			</footer>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'modal',
		data: function() {
			return {
				isShow: this.show
			}
		},
		props: {
			beforeClose: Function,
			isClickMaskClose: {
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
			modalContentClass: function() {
				return ["scene-model-content"].concat(this.selfContentClass);
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
	.modal {
		z-index: 3;
		display: block;
		padding: 0;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.3);
	}
	
	.scene-model-content {
		position: relative;
		width: 95%;
		top: 50%;
		transform: translateY(-50%);
		box-sizing: border-box;
		padding: 0;
		margin: 0 auto;
		background: white;
	}
</style>