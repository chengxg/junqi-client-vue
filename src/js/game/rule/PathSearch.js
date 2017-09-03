var pathSearchObj = pathSearch();

/**
 * 路径搜索
 * @author chengxg
 * @since 2017-09-01
 */
function pathSearch() {
	let edges = []; //邻接矩阵，棋盘铁路线的图

	edges.push([0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //0
	edges.push([1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //1
	edges.push([0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //2
	edges.push([0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //3
	edges.push([0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //4
	edges.push([1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //5
	edges.push([0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //6
	edges.push([0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //7
	edges.push([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //8
	edges.push([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //9
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //10
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //11
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //12
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //13
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //14
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //15

	//edges.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]);
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //16
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //17
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //18
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //19
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]); //20
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]); //21
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]); //22
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]); //23
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]); //24
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0]); //25
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]); //26
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0]); //27
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0]); //28
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0]); //29
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]); //30
	edges.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0]); //31

	let vertexList = [5, 6, 7, 8, 9, 10, 14, 15, 19, 20, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 39, 40, 44, 45, 49, 50, 51, 52, 53, 54]; //存储点的链表
	let numOfVertex = vertexList.length; //节点的个数
	let chessList = new Array(numOfVertex);
	let numOfEdges = 35; //边的数目
	let path = [];
	let startVertex = -1,
		endVertex = -1;

	//得到第一个邻接结点的下标
	function getFirstNeighbor(index) {
		for(let j = 0; j < numOfVertex; j++) {
			if(edges[index][j] > 0) {
				return j;
			}
		}
		return -1;
	}
	//根据前一个邻接结点的下标来取得下一个邻接结点
	function getNextNeighbor(v1, v2) {
		for(let j = v2 + 1; j < numOfVertex; j++) {
			if(edges[v1][j] > 0) {
				return j;
			}
		}
		return -1;
	}
	//私有函数，深度优先遍历
	function privateDepthFirstSearch(isVisited, i) {
		//置该结点为已访问
		isVisited[i] = true;

		let w = getFirstNeighbor(i); //
		while(w != -1) {
			if(w == endVertex) {
				return true;
			}
			if(!isVisited[w] && chessList[w] == 0) {
				if(privateDepthFirstSearch(isVisited, w)) {
					path.push(w);
					return true;
				}
			}
			w = getNextNeighbor(i, w);
		}
		return false;
	}

	/**
	 * 曲线路径 搜索
	 * @param {Array} chessboard
	 * @param {int} startLoc
	 * @param {int} endLoc
	 */
	function curvePath(chessboard, startLoc, endLoc) {
		let result = {};
		let isVisited = new Array(numOfVertex);
		path = [];
		//记录结点是否已经被访问的数组
		for(var i = 0; i < numOfVertex; i++) {
			isVisited[i] = false; //把所有节点设置为未访问
			chessList[i] = chessboard[vertexList[i]][0];
		}

		startVertex = vertexList.indexOf(startLoc);
		endVertex = vertexList.indexOf(endLoc);
		if(startVertex === -1 || endVertex === -1) {
			result.isMove = false;
			result.path = [];
			return result;
		}
		chessList[startVertex] = 1;
		chessList[endVertex] = 1;

		path.push(endVertex);
		result.isMove = privateDepthFirstSearch(isVisited, startVertex);
		path.push(startVertex);
		for(let i = 0; i < path.length; i++) {
			path[i] = vertexList[path[i]];
		}
		path.reverse();
		result.path = path;
		return result;
	}

	/**
	 * 直线路径 搜索
	 * @param {Array} chessboard
	 * @param {int} startLoc
	 * @param {int} endLoc
	 */
	function linePath(chessboard, startLoc, endLoc) {
		let sx = parseInt(startLoc % 5);
		let sy = parseInt(startLoc / 5);
		let tx = parseInt(endLoc % 5);
		let ty = parseInt(endLoc / 5);
		let i = 0,
			path = [],
			isMove = false;
		path.push(sy * 5 + sx); //将开始位置放入path

		if(sx == tx && (sx == 0 || sx == 4)) {
			if(sy >= ty) {
				for(i = sy - 1; i > ty; i--) {
					if(chessboard[i * 5 + sx][0] == 0) {
						path.push(i * 5 + sx);
						isMove = true;
					} else {
						isMove = false;
						break;
					}
				}
			} else {
				for(i = sy + 1; i < ty; i++) {
					if(chessboard[i * 5 + sx][0] == 0) {
						path.push(i * 5 + sx);
						isMove = true;
					} else {
						isMove = false;
						break;
					}
				}
			}
		}

		if(sy == ty && (sy == 1 || sy == 5 || sy == 6 || sy == 10)) {
			if(sx >= tx) {
				for(i = sx - 1; i > tx; i--) {
					if(chessboard[sy * 5 + i][0] == 0) {
						path.push(sy * 5 + i);
						isMove = true;
					} else {
						isMove = false;
						break;
					}
				}
			} else {
				for(i = sx + 1; i < tx; i++) {
					if(chessboard[sy * 5 + i][0] == 0) {
						path.push(sy * 5 + i);
						isMove = true;
					} else {
						isMove = false;
						break;
					}
				}
			}
		}

		if((sx == tx && sx == 2) && ((sy == 5 && ty == 6) || (sy == 6 && ty == 5))) {
			isMove = true;
		}
		path.push(ty * 5 + tx); //结束位置

		return {
			isMove: isMove,
			path: path
		};
	}

	return {
		curvePath: curvePath,
		linePath: linePath
	}
}

export default pathSearchObj