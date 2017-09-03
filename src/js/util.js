var util = (function() {
	var obj = new Object();
	obj.clone = clone;
	obj.extend = extend;
	obj.sumArray = sumArray;
	obj.isArray = isArray;
	obj.toggleValOfArray = toggleValOfArray;
	obj.delArrSameVal = delArrSameVal;
	obj.formatDate = formatDate;
	return obj;

	function isType(val) {
		return Object.prototype.toString.call(val).slice(8, -1);
	}

	function isObject(val) {
		return isType(val) === 'Object';
	}

	function isArray(val) {
		return isType(val) === 'Array';
	}

	function isFunction(val) {
		return isType(val) === 'Function';
	}

	/**
	 * 继承
	 * @param {Object} dest
	 * @param {Object} src
	 * @return {Object}
	 */
	function extend(dest, src) {
		if(isObject(dest) || isFunction(dest) && isObject(src)) {
			for(var key in src) {
				if(src.hasOwnProperty(key)) {
					if(isObject(src[key])) {
						dest[key] = extend({}, src[key]);
					} else if(isArray(src[key])) {
						dest[key] = extend([], src[key]);
					} else {
						dest[key] = src[key];
					}
				}
			}
		} else if(isArray(dest) && isArray(src)) {
			for(var i = 0, len = src.length; i < len; i++) {
				dest.push(src[i]);
			}
		}
		return dest;
	}

	/**
	 * 深度克隆
	 * @param {Object} obj
	 * @return {Object}
	 */
	function clone(obj) {
		if(isObject(obj)) {
			return extend({}, obj);
		} else if(isArray(obj)) {
			return extend([], obj);
		} else {
			return obj;
		}
	}

	function sumArray(arr) {
		var sum = 0;
		if(isArray(arr)) {
			for(var i = 0; i < arr.length; i++) {
				sum = sum + arr[i];
			}
		}
		return sum;
	}

	function toggleValOfArray(arr, val) {
		var no = arr.indexOf(val);
		if(no == -1) {
			arr.push(val);
		} else {
			arr.splice(no, 1);
		}
	}

	/**
	 * 从一个数组中删除值
	 * @param {Array,string,number} srcArr
	 * @param {Array} valueArr
	 */
	function delArrSameVal(srcArr, valueArr) {
		if(!isArray(valueArr)) {
			valueArr = [valueArr];
		}
		let i = 0,
			valueLen = valueArr.length,
			j = 0,
			srcLen = srcArr.length;
		for(i = 0; i < valueLen; i++) {
			for(j = 0; j < srcLen; j++) {
				if(srcArr[j] === valueArr[i]) {
					srcArr.splice(j, 1);
				}
			}
		}
	}

	/**
	 * 从一个数组中删除一个值
	 * @param {Array,string,number} srcArr
	 * @param {Array} valueArr
	 */
	function delOneSameVal(srcArr, valueArr) {
		let i = 0,
			j = 0,
			srcArrLen = srcArr.length,
			valueLen = valueArr.length;
		for(i = 0; i < valueArr.length; i++) {
			for(j = 0; j < srcArr.length; j++) {
				if(srcArr[j] === valueArr[i]) {
					srcArr.splice(j, 1);
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * 日期格式化
	 * @param {Date} date
	 * @param {String} fmt
	 */
	function formatDate(date, fmt) {
		var o = {
			"M+": date.getMonth() + 1, //月份 
			"d+": date.getDate(), //日 
			"h+": date.getHours(), //小时 
			"m+": date.getMinutes(), //分 
			"s+": date.getSeconds(), //秒 
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度 
			"S": date.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for(var k in o) {
			if(new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}

})();

export default util