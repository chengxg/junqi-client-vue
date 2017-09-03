<template>

	<div v-show="showing" class="spinner-modal" :style="myStyle">
		<div class="spinner-modal-content spinner">
			<div class="rect1"></div>
			<div class="rect2"></div>
			<div class="rect3"></div>
			<div class="rect4"></div>
			<div class="rect5"></div>
		</div>
	</div>

</template>

<script>
	const DEFAULT_OPT = {
		id: 'spinner-default',
		parent: 'body',
		message: '',
		backgroundColor: 'rgba(0,0,0,0.4)',
		duration: 60000
	}

	export default {
		name: 'spinner',
		DEFAULT_OPT: DEFAULT_OPT,
		data() {
			return {
				option: {},
				showing: false,
			}
		},
		props: [],
		computed: {
			mergedOption: function() {
				return Object.assign({}, DEFAULT_OPT, this.option);
			},
			myStyle: function() {
				return {
					backgroundColor: this.mergedOption.backgroundColor
				}
			}
		},
		watch: {
			showing: function() {
				if(!this.showing) {
					clearTimeout(this.timeoutId);
					this.timeoutId = null;
				} else {
					this.timeoutId = setTimeout(() => {
						this.showing = false
					}, this.mergedOption.duration);
				}
			}
		}
	}
</script>

<style>
	.spinner-modal {
		z-index: 3;
		display: block;
		padding: 0;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: rgba(0, 0, 0, 0.4);
	}
	
	.spinner-modal-content {
		position: relative;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		box-sizing: border-box;
		padding: 0;
		margin: 0;
		opacity: 1;
	}
	
	.spinner {
		width: 50px;
		height: 60px;
		text-align: center;
		font-size: 14px;
	}
	
	.spinner>div {
		background-color: #df2d2d;
		height: 100%;
		width: 6px;
		display: inline-block;
		-webkit-animation: stretchdelay 1.2s infinite ease-in-out;
		animation: stretchdelay 1.2s infinite ease-in-out;
	}
	
	.spinner .rect2 {
		-webkit-animation-delay: -1.1s;
		animation-delay: -1.1s;
	}
	
	.spinner .rect3 {
		-webkit-animation-delay: -1.0s;
		animation-delay: -1.0s;
	}
	
	.spinner .rect4 {
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}
	
	.spinner .rect5 {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}
	
	@-webkit-keyframes stretchdelay {
		0%,
		40%,
		100% {
			-webkit-transform: scaleY(0.4)
		}
		20% {
			-webkit-transform: scaleY(1.0)
		}
	}
	
	@keyframes stretchdelay {
		0%,
		40%,
		100% {
			transform: scaleY(0.4);
			-webkit-transform: scaleY(0.4);
		}
		20% {
			transform: scaleY(1.0);
			-webkit-transform: scaleY(1.0);
		}
	}
</style>