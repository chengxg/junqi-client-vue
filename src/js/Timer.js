'use strict';
/**
 * 定时器类
 * @author chengxg
 * @since 2017-09-01
 * @constructor
 * @param {String} name
 * @param {Boolean} isCache 可选，用于缓存该定时器
 */
function Timer(name, isCache = false) {
	this.name = name || ""; //定时器的名称

	this.timerId = 0;
	this.isPause = false; //是否暂停执行
	this.isPauseCount = false; //暂停后是否仍在计数

	this.currentCount = 0; //当前计数
	this.repeatCount = 1; //重复次数
	this.intervalTime = 0; //计时间隔时间，ms
	this.delayTime = 0; //定时器延时时间，ms
	this.timingStartFun = null; //定时器开始执行时的回调
	this.timingFun = null; //计时过程中的回调
	this.timingEndFun = null; //计时结束后的回调

	if(isCache) {
		Timer.timerArr.push(this);
	}
}
Timer.timerArr = [];

/**
 * 初始化定时器
 * @param {Object} obj 初始化对象
 * @return {Timer} 链试调用
 */
Timer.prototype.init = function(obj) {
	for(let filed in obj) {
		if(filed in this) {
			this[filed] = obj[filed];
		}
	}
	return this;
}

/**
 * 计时开始
 * @return {Timer} 链试调用
 */
Timer.prototype.start = function() {
	var that = this;
	this.clear();

	if(that.repeatCount > 1) {
		if(this.delayTime > 0) {
			this.timerId = setTimeout(function() {
				executeInterval();
			}, this.delayTime);
		} else {
			executeInterval();
		}
	} else {
		this.timerId = setTimeout(function() {
			that.executeFun();
		}, this.delayTime);
	}

	function executeInterval() {
		that.executeStartFun();
		that.timerId = setInterval(function() {
			if(!that.isPause) {
				that.executeFun();
			}

			if(!(that.isPauseCount && that.isPause)) {
				that.currentCount++;
			}
			if(that.currentCount >= that.repeatCount) {
				that.clear();
				that.executeEndFun();
			}
		}, that.intervalTime);
	}

	return this;
}

/**
 * 通过定时器名获取到定时器
 * @param {String} name
 * @return {Timer}
 */
Timer.getTimerByName = function(name) {
	var timer = null;
	Timer.timer.every(function(item, i) {
		if(item && item.name === name) {
			timer = item;
			return false
		}
		return true
	});
	return timer;
}

/**
 * 清空定时器
 * @return {Timer}
 */
Timer.prototype.clear = function() {
	if(this.timerId) {
		if(this.repeatCount > 1) {
			clearInterval(this.timerId);
		} else {
			clearTimeout(this.timerId);
		}
		this.timerId = 0;
	}
	this.currentCount = 0;
	return this;
}

/**
 * 取消定时器
 * @return {Timer}
 */
Timer.prototype.cancel = function() {
	var that = this;
	this.clear();
	Timer.timerArr.every(function(timer, i) {
		if(timer === that) {
			Timer.timerArr.splice(i, 1);
			return false
		}
		return true
	});
	return this;
}

/**
 * 停止计时
 * @return {TImer}
 */
Timer.prototype.pauseTiming = function() {
	this.isPause = true;
	return this;
}

/**
 * 恢复计时
 * @return {TImer}
 */
Timer.prototype.continueTiming = function() {
	this.isPause = false;
	return this;
}

/**
 * 定时器执行开始
 * @private
 */
Timer.prototype.executeStartFun = function() {
	if(this.timingStartFun) {
		this.timingStartFun();
	}
}

/**
 * 定时中的回调
 * @private
 */
Timer.prototype.executeFun = function() {
	if(this.timingFun) {
		this.timingFun();
	}
}

/**
 * 定时完成的回调
 * @private
 */
Timer.prototype.executeEndFun = function() {
	if(this.timingEndFun) {
		this.timingEndFun();
	}
}

export default Timer;