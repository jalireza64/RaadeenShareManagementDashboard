import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, generateTimerCountUp } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt14 extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        effDate: "",
        isShowFilter: false
    };

    manuModel = {
        ShowMenu: false
    }

    toggleReport() {
        if (this.manuModel.ShowMenu == false) {
            this.manuModel.ShowMenu = true;
        } else {
            this.manuModel.ShowMenu = false;
        }
    }

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/Rpt14/GetSpShrRpt14",
            dataType: "json",
            data: {
                effDate: this.model.effDate
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                        aggregate: [
                            { field: "shrh_code_count", aggregate: "sum" },
                            { field: "shareholder_percent", aggregate: "sum" },
                            { field: "share_percent", aggregate: "sum" },
                            { field: "share", aggregate: "sum" }
                        ]
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.FilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
                this.stopTimer();
            }
        });
    }

    reportGridDataBinding() {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    ShowFilter() {
        this.model.isShowFilter = true;
        (this.$refs.FilterWindow as any).kendoWidget().center().open()
    }

    showReport() {
        this.loadReportDataSource();
    }

    exportExcel() {
        var reportGrid = (this.$refs.reportGrid as any).kendoWidget();
        reportGrid.saveAsExcel();
    }

    interval: any;

    startTimer() {
        // Set the date we're counting down to
        var countUpDate = new Date(Date()).getTime();

        // Update the count down every 1 second
        this.interval = setInterval(() => {

            this.model.reportTime = generateTimerCountUp(countUpDate);

        }, 1000);
    }

    stopTimer() {
        clearInterval(this.interval);
    }

    mounted() {
        
    }
} 