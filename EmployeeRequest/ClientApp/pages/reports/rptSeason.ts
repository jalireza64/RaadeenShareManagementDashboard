﻿import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, generateTimerCountUp } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptSeason extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        finYear: "",
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
            url: "/api/RptSeason/GetSpShrRptSeasonDashboard",
            dataType: "json",
            data: {
                finYear: this.model.finYear
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result.dataList
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

    finYears = []

    getAllFinYear() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetAllFinYear",
            dataType: "json",
            success: result => {
                debugger;
                if (result != null) {
                    this.finYears = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
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
        typeDesc: "",
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
                format: "{0:##,#}"
            }
        }],
        Tooltiptemplate: "",
        qnt: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        if (this.reportDataSource.length != 0) {
            this.chartModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";
            debugger;
            this.chartModel.categories = this.reportDataSource.options.data.map(function (t: any) {
                return t.months
            });

            this.chartModel.qnt = this.reportDataSource.options.data.map(function (t: any) {
                return t.qnt
            });
            debugger;
            (this.$refs.chartWindow as any).kendoWidget().center().open()
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

    mounted() {
        this.getAllFinYear();
    }
} 