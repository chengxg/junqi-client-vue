'use strict';

var MessageCenter = (function() {
	/**
	 * 消息中心
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function MessageCenter() {
		this.toastQueue = [];
		this.tipMsgArr = [];
		this.errMsgArr = [];
	}

	/**
	 * 添加提示信息
	 * @param {String} message
	 * @param {Number} duration
	 */
	MessageCenter.prototype.addTipMsg = function(message, duration = 2000) {
		let obj = {
			message
		};
		this.tipMsgArr.push(obj);
		let that = this;
		setTimeout(function() {
			//删除
			let index = that.tipMsgArr.indexOf(obj);
			if(index > -1) {
				that.tipMsgArr.splice(index, 1);
			}
		}, duration);
	}

	/**
	 * 添加错误信息
	 * @param {String} errName
	 * @param {String} errDetail
	 * @param {Number} duration
	 */
	MessageCenter.prototype.addErrMsg = function(errName, errDetail, duration = 5000) {
		let obj = {
			errName,
			errDetail
		};
		this.errMsgArr.push(obj);
		let that = this;
		setTimeout(function() {
			//删除
			let index = that.errMsgArr.indexOf(obj);
			if(index > -1) {
				that.errMsgArr.splice(index, 1);
			}
		}, duration);
	}

	/**
	 * 添加错误信息
	 * @param {String} errName 错误名称
	 * @param {String} errDetail 错误详情
	 * @param {Number} duration 持续时间
	 */
	MessageCenter.prototype.addErrMsgArr = function(errMsgArr, duration = 5000) {
		let that = this;
		if(errMsgArr && Array.isArray(errMsgArr)) {
			errMsgArr.forEach(function(item) {
				if(item) {
					that.addErrMsg(item.errName, item.errDetail, duration);
				}
			});
		}
	}

	return MessageCenter;
})();

export default MessageCenter