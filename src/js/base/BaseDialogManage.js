'use strict';

/**
 * 游戏对话框管理（显示或隐藏）
 */
let BaseDialogManage = (function() {

	/**
	 * 游戏对话框管理（显示或隐藏）
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor 
	 */
	function BaseDialogManage() {
		
	}

	/**
	 * 隐藏所有的对话框
	 */
	BaseDialogManage.prototype.closeAllDialog = function() {
		for(let filed in this) {
			let dialog = this[filed];
			if(typeof dialog === 'object') {
				if(typeof dialog["show"] === 'boolean') {
					dialog["show"] = false;
				}
			}
		}

	}

	return BaseDialogManage;
})();

export default BaseDialogManage