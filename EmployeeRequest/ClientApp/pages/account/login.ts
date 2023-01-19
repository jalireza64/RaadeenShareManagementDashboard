import { Vue, Component } from "vue-property-decorator";
import * as CryptoJS from "crypto-js";
import { ResponseType, getNotificationType, EventType, getContractValidity, getOsType, getBrowserType, getDeviceType } from "../../assets/utilities";
@Component({

})
export default class AccountLogin extends Vue {
    canLoginByActiveDirectory = false;
    loginByActiveDirectory = false;
    CaptchaImage = "";
    user = {
        username: "",
        password: "",
        captchaText: "",
        loginType: 0,
        passwordType: "password",
        rememberMe: false
    };

    showLoginType() {
        $(this.$refs.loginByAd).slideToggle();
    }
    
    encrypt(value: string) {
        var key = CryptoJS.enc.Utf8.parse('8080808080808080');
        var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

        var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return encrypted.toString();
    }

    decrypt(value: string) {
        var key = CryptoJS.enc.Utf8.parse('8080808080808080');
        var iv = CryptoJS.enc.Utf8.parse('8080808080808080');

        var decrypted = CryptoJS.AES.decrypt(value, key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    login() {
        window.app.$emit(EventType.StartWaiting);

        var osType = getOsType();
        var browserType = getBrowserType();
        var deviceType = getDeviceType();

        $.ajax({
            type: "POST",
            url: "/api/Account/Login",
            data: {
                captchaText: this.encrypt(this.user.captchaText),
                username: this.encrypt(this.user.username),
                password: this.encrypt(this.user.password),
                osType: osType,
                browserType: browserType,
                deviceType: deviceType
            },
            dataType: "json",
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {

                        if (this.user.rememberMe == true) {
                            localStorage.setItem('username', this.user.username)
                            localStorage.setItem('password', this.encrypt(this.user.password))
                            //localStorage.setItem('password', this.user.password)
                            localStorage.setItem('rememberMe', this.user.rememberMe.toString())
                        } else {
                            localStorage.setItem('username', "")
                            localStorage.setItem('password', "")
                            localStorage.setItem('rememberMe', "false")
                        }

                        window.app.$emit(EventType.Login);
                        this.$router.push("/");
                    } else {
                        //@ts-ignore
                        this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                        this.getCaptchaImage();
                    }
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    deviceId = "";
    isValidContract = false;
    customerName = "";

    validateContract() {
        getContractValidity((result: any) => {
            this.customerName = result.customerName;
            this.isValidContract = result.isValidContract;
            this.deviceId = result.deviceId;
        });
    }

    version = "";

    getVersion() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetVersion",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.version = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showPasswordInLoginState = true;
    showRememberMeInLoginState = true;
    passwordWidth = "100%";

    getAppSettingKeyForLogin() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetAppSettingKeyForLogin",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.showPasswordInLoginState = result.showPasswordInLoginState;
                    this.showRememberMeInLoginState = result.showRememberMeInLoginState;
                    if (result.showPasswordInLoginState == true) {
                        this.passwordWidth = "92%"
                    } else {
                        this.passwordWidth = "100%"
                    }
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    showPassword() {

        if (this.user.passwordType === "password") {
            this.user.passwordType = "text";
        } else {
            this.user.passwordType = "password";
        }

    }

    mounted() {
        //$('.app').addClass('back');

        this.validateContract();
        this.getCaptchaImage();
        this.getVersion();
        this.getAppSettingKeyForLogin();

        document.addEventListener("keyup", event => {
            if (event.getModifierState && event.getModifierState("CapsLock")) {
                this.showCapsLockNotification = true;
            } else {
                this.showCapsLockNotification = false;
            }
        });

        if (localStorage.getItem('username') && localStorage.getItem('password') && localStorage.getItem('rememberMe')) {
            var username = localStorage.getItem('username');
            var password = this.decrypt(String(localStorage.getItem('password')));
            //var password = localStorage.getItem('password');
            var rememberMe = localStorage.getItem('rememberMe');
            if (username != null && password != null && rememberMe != null) {
                this.user.username = username;
                this.user.password = password;
                this.user.rememberMe = rememberMe == "true" ? true : false;
            }            
        } else {
            this.user.username = "";
            this.user.password = "";
            this.user.rememberMe = false;
            localStorage.setItem('username', "");
            localStorage.setItem('password', "");
            localStorage.setItem('rememberMe', "false");
        }
    }

    showCapsLockNotification = false;

    getCaptchaImage() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/ShowCaptchaImageInByte",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.CaptchaImage = result.Data;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
}
