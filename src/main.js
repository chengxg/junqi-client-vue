// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
Vue.config.productionTip = false

import './assets/css/font-awesome.css'
import './assets/css/w3.css'
import './assets/css/w3-extension.css'
import './assets/css/game.css'

import routes from './routes'
import CBP from '@/js/game/ChessboardPara'
import App from './App'
import Refresh from './pages/Refresh'

const app = new Vue({
	el: '#app',
	template: '<div id="app" :style="styleobj"><App :currentRoute="currentRoute" v-if="isShowApp"/><Refresh v-if="isRefresh"/></div>',
	data: function() {
		return {
			styleobj: {
				width: CBP.clientWidth + "px",
				height: CBP.clientHeight + "px"
			},
			currentRoute: "/",
			isRefresh: true,
			isShowApp: true
		}
	},
	components: {
		App,
		Refresh
	},
	created: function() {
		this.state = {
			name: "工兵扛军旗",
			local: null,
			net: null
		};
	},
	mounted: function() {
		this.isRefresh = false;
	},
	computed: {

	}
})

window.addEventListener('popstate', () => {
	app.currentRoute = window.location.pathname
})

let isResize = false;
window.addEventListener('resize', () => {
	if(!isResize) {
		isResize = true;
		setTimeout(() => {
			CBP.refresh();
			app.$data.styleobj = {
				width: CBP.clientWidth + "px",
				height: CBP.clientHeight + "px"
			};
			app.$data.isRefresh = true;
			app.$data.isShowApp = false;
			setTimeout(() => {
				app.$data.isShowApp = true;
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

import conEnum from '@/js/game/ConEnum'
import axios from 'axios'

//自动请求后台服务器, 以免超过半小时, 后台服务停机
setInterval(function() {
	refreshServer();
}, 300000);
refreshServer();

function refreshServer() {
	axios.get(conEnum.SERVER_URL.replace("/chess", "/heartbeat"))
		.then(function(response) {
			console.log(response);
		})
		.catch(function(error) {
			console.log(error);
			setTimeout(function(){
				refreshServer();
			},10000);
		});
}