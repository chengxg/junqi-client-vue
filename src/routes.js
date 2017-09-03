import NotFound from './pages/404'
import Home from './pages/Home'
import About from './pages/About'
import LocalPlay from './pages/localplay/MainScene'
import NetPlay from './pages/netplay/MainScene'

export default {
	'/': Home,
	'/home': Home,
	'/index': Home,
	'/about': About,
	"/localplay": LocalPlay,
	"/netplay": NetPlay,
	"/notfound": NotFound
}