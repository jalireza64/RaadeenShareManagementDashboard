<template>
    <div>
        <kendo-panelbar ref="eventPanel" id="eventPanel" class="panel-bar" v-show="hasEventNotification">
            <div id="item1">
                <i class="fa fa-calendar-alt"></i>&nbsp;
                {{$CaptionsLibrary.get('Events')}}
                <div>
                    <div class="container">
                        <div class="form-group break-line" v-show="!events.length">
                            <label><span>{{$MessagesLibrary.get('ItemNotFound')}}</span></label>
                        </div>
                        <ul class="form-group break-line" v-show="events.length" style="padding-right:15px">
                            <li style="word-wrap: break-word;list-style-type: circle;" v-for="(alert, index) in events"><span>{{alert}}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </kendo-panelbar>

        <kendo-panelbar ref="birthdayPanel" id="birthdayPanel" class="panel-bar" v-show="hasBirthdayNotification">
            <div id="item2">
                <i class="fa fa-birthday-cake"></i>&nbsp;
                {{$CaptionsLibrary.get('Birthdays')}}
                <div>
                    <div class="container">
                        <div class="form-group break-line" v-show="!brithdayEmployees.length">
                            <label><span>{{$MessagesLibrary.get('ItemNotFound')}}</span></label>
                        </div>
                        <ul class="form-group break-line" v-show="brithdayEmployees.length" style="padding-right:15px">
                            <li style="word-wrap: break-word;list-style-type: circle;" v-for="(brithdayEmployee, index) in brithdayEmployees"><span>{{displayedFullName(brithdayEmployee.FullName)}}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </kendo-panelbar>
    </div>
</template>

<script lang="ts" src="./event.ts">
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
