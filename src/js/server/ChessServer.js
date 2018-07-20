'use strict';
import Player from './ChessPlayer'
import Room from './ChessRoom'

var ChessServer = (function() {
	/**
	 * 工兵抗军旗的服务器
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function ChessServer() {
		this.io = null; //socket.io
		this.roomArr = []; //存放所有的房间
		this.playerArr = []; //存放所有的玩家

		this.roomId = 0; //生成的房间编号
	}
	/**
	 * 初始化socke.io
	 * @param {Object} io
	 */
	ChessServer.prototype.initIO = function(socket) {
		let that = this;

		socket.on('login', function(data,fn) {
			let name = data["n"];
			var player = that.getPlayerByName(name);
			if(!player) {
				player = new Player();
				player.name = name;
				that.playerArr.push(player);
			}
			player.socket = socket;
			socket.player = player;
			player.login();
			fn&&fn();
		});
		
		socket.on('createRoom', function(data,fn) {
			let player = socket.player;
			that.leaveRoom(player);
			let room = that.createRoom();
			if(data["rule"]) {
				room.setRoomRule(data["rule"]);
			}
			room.distributePlayer(player);
			if(fn) {
				fn({
					success: true
				});
			}
		});
		
		socket.on('enterRoom', function(data) {
			that.leaveRoom(socket.player);
			if(data && data["rid"]) {
				let room = that.getRoomById(data["rid"]);
				if(room) {
					if(room.isFriendRoom) {
						if(room.roomPwd && room.roomPwd === data["rpwd"]) {
							room.distributePlayer(socket.player);
						}
					}
				}
			} else {
				that.distributeRoom(socket.player);
			}
		});
		socket.on('leaveRoom', function(data) {
			that.leaveRoom(socket.player);
		});
		socket.on('ready', function(data) {
			var player = socket.player;
			player.ready();
		});
		socket.on('notReady', function(data) {
			var player = socket.player;
			player.notReady();
		});
		socket.on('overChess', function(data) {
			var player = socket.player;
			player.overChess(data.l);
		});
		socket.on('moveChess', function(data) {
			var player = socket.player;
			player.moveChess(data);
		});
		socket.on('giveUp', function(data) {
			var player = socket.player;
			player.giveUp();
		});
		socket.on('suePeace', function(data) {
			var player = socket.player;
			player.suePeace(data["iss"], data["isr"]);
		});

	}

	/**
	 * 通过玩家名称得到该玩家对象
	 * @param {String} playerName
	 * @return {ChessPlayer}
	 */
	ChessServer.prototype.getPlayerByName = function(playerName) {
		let playerArr = this.playerArr;
		let len = playerArr.length;
		let player = null;
		let tempPlayer = null;

		for(let i = 0; i < len; i++) {
			tempPlayer = playerArr[i];
			if(tempPlayer.name == playerName) {
				player = tempPlayer;
				break;
			}
		}
		return player;
	}

	/**
	 * 删除玩家
	 * @param {ChessPlayer} player
	 */
	ChessServer.prototype.deletePlayer = function(player) {
		if(!player) {
			return;
		}
		player.destroy();
		let index = this.playerArr.indexOf(player);
		if(index !== -1) {
			this.playerArr.splice(index, 1);
		}
	}

	/**
	 * 创建玩家
	 * @param {String} palyerName
	 * @return {ChessPlayer} player
	 */
	ChessServer.prototype.createPlayer = function(playerName) {
		return new Player(playerName);
	}

	/**
	 * 删除房间
	 * @param {ChessRoom} room
	 * @return {Boolean} 是否成功删除
	 */
	ChessServer.prototype.deleteRoom = function(room) {
		if(!room) {
			return false;
		}
		return this.deleteRoomById(room.id);
	}

	/**
	 * 通过房间的id删除房间
	 * @param {Number} roomId
	 * @return {Boolean} 是否成功删除
	 */
	ChessServer.prototype.deleteRoomById = function(roomId) {
		let rooms = this.roomArr;
		let len = rooms.length;

		let low = 0,
			mid,
			high = len - 1;
		/**
		 * 二分查找法
		 */
		while(low <= high) {
			mid = Math.floor((low + high) / 2);
			if(rooms[mid].id < roomId) {
				low = mid + 1;
			} else if(rooms[mid].id > roomId) {
				high = mid - 1;
			} else {
				rooms.splice(mid, 1);
				return true;
			}
		}
		return false;
	}

	/**
	 * 通过房间id得到该房间对象
	 * @param {Number} roomId
	 * @return {ChessRoom}
	 */
	ChessServer.prototype.getRoomById = function(roomId) {
		let rooms = this.roomArr;
		let len = rooms.length;
		let room = null;

		let low = 0,
			mid,
			high = len - 1;
		while(low <= high) {
			mid = Math.floor((low + high) / 2);
			if(rooms[mid].id < roomId) {
				low = mid + 1;
			} else if(rooms[mid].id > roomId) {
				high = mid - 1;
			} else {
				room = rooms[mid];
				break;
			}
		}
		return room;
	}

	/**
	 * 通过房间id得到 该房间在房间数组中的索引
	 * @param {String} roomId
	 * @return {Number}
	 */
	ChessServer.prototype.getRoomIndexById = function(roomId) {
		let rooms = this.roomArr;
		let len = rooms.length;
		let index = 0;

		let low = 0,
			mid,
			high = len - 1;
		while(low <= high) {
			mid = Math.floor((low + high) / 2);
			if(rooms[mid].id < roomId) {
				low = mid + 1;
			} else if(rooms[mid].id > roomId) {
				high = mid - 1;
			} else {
				index = mid;
				break;
			}
		}
		return index;
	}

	/**
	 * 服务器分配玩家到房间
	 * @param {ChessPlayer} player
	 */
	ChessServer.prototype.distributeRoom = function(player) {
		let rooms = this.roomArr;
		let len = rooms.length;
		let room = null;
		let lastRoomId = player.lastRoomId;
		let isMatch = false; //是否已经分到房间

		for(let i = 0; i < len; i++) {
			room = rooms[i];
			if(room.id > lastRoomId) {
				isMatch = room.distributePlayer(player);
				if(isMatch) {
					break;
				}
			}
		}
		if(!isMatch) {
			for(let i = 0; i < len; i++) {
				room = rooms[i];
				if(room.id < lastRoomId) {
					isMatch = room.distributePlayer(player);
					if(isMatch) {
						break;
					}
				}
			}
		}

		if(!isMatch) {
			room = this.createRoom();
			room.distributePlayer(player);
		}
	}

	/**
	 * 创建一个房间
	 * @return {ChessRoom}
	 */
	ChessServer.prototype.createRoom = function() {
		this.roomId++;
		let room = new Room(this.roomId, this);
		this.roomArr.push(room);
		return room;
	}

	/**
	 * 玩家离开房间
	 * @param {ChessPlayer} player
	 */
	ChessServer.prototype.leaveRoom = function(player) {
		if(!player) {
			return;
		}
		let room = player.room;
		if(!room) {
			return;
		}
		room.playerLeaveRoom(player);
		this.allPlayerLeaveRoom(room);
	}

	/**
	 * 所有玩家离开房间后,删除房间
	 * @param {ChessRoom} room
	 */
	ChessServer.prototype.allPlayerLeaveRoom = function(room) {
		//都离开后删除该房间
		if(room.player1 == null && room.player2 == null) {
			this.deleteRoom(room);
		}
	}

	return ChessServer;
})();

export default ChessServer;