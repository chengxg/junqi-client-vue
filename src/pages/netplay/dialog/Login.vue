<style>
	.login-content {
		max-width: 90%;
	}
	
	.login-tip {
		text-align: right;
		padding: 5px;
		min-height: 40px;
		color: red;
		-webkit-user-select: auto;
	}
</style>
<template>
	<MyDialog :isClickMaskClose="false" :beforeClose="closeModel" :selfContentClass="['login-content']">
		<h4 slot="header" v-show="loginForm.show" style="">登录</h4>

		<form class="w3-container" v-show="loginForm.show" style="margin-top: 20px;">
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-user fa-fw" aria-hidden="true"></i>
				</span>
				<input list="loginFormUserNameList" class="form-control" type="text" v-model="loginForm.userName" placeholder="用户名">
				<datalist id="loginFormUserNameList">
					<option v-for="item in loginForm.loginUserNameList" :value="item.userName"></option>
				</datalist>
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-key fa-fw" aria-hidden="true"></i>
				</span>
				<input class="form-control" type="password" v-model="loginForm.userPwd" placeholder="密码">
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="w3-row" style="padding: 5px 5px;">
				<div class="w3-col s6">
					<input type="checkbox" id="rememberPwd" style="width: 20px;height: 20px;vertical-align: text-bottom;" v-model="loginForm.isRememberPwd" />
					<label for="rememberPwd">记住密码</label>
				</div>
				<div class="w3-col s6" style="text-align: right;">
					<a href="javascript:;" @click.prevent="toFindPwdForm" class="my-a">忘记密码？</a>
				</div>
			</div>
			<div class="w3-row login-tip">
				<div v-html="loginForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="登 录" @click.prevent="loginAction" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="注 册" @click.prevent="toRegisterForm" />
				</div>
			</div>
		</form>

		<h4 slot="header" v-show="registerForm.show" style="">注册</h4>

		<form class="w3-container" v-show="registerForm.show" style="text-align: left;">
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-user fa-fw" aria-hidden="true"></i>
				</span>
				<input class="form-control" type="text" v-model="registerForm.userName" placeholder="用户名">
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-key fa-fw" aria-hidden="true"></i>
				</span>
				<input class="form-control" type="password" v-model="registerForm.userPwd" placeholder="密码">
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-key fa-fw" aria-hidden="true"></i>
				</span>
				<input class="form-control" type="password" v-model="registerForm.userPwd2" placeholder="确认密码">
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="input-group" style="margin: 10px 0;">
				<span class="input-group-addon">
					<i class="fa fa-envelope fa-fw" aria-hidden="true"></i>
				</span>
				<input class="form-control" type="text" v-model="registerForm.userEmail" placeholder="邮箱，用于找回密码">
				<span class="span-stress">
					&nbsp;*
				</span>
			</div>
			<div class="w3-row login-tip">
				<div v-html="registerForm.tipMsg"></div>
			</div>
			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="注 册" @click.prevent="registerAction" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="返回登录" @click.prevent="toLoginForm" />
				</div>
			</div>
		</form>

		<h4 slot="header" v-show="findPwdForm.show" style="">注册</h4>

		<form class="w3-container" v-show="findPwdForm.show" style="margin-top: 15px;">
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
			<div class="w3-row" style="text-align: center;padding: 5px 5px 10px 5px;">
				<div class="w3-col s6" style="padding-right: 5px;">
					<input type="button" class="btn btn-primary" style="width: 100%;" value="找回密码" @click.prevent="findPwdAction" />
				</div>

				<div class="w3-col s6" style="text-align: right;padding-left: 5px;">
					<input type="button" class="btn btn-default" style="width: 100%;" value="返回登录" @click.prevent="toLoginForm" />
				</div>
			</div>
		</form>

	</MyDialog>
</template>

<script>
	import CON from '@/js/game/ConEnum'
	import MyDialog from './dialog'
	import Timer from '@/js/Timer'

	let scene = null;

	export default {
		data: function() {
			return {
				loginForm: {
					show: true,
					userName: "",
					userPwd: "",
					isRememberPwd: false,
					tipMsg: "",
					loginUserNameList: []
				},
				registerForm: {
					show: false,
					userName: "",
					userPwd: "",
					userPwd2: "",
					userEmail: "",
					tipMsg: ""
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
			this.scene = this.$parent.scene;
			scene = this.scene;

			let loginFormJson = localStorage.getItem("loginForm");
			if(loginFormJson) {
				let loginForm = null;
				try {
					loginForm = JSON.parse(loginFormJson);
				} catch(e) {}
				if(loginForm) {
					if(loginForm["loginUserNameList"]) {
						this.loginForm.loginUserNameList = loginForm["loginUserNameList"];
					}
					if(loginForm["lastUserName"]) {
						//自动赋值 上一次的登录用户
						let user = this.getUserByName(loginForm["lastUserName"]);
						if(user) {
							this.loginForm.userName = user["userName"];
							this.loginForm.userPwd = user["userPwd"];
						}
					}
					if(typeof loginForm["isRememberPwd"] === "boolean") {
						this.loginForm.isRememberPwd = loginForm["isRememberPwd"];
					}
				}
			}

		},
		computed: {

		},
		methods: {
			closeModel() {
				this.scene.dialogManage.login.show = false;
				let loginForm = {
					loginUserNameList: this.loginForm.loginUserNameList,
					lastUserName: this.loginForm.userName,
					isRememberPwd: this.loginForm.isRememberPwd
				};
				let loginFormJson = JSON.stringify(loginForm);
				localStorage.setItem("loginForm", loginFormJson);
			},
			validateEmail(str) {
				let emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if(!emailReg.test(str)) {
					return false;
				}
				return true;
			},
			rememberLoginUser(userName, userPwd) {
				if(!this.loginForm.isRememberPwd) {
					userPwd = "";
				}
				let user = {
					userName: userName,
					userPwd: userPwd
				};
				let isExist = false;
				this.loginForm.loginUserNameList.every(function(item, index) {
					if(item && item["userName"] === userName) {
						isExist = true;
						item = user;
						return false;
					} else {
						return true;
					}
				});
				if(!isExist) {
					if(this.loginForm.loginUserNameList.length >= 5) {
						this.loginForm.loginUserNameList.splice(0, 1);
					}
					this.loginForm.loginUserNameList.push(user);
				}
			},
			getUserByName(userName) {
				let user = null;
				this.loginForm.loginUserNameList.every(function(item, index) {
					if(item && item["userName"] === userName) {
						user = item;
						return false;
					} else {
						return true;
					}
				});
				return user;
			},
			selectLoginUser() {
				let userName = this.loginForm.userName;
				if(userName) {
					let user = this.getUserByName(userName);
					if(user) {
						this.loginForm.userPwd = user["userPwd"];
					} else {
						this.loginForm.userPwd = "";
					}
				} else {
					this.loginForm.userPwd = "";
				}
			},
			toLoginForm() {
				this.loginForm.show = true;
				this.registerForm.show = false;
				this.findPwdForm.show = false;
			},
			toRegisterForm() {
				this.loginForm.show = false;
				this.registerForm.show = true;
				this.findPwdForm.show = false;
			},
			toFindPwdForm() {
				this.loginForm.show = false;
				this.registerForm.show = false;
				this.findPwdForm.show = true;
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
			loginAction() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.loginForm.tipMsg = "";
					}, 3000);
				}
				let userName = this.loginForm.userName;
				if(!userName) {
					this.loginForm.tipMsg = "用户名不能为空！";
					clearTipMsg();
					return false;
				}
				let userPwd = this.loginForm.userPwd;
				if(!userPwd) {
					this.loginForm.tipMsg = "密码不能为空！";
					clearTipMsg();
					return false;
				}

				scene.mediator.action.login(this.loginForm, function(data) {
					if(data["success"]) {
						that.rememberLoginUser(userName, userPwd);
						that.closeModel();
						scene.messageCenter.addTipMsg("登录成功！");
					} else {
						let errMsg = that.getErrorMsg(data);
						that.loginForm.tipMsg = errMsg;
					}
				});
			},
			registerAction() {
				let that = this;

				function clearTipMsg() {
					setTimeout(function() {
						that.registerForm.tipMsg = "";
					}, 3000);
				}

				let userName = this.registerForm.userName;
				if(!userName) {
					this.registerForm.tipMsg = "用户名不能为空！";
					clearTipMsg();
					return false;
				}
				if(userName.length > 6) {
					this.registerForm.tipMsg = "用户名不能超过6个字！";
					clearTipMsg();
					return false;
				}
				let userPwd = this.registerForm.userPwd;
				if(!userPwd) {
					this.registerForm.tipMsg = "密码不能为空！";
					clearTipMsg();
					return false;
				}
				let userPwd2 = this.registerForm.userPwd2;
				if(!userPwd2) {
					this.registerForm.tipMsg = "确认密码不能为空！";
					clearTipMsg();
					return false;
				}
				if(userPwd !== userPwd2) {
					this.registerForm.tipMsg = "两次密码输入不一致，请重新输入！";
					clearTipMsg();
					return false;
				}
				let userEmail = this.registerForm.userEmail;
				if(!userEmail) {
					this.registerForm.tipMsg = "邮箱不能为空！";
					clearTipMsg();
					return false;
				} else {
					if(!this.validateEmail(userEmail)) {
						this.registerForm.tipMsg = "邮箱格式不正确！";
						clearTipMsg();
						return false;
					}
				}

				scene.mediator.action.emit({
					event: "register",
					data: this.registerForm,
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.loginForm.userName = userName;
							that.registerForm.tipMsg = "<span style='color:green;'>注册成功，请返回登录！</sapn>";
						} else {
							let errMsg = that.getErrorMsg(data);
							that.registerForm.tipMsg = errMsg;
						}
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
					if(!this.validateEmail(userEmail)) {
						this.findPwdForm.tipMsg = "邮箱格式不正确！";
						clearTipMsg();
						return false;
					}
				}

				scene.mediator.action.emit({
					event: "findPwd",
					data: {
						userEmail: userEmail
					},
					isShowSpinner: true,
					success: function(data) {
						if(data["success"]) {
							that.findPwdForm.tipMsg = "<span style='color:green;'>请前往你的邮箱找回邮件！</sapn>";
						} else {
							let errMsg = that.getErrorMsg(data);
							that.findPwdForm.tipMsg = errMsg;
						}
					}
				});
			}
		},
		components: {
			MyDialog
		},
		watch: {
			"loginForm.userName": function() {
				let userName = this.loginForm.userName;
				if(userName) {
					let user = this.getUserByName(userName);
					if(user) {
						this.loginForm.userPwd = user["userPwd"];
					} else {
						this.loginForm.userPwd = "";
					}
				} else {
					this.loginForm.userPwd = "";
				}
			}
		}
	}
</script>