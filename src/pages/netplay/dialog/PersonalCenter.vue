<style>
	.thumb_wrp {
		position: relative;
		width: 100px;
		height: 100px;
	}
	
	.photo_input_wrp {
		position: relative;
		width: 100%;
		height: 100%;
		opacity: 0.5;
		border: 1px solid gray;
	}
	
	.photo_input_wrp:active {
		opacity: 1;
	}
	
	.photo_input_hline {
		width: 50%;
		height: 2px;
		top: 50%;
		left: 25%;
	}
	
	.photo_input_vline {
		width: 2px;
		height: 50%;
		top: 25%;
		left: 50%;
	}
	
	.photo_input_hline,
	.photo_input_vline {
		position: absolute;
		background-color: #C7C7C6;
	}
	
	.photo_input {
		position: absolute;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	
	.thumb_img {
		position: absolute;
		border: 1px solid black;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background-color: white;
	}
	
	.del_img_btn {
		position: absolute;
		width: 25px;
		height: 25px;
		line-height: 25px;
		top: 0;
		left: 100%;
		transform: translate(-50%, -50%);
		z-index: 1;
		color: blue;
		text-align: center;
		font-size: 18px;
		padding: 0;
		margin: 0;
		font-weight: bold;
		border: 1px solid gray;
		border-radius: 50%;
		background: blue;
		color: white;
		opacity: 0.8;
	}
	
	.my-navbar {
		list-style: none;
		padding: 0;
		margin: 0;
		display: table;
		width: 100%;
	}
	
	.my-navbar li {
		padding: 1px;
		display: table-cell;
	}
	
	.my-navbar li a {
		width: 100%;
	}
</style>

<template>
	<MyDialog :isClickMaskClose="true" :beforeClose="closeModel">
		<h4 slot="header" style="">个人中心</h4>
		<div class="w3-row" style="padding: 5px 5px;">
			<div class="w3-col s6">
				<img v-if="userInfo.headImage" :src="userInfo.headImage.url" style="width: 40px;" />
				<span>用户名：
					<span>{{userInfo.name}}</span>
				</span>
			</div>
		</div>
		<div class="w3-row" style="padding: 5px 5px;">
			<div class="w3-col s6">
				胜利：
				<span>{{userInfo.winCount}}</span>
			</div>
			<div class="w3-col s6">
				失败：
				<span>{{userInfo.loseCount}}</span>
			</div>
		</div>
		<div class="w3-row" style="padding: 5px 5px;">
			<div class="w3-col s6">
				平局：
				<span>{{userInfo.drawCount}}</span>
			</div>
			<div class="w3-col s6">
				逃跑：
				<span>{{userInfo.escapeCount}}</span>
			</div>
		</div>
		<div class="w3-row" style="padding: 5px 5px;">
			<div class="w3-col s6">
				分数：
				<span>{{userInfo.score}}</span>
			</div>
			<div class="w3-col s6">
				游戏豆：
				<span>{{userInfo.beans}}</span>
			</div>
		</div>
		<div class="w3-row" style="padding: 5px 5px;">
			<ul class="my-navbar w3-border-bottom w3-light-grey">
				<li>
					<a class="w3-btn w3-blue" :class="{'w3-white':editHeadImageForm.show}" @click.prevent="clickTab('editHeadImageForm')">上传头像</a>
				</li>
				<li>
					<a class="w3-btn w3-blue" :class="{'w3-white':editUserForm.show}" @click.prevent="clickTab('editUserForm')">编辑信息</a>
				</li>
				<li>
					<a class="w3-btn w3-blue" :class="{'w3-white':findPwdForm.show}" @click.prevent="clickTab('findPwdForm')">修改密码</a>
				</li>
			</ul>
		</div>

		<div class="w3-container" v-show="editHeadImageForm.show" style="width: 100%;height: 200px;text-align: center;">
			<div class="w3-row " style="padding-top: 10px;">
				<div class="thumb_wrp" style="margin: auto;">
					<div class="photo_input_wrp">
						<div class="photo_input_hline"></div>
						<div class="photo_input_vline"></div>
						<input @change="selectHeadImage" id="selectHeadImage" type="file" class="photo_input" value="">
					</div>
					<div v-if="editHeadImageForm.isShowSelectImage">
						<img class="thumb_img" :src="editHeadImageForm.selectImageUrl" style="border: 1px solid red;">
						<div class="del_img_btn" @click="clearSelectImage">×</div>
					</div>
				</div>
			</div>
			<div class="w3-row login-tip" style="">
				<div v-html="editHeadImageForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="padding: 5px 0;">
				<input type="button" class="btn btn-primary" style="width: 120px;" @click="updateHeadImageAction" value="上传" />
			</div>
		</div>

		<div class="w3-container" v-show="editUserForm.show" style="width: 100%;height: 200px;">
			<form class="w3-container" style="margin-top: 20px;">
				<div class="input-group" style="margin: 10px 0;">
					<span class="input-group-addon">
						<i class="fa fa-user fa-fw" aria-hidden="true"></i>
					</span>
					<input class="form-control" type="text" v-model="editUserForm.userName" placeholder="用户名">
					<span class="span-stress">
						&nbsp;*
					</span>
				</div>
				<div class="input-group" style="margin: 10px 0;">
					<span class="input-group-addon">
						<i class="fa fa-key fa-fw" aria-hidden="true"></i>
					</span>
					<input class="form-control" type="text" v-model="editUserForm.userEmail" placeholder="注册邮箱">
					<span class="span-stress">
						&nbsp;*
					</span>
				</div>

				<div class="w3-row login-tip">
					<div v-html="editUserForm.tipMsg"></div>
				</div>
				<div class="w3-row" style="text-align: center;padding: 5px;">
					<div class="w3-col s6" style="padding-right: 5px;">
						<input type="button" class="btn btn-primary" style="width: 100%;" value="修 改" @click.prevent="editUserAction" />
					</div>
				</div>
			</form>
		</div>

		<div class="w3-container" v-show="findPwdForm.show" style="width: 100%;height: 200px;">
			<form class="w3-container" style="margin-top: 15px;">
				<div class="input-group" style="margin: 10px 0;">
					<span class="input-group-addon">
						<i class="fa fa-envelope" aria-hidden="true"></i>
					</span>
					<input class="form-control" type="text" v-model="findPwdForm.userEmail" placeholder="您的注册邮箱">
					<span class="span-stress">
						&nbsp;*
					</span>
				</div>
				<div class="w3-row login-tip">
					<div v-html="findPwdForm.tipMsg"></div>
				</div>
				<div class="w3-row" style="text-align: center;padding: 5px;">
					<div class="w3-col s6" style="padding-right: 5px;">
						<input type="button" class="btn btn-primary" style="width: 100%;" value="重 置" @click.prevent="findPwdAction" />
					</div>
				</div>
			</form>
		</div>

	</MyDialog>
</template>

<script>
	import store from '@/store'
	
	import CON from '@/js/ConEnum'
	import MyDialog from './dialog'
	import Timer from '@/js/Timer'

	let scene = null;

	export default {
		data: function() {
			return {
				userInfo: null,
				editHeadImageForm: {
					show: false,
					tipMsg: "",
					isShowSelectImage: false,
					selectImageUrl: "",
				},
				editUserForm: {
					userName: "",
					userEmail: "",
					tipMsg: "",
					show: false
				},
				findPwdForm: {
					show: false,
					userEmail: "",
					tipMsg: ""
				}
			}
		},
		props: [

		],
		created: function() {
			scene = store.net.scene;

			if(!scene.mediator.player) {
				scene.dialogManage.personalCenter.show = false;
				scene.dialogManage.login.show = true;
				return;
			}
			let me = scene.mediator.player;
			this.userInfo = me.userInfo;
			this.editUserForm.userEmail = me.logindUser.email;
			this.editUserForm.userName = me.logindUser.username;
			this.findPwdForm.userEmail = me.logindUser.email;
		},
		computed: {

		},
		methods: {
			closeModel() {
				scene.dialogManage.personalCenter.show = false;
			},
			getErrorMsg(data) {
				let errMsg = "";
				if(data && !data["success"]) {
					if(data["errMsgArr"]) {
						data["errMsgArr"].forEach(function(item) {
							errMsg += item.errName + (item.errDetail ? ": " + item.errDetail : "") + "<br>";
						});
					}
				}
				return errMsg;
			},
			clickTab(formName) {
				let form = this[formName];
				if(form) {
					if(form.show === true) {
						form.show = false;
					} else {
						if(form === this.editHeadImageForm) {
							this.editHeadImageForm.show = true;
							this.editUserForm.show = false;
							this.findPwdForm.show = false;
						}
						if(form === this.editUserForm) {
							this.editHeadImageForm.show = false;
							this.editUserForm.show = true;
							this.findPwdForm.show = false;
						}
						if(form === this.findPwdForm) {
							this.editHeadImageForm.show = false;
							this.editUserForm.show = false;
							this.findPwdForm.show = true;
						}
					}
				}
			},
			clearSelectImage() {
				document.getElementById("selectHeadImage").value = "";
				this.editHeadImageForm.isShowSelectImage = false;
			},
			selectHeadImage(e) {
				let file = e.target.files[0];
				if(!file) {
					return;
				}
				let that = this;
				var reader = new FileReader();
				reader.onload = function() {
					that.editHeadImageForm.isShowSelectImage = true;
					that.editHeadImageForm.selectImageUrl = reader.result;
				};
				reader.readAsDataURL(file);
			},
			updateHeadImageAction() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.editHeadImageForm.tipMsg = "";
					}, 3000);
				}

				var input = document.getElementById("selectHeadImage");
				if(!input || !input.files[0]) {
					this.editHeadImageForm.tipMsg = "请选择头像！";
					return false;
				}

				that.editHeadImageForm.tipMsg = "";
				var reader = new FileReader();
				reader.onload = function() {
					var dataAF = reader.result;
					scene.mediator.action.emit({
						event: "upHeadImg",
						data: dataAF,
						isShowSpinner: true,
						success: function(data) {
							if(data["success"]) {
								scene.mediator.player.userInfo = data.data;
								that.userInfo = data.data;
								scene.messageCenter.addTipMsg("修改头像成功！");
							} else {
								let errMsg = that.getErrorMsg(data);
								that.editHeadImageForm.tipMsg = errMsg;
							}
						},
						timeout: function() {
							that.editHeadImageForm.tipMsg = "链接超时，请重试！";
						}
					});
				}
				reader.readAsArrayBuffer(input.files[0]);
			},
			editUserAction() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.editUserForm.tipMsg = "";
					}, 3000);
				}
				let userName = this.editUserForm.userName;
				if(!userName) {
					this.editUserForm.tipMsg = "用户名不能为空！";
					clearTipMsg();
					return false;
				}
				let userEmail = this.editUserForm.userEmail;
				if(!userEmail) {
					this.editUserForm.tipMsg = "邮箱不能为空！";
					clearTipMsg();
					return false;
				} else {
					let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					if(!emailReg.test(userEmail)) {
						this.editUserForm.tipMsg = "邮箱格式不正确！";
						clearTipMsg();
						return false;
					}
				}

				that.editUserForm.tipMsg = "";
				scene.mediator.action.emit({
					event: "editUser",
					data: that.editUserForm,
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							scene.mediator.player.userInfo = data.data;
							that.userInfo = data.data;
							scene.messageCenter.addTipMsg("修改成功！");
						} else {
							let errMsg = that.getErrorMsg(data);
							that.editUserForm.tipMsg = errMsg;
						}
					},
					timeout: function() {
						that.editUserForm.tipMsg = "链接超时，请重试！";
					}
				});

			},
			findPwdAction() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.findPwdForm.tipMsg = "";
					}, 3000);
				}

				let userEmail = this.findPwdForm.userEmail;
				if(!userEmail) {
					this.findPwdForm.tipMsg = "邮箱不能为空！";
					clearTipMsg();
					return false;
				} else {
					let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
					if(!emailReg.test(userEmail)) {
						this.findPwdForm.tipMsg = "邮箱格式不正确！";
						clearTipMsg();
						return false;
					}
				}

				that.findPwdForm.tipMsg = "";

				scene.mediator.action.emit({
					event: "findPwd",
					data: {
						userEmail: userEmail
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.findPwdForm.tipMsg = "<span style='color:green;'>请前往你的邮箱修改密码！</sapn>";
						} else {
							let errMsg = that.getErrorMsg(data);
							that.findPwdForm.tipMsg = errMsg;
						}
					},
					timeout: function() {
						that.findPwdForm.tipMsg = "链接超时，请重试！";
					}
				});

			}
		},
		components: {
			MyDialog
		},
		watch: {

		}
	}
</script>