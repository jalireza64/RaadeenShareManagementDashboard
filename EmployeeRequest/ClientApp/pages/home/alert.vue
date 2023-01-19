<template>
    <div class="rtl">
        <kendo-panelbar ref="alertPanel" id="alertPanel" class="panel-bar">
            <div id="item1">
                <i class="fa fa-bell"></i>&nbsp;
                {{$CaptionsLibrary.get('Alert')}}
                <div>
                    <div class="container">
                        <div class="form-group break-line" v-show="calculationFaults.length === 0">
                            <label><span>{{$MessagesLibrary.get('ItemNotFound')}}</span></label>
                        </div>
                        <div class="form-group break-line" v-for="(alert, index) in calculationFaults" v-show="calculationFaults.length !== 0">
                            <label style="word-wrap: break-word;"><span>{{alert}}</span></label>
                        </div>
                    </div>
                </div>
            </div>
        </kendo-panelbar>
    </div>
</template>

<script lang="ts" src="./alert.ts">
</script>

<style scoped>
    .panel-bar{
        margin-bottom:20px;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(1, minmax(300px, 1fr));
        grid-gap: 20px;
        padding:10px;
    }

    .form-group span{
        font-weight:bold;
    }

</style>
