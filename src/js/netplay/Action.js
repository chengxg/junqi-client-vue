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

	return Action;
})();

export default Action;