'use strict';
import CBP from './../ChessboardPara'
import CON from './../ConEnum'
import DialogManage from './DialogManage'
import BaseMainScene from './../base/BaseMainScene'

/**
 * 游戏场景数据类  存储游戏场景中的数据
 * @author chengxg
 * @since 2017-09-01
 * @param {Mediator} mediator 中介者
 */
function MainScene(mediator, dialogManage) {
	BaseMainScene.call(this, mediator, dialogManage);
}

MainScene.prototype = new BaseMainScene();

export default MainScene