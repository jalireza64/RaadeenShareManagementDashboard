import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, ResponseType, getNotificationType } from "../../assets/utilities";
import * as CryptoJS from "crypto-js";
//import * as Password from 'vue-password-strength-meter';

@Component({

})
export default class AccountEmployeeChangePass extends Vue {
    user = {
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
        passwordType: "password",
    };

    showPassword() {

        if (this.user.passwordType === "password") {
            this.user.passwordType = "text";
        } else {
            this.user.passwordType = "password";
        }

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

    changePass() {
        if (this.user.newPassword !== this.user.repeatPassword) {
            //@ts-ignore
            this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('NewPasswordAndNewPasswordRepeateAreNotMatch'), 'error');
            return false;
        }

        if (this.user.oldPassword == this.user.newPassword) {
            //@ts-ignore
            this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('YouCanNotSetOldPassword'), 'error');
            return false;
        }

        if (!this.passwordStrength.valid_password) {
            //@ts-ignore
            this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('PasswordStrengthNotValid'), 'error');
            return false;
        }

        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/ChangePassword",
            data: {
                oldPass: this.encrypt(this.user.oldPassword),
                newPass: this.encrypt(this.user.newPassword)
            },
            dataType: "json",
            success: result => {
                debugger;
                if (result.ResponseType === ResponseType.Ok) {
                    this.$router.push("/account/login");
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    passwordStrength= {
        password_length: 0,
        typed: false,
        contains_lowercase: false,
        contains_number: false,
        contains_uppercase: false,
        contains_symbol: false,
        valid_password_length: false,
        valid_password: false
    }

    p_len() {
        debugger;
        this.passwordStrength.password_length = this.user.newPassword.length;
        if (this.passwordStrength.password_length >= 8) {
            this.passwordStrength.valid_password_length = true;
        } else {
            this.passwordStrength.valid_password_length = false;
        }

        if (this.passwordStrength.password_length > 0) {
            this.passwordStrength.typed = true;
        } else {
            this.passwordStrength.typed = false;
        }
        this.$nextTick(() => {
            this.passwordStrength.contains_lowercase = /[a-z]/.test(this.user.newPassword);
            this.passwordStrength.contains_number = /\d/.test(this.user.newPassword);
            this.passwordStrength.contains_uppercase = /[A-Z]/.test(this.user.newPassword);
            this.passwordStrength.contains_symbol = /[^\w\s]/.test(this.user.newPassword);
        });

        

        // Check if the password is valid
        if (this.passwordStrength.contains_lowercase == true &&
            this.passwordStrength.contains_number == true &&
            this.passwordStrength.contains_uppercase == true &&
            this.passwordStrength.contains_symbol == true &&
            this.passwordStrength.valid_password_length == true) {

            this.passwordStrength.valid_password = true;

        } else {
            this.passwordStrength.valid_password = false;
        }
}

    mounted() {
        //window.app.$emit(EventType.StartWaiting);
        //$.ajax({
        //    type: "GET",
        //    url: "/api/Account/GetPassRegexProps",
        //    dataType: "json",
        //    success: result => {
        //        this.passRegexProps.regexPattern = result.RegexPattern;
        //        this.passRegexProps.regexError = result.RegexError;
        //    },
        //    complete: () => {
        //        window.app.$emit(EventType.EndWaiting);
        //    }
        //});
    }
} 