import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType, generateTimerCountUp } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptMaxBuyerByAgent extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    shrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.model.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.model.shrhKind = "";
        }
    }

    model = {
        reportTime: "00:00",
        dateS: "",
        dateE: "",
        shrhKind: "",
        isShowFilter: false,
        isShowBuyDetailWindow: false
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

    reportDataSource = new kendo.data.DataSource({})

    loadReportDataSource() {

        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/RptMaxBuyerByAgent/GetSpShrRptMaxBuyerByAgent",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                shrhKind: this.model.shrhKind
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.result,
                            aggregate: [
                                { field: "sumshare", aggregate: "sum" },
                                { field: "amnt", aggregate: "sum" },
                                { field: "cnt", aggregate: "sum" },
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

    selectedAgent: any = null;

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedAgent = grid.dataItem(grid.select());
    }

    buyDetailDatasource = new kendo.data.DataSource({})

    loadBuyDetailDatasource() {

        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/RptMaxBuyerByAgent/GetSpShrBuyerAgentDetailDashboard",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                shrhKind: this.model.shrhKind,
                agentCode: this.selectedAgent.agent_code
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.result,
                            aggregate: [
                                { field: "share", aggregate: "sum" },
                                { field: "amnt", aggregate: "sum" },
                                { field: "cnt", aggregate: "sum" },
                                { field: "sharePercent", aggregate: "sum" }
                            ]
                        });
                        this.buyDetailDatasource = dataSource;
                    } else {
                        //@ts-ignore
                        this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType))
                    }
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    buyDetailGridDataBinding() {
        var grid = (this.$refs.buyDetailGrid as any).kendoWidget();
        //@ts-ignore
        window.recordBuyDetailGrid = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    //template = kendo.template(`<kendo-sparkline :type='pie' :tooltip-visible='true' :chart-area-height=70 :theme='sass'><kendo-sparkline-series-item :data='[80,20]'></kendo-sparkline-series-item></kendo-sparkline>`);

    reportGridDataBinding() {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    showBuyDetailWindow() {
        this.model.isShowBuyDetailWindow = true;
        this.loadBuyDetailDatasource();
        (this.$refs.buyDetailWindow as any).kendoWidget().center().open()
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
            name: "sumShare",
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
                format: "{0:##,#}"
            }
        },
            {
            name: "sumAmount",
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
                format: "{0:##,#}"
            }
        }],
        categoryAxis: {
            color: "currentColor",
            labels: {
                rotation: {
                    angle: "auto"
                }
            },
            categories: [],
            axisCrossingValues: [0,10000]
        },
        Tooltiptemplate: "",
        sumShare: Array<number>(),
        sumAmount: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        window.app.$emit(EventType.StartWaiting);
        if (this.reportDataSource.options.data.length != 0) {
            this.chartModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

            this.chartModel.categoryAxis.categories = this.reportDataSource.options.data.map(function (t: any) {
                return t.agent_code
            });

            this.chartModel.sumShare = this.reportDataSource.options.data.map(function (t: any) {
                return t.sumshare
            });

            this.chartModel.sumAmount = this.reportDataSource.options.data.map(function (t: any) {
                return t.amnt
            });
            (this.$refs.chartWindow as any).kendoWidget().center().open()
        }

        window.app.$emit(EventType.EndWaiting);
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