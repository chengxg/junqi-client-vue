'use strict';
import BaseDialogManage from './../base/BaseDialogManage'

/**
 * 游戏对话框管理（显示或隐藏）
 */
let DialogManage = (function() {

	/**
	 * 游戏对话框管理（显示或隐藏）
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor 
	 */
	function DialogManage() {
		BaseDialogManage.call(this);
		this.menu = {
			show: false
		};
		//房间信息 对话框
		this.roomInfo = {
			show: false,
			data: null
		};
		//创建房间信息 对话框
		this.roomCreate = {
			show: false
		};
		//玩家信息 对话框
		this.playerInfo = {
			show: false,
			player: null
		};
		//规则信息
		this.ruleInfo = {
			show: false,
			ruleContent: ""
		};
		//求和对话框
		this.suePeace = {
			show: false,
			content: "",
			isRequest: false,
			isConfirm: false,
			isRequestResult: false,
			setRequest: function() {
				this.isRequest = true;
				this.isConfirm = false;
				this.isRequestResult = false;
			},
			setConfirm: function() {
				this.isRequest = false;
				this.isConfirm = true;
				this.isRequestResult = false;
			},
			setRequestResult: function() {
				this.isRequest = false;
				this.isConfirm = false;
				this.isRequestResult = true;
			}
		};
		//认输对话框
		this.giveUp = {
			show: false,
			content: ""
		};
		//登录对话框
		this.login = {
			show: false
		};
		//查询房间对话框
		this.searchRoom = {
			show: false
		};
		//个人中心对话框
		this.personalCenter = {
			show: false
		};
		//游戏结束对话框
		this.victory = {
			show: false
		};
		//游戏设置
		this.gameSetting = {
			show: false
		};
		//普通对话框
		this.dialog = {
			show: false,
			content: "",
			cancel: null,
			ok: null
		}
	}

	DialogManage.prototype = new BaseDialogManage();

	return DialogManage;
})();

export default DialogManage