import { Vue, Component } from "vue-property-decorator";
import { EventType } from "../../assets/utilities";

@Component({

})
export default class HomeEvent extends Vue {
    hasEventNotification = false;
    events = [];

    hasBirthdayNotification = false;
    brithdayEmployees = [];

    displayedFullName(fullName: string) {
        return this.$MessagesLibrary.get("TodayIs0sBirthday").replace("0", fullName);
    }

    getAllTodayBirthDateEmployeeList() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/NavbarNotification/GetAllTodayBirthDateEmployeeList",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.brithdayEmployees = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    getCalendarDayDescription() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/NavbarNotification/GetCalendarDayDescription",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.events = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    mounted() {
        this.hasEventNotification = localStorage.getItem("eventNotification") != null;
        this.hasBirthdayNotification = localStorage.getItem("birthdayNotification") != null;

        this.hasBirthdayNotification && this.getAllTodayBirthDateEmployeeList();
        this.hasEventNotification && this.getCalendarDayDescription();

        (this.$refs.eventPanel as any).kendoWidget().expand($("#item1"), false);
        (this.$refs.birthdayPanel as any).kendoWidget().expand($("#item2"), false);
        $('#item1 > span').addClass('k-state-selected');
        $('#item2 > span').addClass('k-state-selected');
    }
} 