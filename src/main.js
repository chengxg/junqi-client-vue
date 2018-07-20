// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
Vue.config.productionTip = false

import './assets/css/font-awesome.css'
import './assets/css/w3.css'
import './assets/css/w3-extension.css'
import './assets/css/game.css'

import router from './router'
import store from '@/store'
import CBP from '@/js/ChessboardPara'
import App from './App'

import { Header, Button, Range } from 'mint-ui';
import 'mint-ui/lib/style.css'
Vue.component(Header.name, Header);
Vue.component(Button.name, Button);
Vue.component(Range.name, Range);

const app = new Vue({
	router,
	render: h => h(App)
}).$mount('#app')

import conEnum from '@/js/ConEnum'
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
			setTimeout(function() {
				refreshServer();
			}, 10000);
		});
}

//加载设置
(function() {
	store.setting = {
		backSoundSize: 0,
		gameSoundSize: 80
	};
	let gameSettingFormJson = localStorage.getItem("gameSettingForm");
	if(gameSettingFormJson) {
		let form = null;
		try {
			form = JSON.parse(gameSettingFormJson);
			store.setting = form;
		} catch(e) {}
	}
})();

//播放背景音
import gameSound from '@/js/base/GameSound'
gameSound.playBackSound();