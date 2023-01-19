<template>
    <div class="rtl">
        <form class="bs-docs-example k-content" @submit.prevent="changePass">
            <div class="title k-alt">
                <i class="fa fa-key"></i>
                {{$CaptionsLibrary.get('ChangePassword')}}
            </div>
            <div class="container">
                <div class="form-group break-line">
                    <label for="oldPassword">{{$CaptionsLibrary.get("OldPassword")}}</label>
                    <input id="oldPassword" v-model="user.oldPassword" type="password" class="k-textbox width-100" />
                </div>
                <div class="form-group break-line">
                    <label for="newPassword">{{$CaptionsLibrary.get("NewPassword")}}</label>
                    <div class="input_container">
                        <div class="password-wrapper">
                            <input id="newPassword" @input="p_len" v-model="user.newPassword" v-bind:type="user.passwordType" class="k-textbox" style="width:92%" />
                            <kendo-button v-show="user.passwordType === 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye"></i></kendo-button>
                            <kendo-button v-show="user.passwordType !== 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye-slash"></i></kendo-button>
                        </div>
                        <span v-bind:class="{ valid_password_length: passwordStrength.valid_password_length , show_password_length: passwordStrength.typed}" class="password_length">{{passwordStrength.password_length}}</span>
                        <span v-bind:class="{show_valid_password_container: passwordStrength.valid_password }" class="valid_password_container password_strength">
                            <i class="fa fa-check"></i>
                        </span>
                    </div>

                    <div class="lnu_container">
                        <p v-bind:class="{ regex_valid: passwordStrength.contains_lowercase }">{{$CaptionsLibrary.get("Lowercase")}}</p>
                        <p v-bind:class="{ regex_valid: passwordStrength.contains_number }">{{$CaptionsLibrary.get("Number")}}</p>
                        <p v-bind:class="{ regex_valid: passwordStrength.contains_uppercase }">{{$CaptionsLibrary.get("Uppercase")}}</p>
                        <p v-bind:class="{ regex_valid: passwordStrength.contains_symbol }">{{$CaptionsLibrary.get("SymbolCharacter")}}</p>
                    </div>
                </div>
                <div class="form-group break-line">
                    <label for="repeatPassword">{{$CaptionsLibrary.get("DuplicateNewPassword")}}</label>
                    <input id="repeatPassword" v-model="user.repeatPassword" type="password" class="k-textbox width-100" />
                </div>
                <div class="form-group break-line">
                    <kendo-button class="k-button k-primary">{{$CaptionsLibrary.get("ChangePassword")}}</kendo-button>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts" src="./employeeChangePass.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
    }

    .password-wrapper {
        display: flex;
        align-items: center;
    }

    .password-wrapper button{
        height:2.3rem !important;
        width:2.3rem !important;
    }

.input_container {
  display: block;
  margin: 0 auto;
  width: 100%;
  height: auto;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

/*#app input[type="password"] {
  width: 320px;
  height: auto;
  border: 1px solid transparent;
  background: #eeeeee;
  color: #475762;
  font-size: 15px;
  border-radius: 4px;
  padding: 12px 5px;
  overflow: hidden;
  outline: none;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}*/

#app input[type="password"]:focus {
  border: 1px solid #2196f3;
}

.password_length {
  text-align:center;
  padding: 2px;
  width:20px;
  position: absolute;
  top: 50%;
  left: 35px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: #fbd490;
  color: rgba(71, 87, 98, 0.8);
  border-radius: 4px;
  font-size: 13px;
  display: none;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
}

.password_strength {
  text-align:center;
  padding: 2px;
  position: absolute;
  top: 50%;
  left: 62px;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  background: #fbd490;
  color: rgba(71, 87, 98, 0.8);
  border-radius: 4px;
  font-size: 13px;
  display: none;
  -webkit-transition: all 0.1s;
  transition: all 0.1s;
  width:20px;
}

.valid_password_length {
  background: #00ad7c;
  color: rgba(255, 255, 255, 0.9);
}

.show_password_length {
  display: block;
}

.lnu_container {
  display: block;
  margin: 10px auto;
  width: 330px;
  height: auto;
  display: -webkit-box;
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
}

.lnu_container p {
  width: 80px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  border-radius: 2px;
  color: rgba(71, 87, 98, 0.8);
  background: -webkit-gradient(linear, left top, right top, color-stop(50%, #00ad7c), color-stop(50%, #eee));
  background: linear-gradient(to right, #00ad7c 50%, #eee 50%);
  background-size: 201% 100%;
  background-position: right;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
}

.regex_valid {
  background-position: left !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

.valid_password_container {
      text-align:center;
  padding: 2px;
  width:20px;
  display:block;
  padding: 2px 10px;
  border-radius: 4px;
  background: #00ad7c;
  color:white;
  visibility: hidden;
  opacity: 0;
}

.show_valid_password_container {
  visibility: visible;
  opacity: 1;
}

@-webkit-keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

</style>
