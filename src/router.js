import Vue from 'vue'
import Router from 'vue-router'

import NotFound from './pages/404'
import Home from './pages/Home'
import About from './pages/About'
import Setting from './pages/Setting'
import LocalPlay from './pages/localplay/MainScene'
import NetPlay from './pages/netplay/MainScene'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'Home',
		component: Home
	}, {
		path: '/home',
		name: 'Home',
		component: Home
	}, {
		path: '/about',
		name: 'About',
		component: About
	}, {
		path: '/setting',
		name: 'Setting',
		component: Setting
	}, {
		path: '/localplay',
		name: 'LocalPlay',
		component: LocalPlay
	}, {
		path: '/netplay',
		name: 'NetPlay',
		component: NetPlay
	}, {
		path: '*',
		name: 'NotFound',
		component: NotFound
	}]
})