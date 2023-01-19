import { Vue, Component } from "vue-property-decorator";
import { EventType } from "../../assets/utilities";

@Component({

})
export default class HomeAlert extends Vue {

    calculationFaults = [];

    getCalculationFaults() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/NavbarNotification/GetCalculationFaults",
            dataType: "json",
            success: result => {
                window.app.$emit(EventType.EndWaiting);
                if (result != null) {
                    this.calculationFaults = result;
                }
            },
            complete: () => {

            }
        });
    }

    mounted() {
        this.getCalculationFaults();
        (this.$refs.alertPanel as any).kendoWidget().expand($("#item1"), false);
        $('#item1 > span').addClass('k-state-selected');
    }
} 