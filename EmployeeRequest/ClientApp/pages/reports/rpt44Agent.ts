import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt44Agent extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
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
        $.ajax({
            type: "POST",
            url: "/api/Rpt44Agent/GetSpShrRpt44Agent",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE
            },
            success: result => {
                debugger;
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                        aggregate: [
                            { field: "CNT", aggregate: "sum" },
                            { field: "QNT", aggregate: "sum" }
                        ]
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.FilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
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
                    x: t.QNT,
                    y: t.CNT,
                    size: t.QNT,
                    category: t.DESC1

                }))
            });


            (this.$refs.chartWindow as any).kendoWidget().center().open()
        }

        window.app.$emit(EventType.EndWaiting);
    }

    mounted() {
        
    }
} 