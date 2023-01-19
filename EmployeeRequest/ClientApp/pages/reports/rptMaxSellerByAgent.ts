import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptMaxSellerByAgent extends Vue {
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
        dateS: "",
        dateE: "",
        shrhKind: "",
        isShowFilter: false,
        isShowSellDetailWindow: false
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
        $.ajax({
            type: "POST",
            url: "/api/RptMaxSellerByAgent/GetSpShrRptMaxSellerByAgent",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                shrhKind: this.model.shrhKind
            },
            success: result => {
                debugger;
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
            }
        });
    }

    selectedAgent: any = null;

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedAgent = grid.dataItem(grid.select());
    }

    sellDetailDatasource = new kendo.data.DataSource({})

    loadSellDetailDatasource() {

        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/RptMaxSellerByAgent/GetSpShrSellerAgentDetailDashboard",
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
                        this.sellDetailDatasource = dataSource;
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

    sellDetailGridDataBinding() {
        var grid = (this.$refs.sellDetailGrid as any).kendoWidget();
        //@ts-ignore
        window.recordSellDetailGrid = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    reportGridDataBinding() {
        var grid = (this.$refs.reportGrid as any).kendoWidget();
        //@ts-ignore
        window.record = (grid.dataSource.page() - 1) * grid.dataSource.pageSize();
    }

    showSellDetailWindow() {
        this.model.isShowSellDetailWindow = true;
        this.loadSellDetailDatasource();
        (this.$refs.sellDetailWindow as any).kendoWidget().center().open()
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
    rowNumber = 0;

    resetRowNumber() {
        this.rowNumber = 0;
    }

    renderNumber(data: any) {
        return ++this.rowNumber;
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
            axisCrossingValues: [0, 10000]
        },
        Tooltiptemplate: "",
        sumShare: Array<number>(),
        sumAmount: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        window.app.$emit(EventType.StartWaiting);
        if (this.reportDataSource.length != 0) {
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

    mounted() {
        
    }
} 