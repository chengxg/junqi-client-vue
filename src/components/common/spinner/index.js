import Spinner from './Spinner'

export default {
	install(Vue, defaultOptions = {}) {
		const CONSTRUCTOR = Vue.extend(Spinner)
		let cache = null;
		Object.assign(Spinner.DEFAULT_OPT, defaultOptions)

		function spinner(options = {}) {
			let spinner = cache || (cache = new CONSTRUCTOR);
			spinner.option = options;
			if(!spinner.$el) {
				let vm = spinner.$mount();
				document.querySelector(options.parent || Spinner.DEFAULT_OPT.parent || 'body').appendChild(vm.$el);
			}
			if(options["showing"] === false) {
				spinner.showing = false;
			} else {
				spinner.showing = true;
			}
		}
		Vue.prototype.$spinner = spinner
	}
}