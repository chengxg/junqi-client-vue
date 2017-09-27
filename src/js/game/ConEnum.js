'use strict';

/**
 * 游戏的常量枚举
 * @author chengxg
 * @since 2017-09-01
 */
function ConEnum() {
	/**
	 * 联网对战模式的后台服务器地址
	 */
	//const SERVER_URL = "http://localhost:4000/chess";
	const SERVER_URL = "https://chengxg.leanapp.cn/chess";

	/**
	 * 阵营
	 * @enum
	 */
	const CAMP = {
		blue: 1, //蓝方
		red: 2, //红方
		neutral: 0 //中立
	};

	/**
	 * 玩家登陆状态
	 * @enum
	 */
	const LOGINS_TATUS = {
		conn: 1, //已连接
		login: 2, //已登录
		disconnect: 3, //已断开
		logout: 4 //登出
	};

	/**
	 * 玩家的角色
	 * @enum
	 */
	const PLAYER_ROLE = {
		login: 1,
		visitor: 5, //访客
		player1: 2, //下棋者1
		player2: 3, //下棋者2
		looker: 4 //观战者
	};

	/**
	 * 玩家的状态
	 * @enum
	 */
	const PLAYER_STATUS = {
		undistributed: 6, //未分配
		notReady: 8, //未准备
		ready: 7, //已准备
		gameStart: 9, //已开始
		gameOver: 10, //结束

		6: "未分配",
		7: "已准备",
		8: "未准备",
		9: "游戏进行中",
		10: "游戏结束"
	};

	/**
	 * 网络链接状态
	 * @enum
	 */
	const CONNECT_STATUS = {
		connect: 1, //已连接
		disconnect: 3 //已断开
	};

	/**
	 * 房间状态
	 * @enum
	 */
	const ROOM_STATUS = {
		waitPlayer: 1,
		gameStart: 2
	};

	/**
	 * 胜负状态
	 * @enum
	 */
	const VICTORY_STATUS = {
		playing: 1, //正在玩
		lose: 2, //输
		win: 3, //胜利
		draw: 4, //平局
		redwin: 5, //红方胜利，房间的胜负
		bluewin: 6 //蓝方胜利，房间的胜负
	}

	/**
	 * 棋盘的连接图，左下角坐标：0，右上角坐标：59
	 * @enum
	 */
	const POSITION_GRAPH = new Array(60); //棋盘 图 邻接数组
	POSITION_GRAPH[0] = [5, 1];
	POSITION_GRAPH[1] = [6, 2, 0];
	POSITION_GRAPH[2] = [7, 3, 1];
	POSITION_GRAPH[3] = [8, 4, 2];
	POSITION_GRAPH[4] = [9, 3];

	POSITION_GRAPH[5] = [10, 11, 6, 0];
	POSITION_GRAPH[6] = [11, 7, 1, 5];
	POSITION_GRAPH[7] = [12, 13, 8, 2, 6, 11];
	POSITION_GRAPH[8] = [13, 9, 3, 7];
	POSITION_GRAPH[9] = [14, 4, 8, 13];

	POSITION_GRAPH[10] = [15, 11, 5];
	POSITION_GRAPH[11] = [16, 17, 12, 7, 6, 5, 10, 15];
	POSITION_GRAPH[12] = [17, 13, 7, 11];
	POSITION_GRAPH[13] = [18, 19, 14, 9, 8, 7, 12, 17];
	POSITION_GRAPH[14] = [19, 9, 13];

	POSITION_GRAPH[15] = [20, 21, 16, 11, 10];
	POSITION_GRAPH[16] = [21, 17, 11, 15];
	POSITION_GRAPH[17] = [22, 23, 18, 13, 12, 11, 16, 21];
	POSITION_GRAPH[18] = [23, 19, 13, 17];
	POSITION_GRAPH[19] = [24, 14, 13, 18, 23];

	POSITION_GRAPH[20] = [25, 21, 15];
	POSITION_GRAPH[21] = [26, 27, 22, 17, 16, 15, 20, 25];
	POSITION_GRAPH[22] = [27, 23, 17, 21];
	POSITION_GRAPH[23] = [28, 29, 24, 19, 18, 17, 22, 27];
	POSITION_GRAPH[24] = [29, 19, 23];

	POSITION_GRAPH[25] = [30, 26, 21, 20];
	POSITION_GRAPH[26] = [27, 21, 25];
	POSITION_GRAPH[27] = [32, 28, 23, 22, 21, 26];
	POSITION_GRAPH[28] = [29, 23, 27];
	POSITION_GRAPH[29] = [34, 24, 23, 28];

	POSITION_GRAPH[30] = [35, 36, 31, 25];
	POSITION_GRAPH[31] = [36, 32, 30];
	POSITION_GRAPH[32] = [37, 38, 33, 27, 31, 36];
	POSITION_GRAPH[33] = [38, 34, 32];
	POSITION_GRAPH[34] = [39, 29, 33, 38];

	POSITION_GRAPH[35] = [40, 36, 30];
	POSITION_GRAPH[36] = [41, 42, 37, 32, 31, 30, 35, 40];
	POSITION_GRAPH[37] = [42, 38, 32, 36];
	POSITION_GRAPH[38] = [43, 44, 39, 34, 33, 32, 37, 42];
	POSITION_GRAPH[39] = [44, 34, 38];

	POSITION_GRAPH[40] = [45, 46, 41, 36, 35];
	POSITION_GRAPH[41] = [46, 42, 36, 40];
	POSITION_GRAPH[42] = [47, 48, 43, 38, 37, 36, 41, 46];
	POSITION_GRAPH[43] = [48, 44, 38, 42];
	POSITION_GRAPH[44] = [49, 39, 38, 43, 48];

	POSITION_GRAPH[45] = [50, 46, 40];
	POSITION_GRAPH[46] = [51, 52, 47, 42, 41, 40, 45, 50];
	POSITION_GRAPH[47] = [52, 48, 42, 46];
	POSITION_GRAPH[48] = [53, 54, 49, 44, 43, 42, 47, 52];
	POSITION_GRAPH[49] = [54, 44, 48];

	POSITION_GRAPH[50] = [55, 51, 46, 45];
	POSITION_GRAPH[51] = [56, 52, 46, 50];
	POSITION_GRAPH[52] = [57, 53, 48, 47, 46, 51];
	POSITION_GRAPH[53] = [58, 54, 48, 52];
	POSITION_GRAPH[54] = [59, 49, 48, 53];

	POSITION_GRAPH[55] = [56, 50];
	POSITION_GRAPH[56] = [57, 51, 55];
	POSITION_GRAPH[57] = [58, 52, 56];
	POSITION_GRAPH[58] = [59, 53, 57];
	POSITION_GRAPH[59] = [54, 58];

	/**
	 * 棋盘上 行营的 位置
	 * @enum
	 */
	const XINGYING_POSITION = [11, 13, 17, 21, 23, 36, 38, 42, 46, 48];

	/**
	 * 棋子的移动类型
	 * @enum
	 */
	const MOVE_TYPE = {
		unable: 0, //不能移动
		oneStep: 1, //每次移动一步
		line: 2, //铁路线的直线
		curve: 3 //铁路线的弯道
	}

	/**
	 * 杀子类型
	 * @enum
	 */
	const KILL_TYPE = {
		kill: 0, //杀
		die: 1, //敢死
		bomb: 2, //炸
		capture: 3 //捕获
	}
	
	/**
	 * 游戏动画实现类型
	 * @enum
	 */
	const ANIMATION_TYPE = {
		css : "css",
		js : "js"
	}

	/**
	 * 得到相反的阵营
	 * @param {Object} camp
	 * @return {Number} 
	 */
	function getOppositeCamp(camp) {
		if(camp != CAMP.neutral) {
			if(camp == CAMP.blue) {
				return CAMP.red;
			} else {
				return CAMP.blue;
			}
		}
		return CAMP.neutral;
	}

	/**
	 * 判断两个位置是否相邻
	 * @param {int} souLoc 开始位置
	 * @param {int} tarLoc 结束位置
	 * @return {Boolean}
	 */
	function isNextPosition(souLoc, tarLoc) {
		var nextPositionList = POSITION_GRAPH[souLoc];
		var index = nextPositionList.indexOf(tarLoc);
		if(index != -1) {
			return true;
		} else {
			return false;
		}
	}

	const obj = new Object();
	obj.SERVER_URL = SERVER_URL;
	obj.CAMP = CAMP;
	obj.LOGINS_TATUS = LOGINS_TATUS;
	obj.PLAYER_ROLE = PLAYER_ROLE;
	obj.PLAYER_STATUS = PLAYER_STATUS;
	obj.CONNECT_STATUS = CONNECT_STATUS;
	obj.VICTORY_STATUS = VICTORY_STATUS;
	obj.ROOM_STATUS = ROOM_STATUS;
	obj.POSITION_GRAPH = POSITION_GRAPH;
	obj.MOVE_TYPE = MOVE_TYPE;
	obj.KILL_TYPE = KILL_TYPE;
	obj.XINGYING_POSITION = XINGYING_POSITION;
	obj.ANIMATION_TYPE = ANIMATION_TYPE;
	obj.isNextPosition = isNextPosition;
	obj.getOppositeCamp = getOppositeCamp;

	return obj;
}
const CON = ConEnum();

export default CON