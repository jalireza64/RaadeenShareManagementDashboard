<template>
    <div class="rtl" style="display:flex;align-items:center;height:100%;">
        <form class="container bs-docs-example k-content" :data-content="$CaptionsLibrary.get('ChangePassword')">
            <br />
            <span style="text-align:right !important">{{$MessagesLibrary.get("YourPasswordIsExpiredPleaseInsertNewPassword")}}</span>
            <div class="form-group">
                <input v-model="user.oldPassword" type="password" class="k-textbox width-100" :placeholder="$CaptionsLibrary.get('OldPassword')" />
            </div>
            <div class="form-group">
                <input v-model="user.newPassword" type="password" class="k-textbox width-100" :placeholder="$CaptionsLibrary.get('NewPassword')" />
            </div>
            <div class="form-group">
                <input v-model="user.repeatPassword" type="password" class="k-textbox width-100" :placeholder="$CaptionsLibrary.get('DuplicateNewPassword')" />
            </div>
            <div class="form-group">
                <kendo-button @click.prevent="changePass" class="k-button k-primary">{{$CaptionsLibrary.get("ChangePassword")}}</kendo-button>
            </div>
        </form>
    </div>
</template>

<script lang="ts" src="./changePass.ts">
</script>

<style scoped>

    .container {
        margin: auto;
        width: 30%;
        padding: 10px;
        text-align: center;
        display: grid;
        grid-row-gap: 1.5rem;
    }

    @media(max-width: 800px) {
        .container {
            margin: auto !important;
            width: 90% !important;
            padding: 10px !important;
            text-align: center !important;
        }
    }

    .logo {
        margin-top: 2rem;
        width: 30px;
        height: 30px;
        justify-self: center;
    }
</style>
