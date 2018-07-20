'use strict';

let meisenRandom = (function meisen() {
	let isInit = 0;
	let index;
	let MT = new Array(624); //624 * 32 - 31 = 19937

	function srand(seed) {
		index = 0;
		isInit = 1;
		MT[0] = seed;
		//对数组的其它元素进行初始化
		for(let i = 1; i < 624; i++) {
			let t = 1812433253 * (MT[i - 1] ^ (MT[i - 1] >> 30)) + i;
			MT[i] = t & 0xffffffff; //取最后的32位赋给MT[i]
		}
	}

	function generate() {
		for(let i = 0; i < 624; i++) {
			// 2^31 = 0x80000000
			// 2^31-1 = 0x7fffffff
			let y = (MT[i] & 0x80000000) + (MT[(i + 1) % 624] & 0x7fffffff);
			MT[i] = MT[(i + 397) % 624] ^ (y >> 1);
			if(y & 1) {
				MT[i] ^= 2567483615;
			}
		}
	}

	function rand() {
		if(!isInit) {
			srand(new Date().getTime());
		}

		if(index == 0) {
			generate();
		}

		let y = MT[index];
		y = y ^ (y >> 11); //y右移11个bit
		y = y ^ ((y << 7) & 2636928640); //y左移7个bit与2636928640相与，再与y进行异或
		y = y ^ ((y << 15) & 4022730752); //y左移15个bit与4022730752相与，再与y进行异或
		y = y ^ (y >> 18); //y右移18个bit再与y进行异或
		index = (index + 1) % 624;
		return y;
	}
	return {
		srand: srand,
		rand: rand
	};
})();
let util = (function() {
	var obj = new Object();
	var obj = new Object();
	obj.isType = isType;
	obj.isObject = isObject;
	obj.isArray = isArray;
	obj.isFunction = isFunction;
	
	obj.clone = clone;
	obj.extend = extend;
	obj.meisenRandom = meisenRandom;
	obj.shuffle = shuffle;
	obj.shuffleMeisen = shuffleMeisen;
	obj.getObjFromArrByFiled = getObjFromArrByFiled;
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
						dest[key] = extend(isObject(dest[key]) ? dest[key] : {}, src[key]);
					} else if(isArray(src[key])) {
						dest[key] = extend(isArray(dest[key]) ? dest[key] : [], src[key]);
					} else {
						dest[key] = src[key];
					}
				}
			}
		} else if(isArray(dest) && isArray(src)) {
			for(var i = 0, len = src.length; i < len; i++) {
				if(isObject(src[i])) {
					dest.push(extend({}, src[i]));
				} else if(isArray(src[i])) {
					dest.push(extend([], src[i]));
				} else {
					dest.push(src[i]);
				}
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

	/**
	 * 根据对象的字段值从数组中查询这个对象
	 * @param {Array} arr
	 * @param {String} filed
	 * @param {Object} filedVal
	 */
	function getObjFromArrByFiled(arr, filed, filedVal) {
		let len = arr.length,
			temp = null;
		for(let i = 0; i < len; i++) {
			temp = arr[i];
			if(temp[filed] === filedVal) {
				return temp;
			}
		}
		return null;
	}

	/**
	 * 经典的洗牌算法
	 * @param {Array} arr
	 */
	function shuffle(arr) {
		let len = arr.length;
		for(let i = 0; i < len - 1; i++) {
			let idx = Math.floor(Math.random() * (len - i));
			let temp = arr[idx];
			arr[idx] = arr[len - i - 1];
			arr[len - i - 1] = temp;
		}
		return arr;
	}

	/**
	 * 经典的洗牌算法
	 * @param {Array} arr
	 */
	function shuffleMeisen(arr) {
		meisenRandom.srand(Math.round(Math.random() * (new Date().getTime())));
		let len = arr.length;
		for(let i = 0; i < len - 1; i++) {
			let r = meisenRandom.rand();
			let idx = r % len;
			let temp = arr[idx];
			arr[idx] = arr[len - i - 1];
			arr[len - i - 1] = temp;
		}
		return arr;
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