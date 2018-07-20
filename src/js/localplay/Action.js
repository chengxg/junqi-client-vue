import CON from './../ConEnum'
import Player from './../base/Player'
import BaseAction from './../base/BaseAction'

let Action = (function() {

	/**
	 * 与服务器交互的action类
	 * @author chengxg
	 * @since 2017-09-01
	 * @param {Mediator} mediator
	 */
	function Action(mediator) {
		BaseAction.call(this, mediator);
	}

	Action.prototype = new BaseAction();

	/**
	 * 登录
	 * @param {Object} data
	 * @param {Function} callback
	 */
	Action.prototype.login = function(data, callback) {
		let mediator = this.mediator;
		this.emit({
			isShowSpinner: true,
			event: "login",
			data: data,
			success: function(ret) {
				if(ret["success"]) {
					let playerName = data["userName"];
					let player = new Player(mediator);
					player.name = playerName;
					player.userInfo = ret["userInfo"];
					player.logindUser = ret["logindUser"];
					player.socket = mediator.socket;
					mediator.player = player;
				}
				if(callback) {
					callback(ret);
				}
			}
		});
	};

	return Action;
})();

export default Action;