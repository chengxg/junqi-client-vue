<script>
	import CBP from '@/js/game/ChessboardPara'
	import routes from './routes'

	export default {
		name: 'app',
		data: function() {
			return {

			}
		},
		props: ["currentRoute"],
		render: function(h) {
			return h(this.ViewComponent)
		},
		mounted: function() {
			this.$parent.$data.isRefresh = false;
		},
		computed: {
			ViewComponent: function() {

				const matchingView = routes[this.currentRoute]
				return matchingView ?
					matchingView :
					routes["/notfound"]
			}
		}
	}
</script>