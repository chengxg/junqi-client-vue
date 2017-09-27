/**
 * 浏览器兼容性
 */
var BrowseCompatibility = (function() {
	let obj = {
		"transitionEndEvent": "transitionend",
		"animationEndEvent": "animationend",
		"prefixCss3Animation": getPrefixCss3Animation(),
		"addCSSRule": addCSSRule
	};

	whichTransitionAndAnimationEvent();

	/**
	 * 得到css3动画结束的兼容性事件
	 */
	function whichTransitionAndAnimationEvent() {
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		}
		var animations = {
			'animation': 'animationend',
			'OAnimation': 'oAnimationEnd',
			'MozAnimation': 'animationend',
			'WebkitAnimation': 'webkitAnimationEnd'
		}
		for(t in transitions) {
			if(el.style[t] !== undefined) {
				obj.transitionEvent = transitions[t];
				break;
			}
		}
		for(t in animations) {
			if(el.style[t] !== undefined) {
				obj.animationEvent = animations[t];
				break;
			}
		}
	}

	/**
	 * 得到动画兼容性的css前缀
	 * @return {String} 前缀
	 */
	function getPrefixCss3Animation() {
		var testAnimation = document.createElement('fakeelement').style;
		let prefixAnimation = "";
		//检测css3动画兼容性
		if(typeof testAnimation.animation != "undefined") {

		} else {
			if(typeof testAnimation.WebkitAnimation != "undefined") {
				prefixAnimation = "-webkit-";
			}
		}
		return prefixAnimation;
	}

	/**
	 * 添加css规则
	 * @param {Object} sheet css样式表
	 * @param {String} selector css
	 * @param {String} rules css规则
	 * @param {Number} index
	 */
	function addCSSRule(sheet, selector, rules, index) {
		if("insertRule" in sheet) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		} else if("addRule" in sheet) {
			sheet.addRule(selector, rules, index);
		}
	}

	return obj
}());

export default BrowseCompatibility