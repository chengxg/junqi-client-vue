'use strict';
import { Howl, Howler } from 'howler';

import store from '@/store'

Howler.volume(1);

let howlSoundURLs = {
	back: require('@/assets/audios/back.mp3'),
	win: require('@/assets/audios/shengli.mp3'),
	lose: require('@/assets/audios/shibai.mp3'),
	ping: require('@/assets/audios/pingju.mp3'),
	select: require('@/assets/audios/xuanzeqizi.wav'),
	click: require('@/assets/audios/dianjiqizi.wav'),
	move: require('@/assets/audios/yidongqizi.wav'),
	kill: require('@/assets/audios/sharen.wav'),
	paishang: require('@/assets/audios/paishangzhadan.mp3'),
	kangshang: require('@/assets/audios/kangshangjunqi.mp3'),
	washang: require('@/assets/audios/washangdilei.mp3'),

	zha: require('@/assets/audios/zhadan.mp3'),
	lei: require('@/assets/audios/dilei.mp3'),
	xiangjiao: require('@/assets/audios/xiangjiao.mp3'),
};

var GameSound = (function() {

	let howlSounds = {};
	for(let filed in howlSoundURLs) {
		howlSounds[filed] = new Howl({
			src: [howlSoundURLs[filed]],

		});
	}

	/**
	 * 游戏声音
	 * @author chengxg
	 * @since 2017-09-01
	 * @constructor
	 */
	function GameSound() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		// 创建新的音频上下文接口
		var audioCtx = new AudioContext();
		this.audioCtx = audioCtx;
	}

	/**
	 * 选择棋子时的发声
	 */
	GameSound.prototype.selectChessSound = function() {
		var audioCtx = this.audioCtx;
		// 创建一个OscillatorNode, 它表示一个周期性波形（振荡），基本上来说创造了一个音调
		var oscillator = audioCtx.createOscillator();
		// 创建一个GainNode,它可以控制音频的总音量
		var gainNode = audioCtx.createGain();
		// 把音量，音调和终节点进行关联
		oscillator.connect(gainNode);
		// audioCtx.destination返回AudioDestinationNode对象，表示当前audio context中所有节点的最终节点，一般表示音频渲染设备
		gainNode.connect(audioCtx.destination);
		// 指定音调的类型，其他还有square|triangle|sawtooth
		oscillator.type = 'sine';
		// 设置当前播放声音的频率，也就是最终播放声音的调调
		oscillator.frequency.value = 1000;
		// 当前时间设置音量为0
		gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
		// 0.01秒后音量为1
		gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
		// 音调从当前时间开始播放
		oscillator.start(audioCtx.currentTime);
		// 1秒内声音慢慢降低，是个不错的停止声音的方法
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
		// 1秒后完全停止声音
		oscillator.stop(audioCtx.currentTime + 2);
	}

	GameSound.prototype.getBackSoundVolume = function() {
		return store.setting.backSoundSize / 100;
	}

	GameSound.prototype.getGameSoundVolume = function() {
		return store.setting.gameSoundSize / 100;
	}

	GameSound.prototype.playBackSound = function() {
		let volume = this.getBackSoundVolume();
		howlSounds.back.stop();
		howlSounds.back.volume(volume);
		if(volume > 0) {
			let soundId = howlSounds.back.play();
			howlSounds.back.volume(volume,soundId);
			howlSounds.back.loop(99999999, soundId);
		}
		
	}

	GameSound.prototype.playGameSound = function(sound) {
		let volume = this.getGameSoundVolume();
		howlSounds[sound].stop();
		if(volume > 0) {
			if(howlSounds[sound]) {
				let soundId = howlSounds[sound].play();
				howlSounds[sound].volume(volume, soundId);
			}
		}
	}

	return GameSound;
})();
var gameSound = new GameSound();

export default gameSound