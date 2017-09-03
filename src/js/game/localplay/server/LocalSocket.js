'use strict';
import util from './../../../util'

var LocalSocket = (function() {
	/**
	 * 本地模仿socket.io的socket
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function LocalSocket() {
		this.eventArr = []; //事件
		this.useFunArr = []; //应用的中间件
		//用于关联的客户端socket
		Object.defineProperty(this, "clientSocket", {
			value: null,
			enumerable: false,
			writable: true
		});
	}
	LocalSocket.prototype.createEvent = function(name, callback) {
		return {
			name: name, //事件名
			isOnce: false, //是否只执行一次
			callback: callback //回调
		}
	}
	LocalSocket.prototype.getEvent = function(name) {
		let ev = null;
		this.eventArr.every(function(e, index) {
			if(e.name === name) {
				ev = e;
				return false;
			}
			return true;
		});
		return ev;
	}
	LocalSocket.prototype.removeEvent = function(name) {
		let ev = this.getEvent(name);
		if(ev) {
			let index = this.eventArr.indexOf(ev);
			if(index > -1) {
				this.eventArr.splice(index, 1);
			}
		}
		return ev;
	}
	/**
	 * 同socket.io的socket.on(event, fn)
	 * @param {String} event
	 * @param {Function} fn
	 */
	LocalSocket.prototype.on = function(event, fn) {
		let e = this.createEvent(event, fn);
		this.eventArr.push(e);
		return e;
	}
	/**
	 * 同socket.io的socket.use(event, fn),中间件
	 * @param {Function} fn
	 */
	LocalSocket.prototype.use = function(fn) {
		this.useFunArr.push(fn)
	}
	LocalSocket.prototype.useFilter = function(packet) {
		let useFunArr = this.useFunArr;
		let len = useFunArr.length;
		let index = 0;
		if(len) {
			useFunArr[0](packet, next);
			if(index === len - 1) {
				return true;
			} else {
				return false;
			}
		}
		return true;

		function next() {
			index++;
			if(index < len) {
				useFunArr[index](packet, next);
			}
		}
	}
	/**
	 * 同socket.io的socket.emit(event, data, fn),中间件
	 * @param {String} event
	 * @param {Object} data
	 * @param {Function} fn
	 */
	LocalSocket.prototype.emit = function(event, data, fn) {
		if(this.clientSocket) {
			let ev = this.clientSocket.getEvent(event);
			if(!ev) {
				return;
			}
			data = util.clone(data);
			let b = this.clientSocket.useFilter([event, data]);
			if(b) {
				let that = this;
				setTimeout(function() {
					if(typeof ev.callback === 'function') {
						ev.callback(data, fn);
					}
					if(ev.isOnce) {
						that.clientSocket.removeEvent(event);
					}
				}, 10);
			}
		}
	}
	LocalSocket.prototype.once = function(event, fn) {
		let e = this.on(event, fn);
		e.isOnce = true;
	}
	return LocalSocket;
})();

export default LocalSocket