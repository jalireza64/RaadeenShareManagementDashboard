import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, generateTimerCountUp } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt44ShrhKind extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        dateS: "",
        dateE: "",
        shareQuntType: "",
        kindFlag: "",
        isShowFilter: false
    };

    shareQuntTypeSelect(e: any) {

        if (e.indices == 0) {
            this.model.shareQuntType = "A>L";
        }

        if (e.indices == 1) {
            this.model.shareQuntType = "L>A";
        }

        //if (e.indices == 2) {
        //    this.model.shareQuntType = "S=B";
        //}

        if (e.indices == 3) {
            this.model.shareQuntType = "all";
        }
    }

    reportTitle = {
        ShrQuntActual: this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Actual'),
        ShrQuntLegal: this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Legal'),
        TrnsCountActual: this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Actual'),
        TrnsCountLegal: this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Legal'),
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

    kindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.kindFlag = "1";
            this.reportTitle.ShrQuntActual = this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Actual');
            this.reportTitle.ShrQuntLegal = this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Legal');
            this.reportTitle.TrnsCountActual = this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Actual');
            this.reportTitle.TrnsCountLegal = this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Buy') + ' ' + this.$CaptionsLibrary.get('Legal');
        }

        if (e.indices == 1) {
            this.model.kindFlag = "2";
            this.reportTitle.ShrQuntActual = this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Sell') + ' ' + this.$CaptionsLibrary.get('Actual');
            this.reportTitle.ShrQuntLegal = this.$CaptionsLibrary.get('Quant') + ' ' + this.$CaptionsLibrary.get('Sell') + ' ' + this.$CaptionsLibrary.get('Legal');
            this.reportTitle.TrnsCountActual = this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Sell') + ' ' + this.$CaptionsLibrary.get('Actual');
            this.reportTitle.TrnsCountLegal = this.$CaptionsLibrary.get('Count') + ' ' + this.$CaptionsLibrary.get('Sell') + ' ' + this.$CaptionsLibrary.get('Legal');
        }
    }

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/Rpt44ShrhKind/GetSpShrRpt44ShrhKind",
            dataType: "json",
            data: {
                kindFlag: this.model.kindFlag,
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                shareQuntType: this.model.shareQuntType
            },
            success: result => {
                debugger;
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                        aggregate: [
                            { field: "SHR_QUNT_ACTUAL", aggregate: "sum" },
                            { field: "SHR_QUNT_LEGAL", aggregate: "sum" },
                            { field: "SHR_QUNT", aggregate: "sum" },
                            { field: "TRNS_COUNT_ACTUAL", aggregate: "sum" },
                            { field: "TRNS_COUNT_LEGAL", aggregate: "sum" },
                            { field: "TRNS_COUNT", aggregate: "sum" }
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

    chartModel = {
        isShowChart: false,
        series: [{
            data: []
        }],
        xAxis: {
            labels: {
                color: "currentColor",
                format: "{0:N0}",
                rotation: "auto"
            },
            
            plotBands: [{
                from: -5000,
                to: 0,
                color: "#ffffff",
                opacity: 0.05
            }]
        },
        yAxis: {
            labels: {
                format: "{0:N0}"
            },
            line: {
                width: 0
            }
        },
        tooltip: {
            visible: true,
            format: "{3}: {2:N0}",
            opacity: 1
        },
        amnt: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        window.app.$emit(EventType.StartWaiting);
        if (this.reportDataSource.length != 0) {
            
            debugger;
            this.chartModel.series = [];
            this.chartModel.series.push({
                data: this.reportDataSource.options.data.map((t: any) => ({
                    x: t.qnt,
                    y: t.cnt,
                    size: t.qnt,
                    category: t.tbl_date

                }))
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