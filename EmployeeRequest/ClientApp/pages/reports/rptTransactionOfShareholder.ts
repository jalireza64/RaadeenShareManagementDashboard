import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, generateTimerCountUp, getNotificationType, ResponseType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptTransactionOfShareholder extends Vue {

    @Prop()
    filter!: string;

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        shrhCode: "",
        dateS: "",
        dateE: "",
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
            url: "/api/RptTransactionOfShareholder/GetTransactionOfShareholder",
            dataType: "json",
            data: {
                shrhCode: this.model.shrhCode,
                dateS: this.model.dateS,
                dateE: this.model.dateE
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {

                        var remain = 0;
                        result.result.forEach(function (e:any) {
                            if (typeof e === "object") {
                                remain = remain + e.ShrQuntBuy + e.ShrQuntSell;
                                e["Remain"] = remain;
                            }
                        });

                        var dataSource = new kendo.data.DataSource({
                            pageSize: 100,
                            data: result.result,
                            aggregate: [
                                { field: "ShrQuntBuy", aggregate: "sum" },
                                { field: "ShrQuntSell", aggregate: "sum" }
                            ]
                        });
                        this.reportDataSource = dataSource;
                        (this.$refs.FilterWindow as any).kendoWidget().center().close()
                    } else {
                        //@ts-ignore
                        this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                    }
                    
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
                this.stopTimer();
            }
        });
    }

    reportGridDataBinding(e: any) {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
        //@ts-ignore
        window.remain = 0;
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

    chartModel = {
        isShowChart: false,
        valueAxis: [{
            color: "currentColor",
            line: {
                visible: true
            },
            majorGridLines: {
                visible: true,
                color: "currentColor"
            },
            labels: {
                rotation: "auto",
                format: "{0:##,#;(0:##,#)}"
            }
        }],
        Tooltiptemplate: "",
        buy: Array<number>(),
        sell: Array<number>(),
        remain: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["darkseagreen", "tomato", "blue"]
    }

    showChart() {
        (this.$refs.chartWindow as any).kendoWidget().center().open()
        if (this.reportDataSource.length != 0) {
            this.chartModel.Tooltiptemplate = "#= series.name #: #= kendo.toString(value, '0:00,0;(0:00,0)') #";

            this.chartModel.categories = this.reportDataSource.options.data.map(function (t: any) {
                return t.TblDate
            });

            this.chartModel.buy = this.reportDataSource.options.data.map(function (t: any) {
                return t.ShrQuntBuy
            });

            this.chartModel.sell = this.reportDataSource.options.data.map(function (t: any) {
                return t.ShrQuntSell
            });

            this.chartModel.remain = this.reportDataSource.options.data.map(function (t: any) {
                return t.Remain
            });
        }
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

    autoLoadReport() {
        debugger;
        if (this.filter != undefined) {
            var filterItems = this.filter.split("&");
            this.model.dateS = filterItems[0].substring(0, 4) + "/" + filterItems[0].substring(4, 6) + "/" + filterItems[0].substring(6, 8);
            this.model.dateE = filterItems[1].substring(0, 4) + "/" + filterItems[1].substring(4, 6) + "/" + filterItems[1].substring(6, 8);
            this.model.shrhCode = filterItems[2];
            this.loadReportDataSource();
        }
    }

    mounted() {
        this.autoLoadReport();
    }
} 