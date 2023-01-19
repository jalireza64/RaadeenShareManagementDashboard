<template>
    <div class="rtl page">
        <kendo-window ref="UserWindow" :title="usersModel.operationTypeDesc" :visible="usersModel.isShowWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="name">{{$CaptionsLibrary.get("Firstname")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="name" v-model="usersModel.name" />
                </div>
                <div class="form-group">
                    <label for="family">{{$CaptionsLibrary.get("Family")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="family" v-model="usersModel.family" />
                </div>
                <div class="form-group">
                    <label for="username">{{$CaptionsLibrary.get("Username")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="username" v-model="usersModel.username" />
                </div>
                <div class="form-group" v-show="usersModel.operationType == 0">
                    <label for="password">{{$CaptionsLibrary.get("Password")}}</label>
                    <div class="password-wrapper">
                        <k-input id="password" v-model="usersModel.password" v-bind:type="usersModel.passwordType" style="width:92%" />
                        <kendo-button v-show="usersModel.passwordType === 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye"></i></kendo-button>
                        <kendo-button v-show="usersModel.passwordType !== 'password'" class="k-button k-primary" @click.prevent="showPassword"><i class="far fa-eye-slash"></i></kendo-button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="mobileNo">{{$CaptionsLibrary.get("MobileNumber")}}</label>
                    <k-input type="text" class="k-textbox width-100" id="mobileNo" v-model="usersModel.mobileNo" />
                </div>
                <div class="form-group">
                    <label for="accessLevel">{{$CaptionsLibrary.get("AccessLevel")}}</label>
                    <kendo-combobox v-model="usersModel.accessLevelId"
                                    id="accessLevel"
                                    :data-source="accessLevels"
                                    :data-text-field="'Title'"
                                    :data-value-field="'Id'"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="operation" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="ChangePassWindow" :title="$CaptionsLibrary.get('ChangePassword')" :visible="user.isShowWindow" :modal="true">
            <div class="container">
                <div class="form-group break-line">
                    <label for="newPassword">{{$CaptionsLibrary.get("NewPassword")}}</label>
                    <div class="input_container">
                        <div class="password-wrapper">
                            <input id="newPassword" @input="p_len" v-model="user.newPassword" v-bind:type="user.passwordType" class="k-textbox" style="width:92%" />
                            <kendo-button v-show="user.passwordType === 'password'" class="k-button k-primary" @click.prevent="showPassword2"><i class="far fa-eye"></i></kendo-button>
                            <kendo-button v-show="user.passwordType !== 'password'" class="k-button k-primary" @click.prevent="showPassword2"><i class="far fa-eye-slash"></i></kendo-button>
                        </div>
                        <!--<span v-bind:class="{ valid_password_length: passwordStrength.valid_password_length , show_password_length: passwordStrength.typed}" class="password_length">{{passwordStrength.password_length}}</span>
                        <span v-bind:class="{show_valid_password_container: passwordStrength.valid_password }" class="valid_password_container password_strength">
                            <i class="fa fa-check"></i>
                        </span>-->
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
                <div class="form-group">
                    <kendo-button @click.prevent="changePass" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                <div>
                    <div style="float:right;margin:5px">
                        <i class="fa fa-users"></i>
                        {{$CaptionsLibrary.get('Operation')}}
                    </div>
                </div>
                <div>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showAdd">
                        <div>
                            <i class="fa fa-plus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedUser != null" @click.prevent="showEdit">
                        <div>
                            <i class="fa fa-edit"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedUser != null" @click.prevent="remove">
                        <div>
                            <i class="fa fa-minus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedUser != null" @click.prevent="showChangePass">
                        <div>
                            <i class="fa fa-lock"></i>
                        </div>
                    </kendo-button>
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        :column-menu="true"
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">
                <kendo-grid-column :field="'Name'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Firstname')"></kendo-grid-column>

                <kendo-grid-column :field="'Family'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Family')"></kendo-grid-column>

                <kendo-grid-column :field="'Username'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Username')"></kendo-grid-column>

                <kendo-grid-column :field="'MobileNo'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('MobileNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'Title'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('AccessLevel')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./users.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .chart-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .password-wrapper {
        display: flex;
        align-items: center;
    }

    .password-wrapper button{
        height:2.3rem !important;
        width:2.3rem !important;
    }

    @media(max-width: 800px) {
        .chart-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 20px;
            padding: 10px;
        }
    }

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
  /*display: block;*/
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

    .bs-docs-example .k-grid {
        height: calc(100% - 43px);
    }

    .bs-docs-example .k-grid-content {
        height: calc(100% - 120px) !important;
    }

    @media(max-width: 800px) {
        .bs-docs-example .k-grid {
            height: calc(100% - 50px);
    }
        .bs-docs-example .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
</style>

<style>

</style>
