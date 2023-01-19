import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt0702 extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    typeSelect(e: any) {
        if (e.indices == 0) {
            this.model.type = "1";
        }

        if (e.indices == 1) {
            this.model.type = "3";
        }

        if (e.indices == 2) {
            this.model.type = "4";
        }

        if (e.indices == 3) {
            this.model.type = "2";
        }
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
        type: "",
        dateS: "",
        dateE: "",
        finYearS: "",
        finYearE: "",
        shrhKind: "",
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
            url: "/api/Rpt0702/GetSpShrRpt0702",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                finYearS: this.model.finYearS,
                finYearE: this.model.finYearE,
                shrhKind: this.model.shrhKind,
                shrOprCode: this.model.type
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                        aggregate: [
                            { field: "bed", aggregate: "sum" }
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
        amnt1: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        debugger;
        if (this.reportDataSource.length != 0) {
            this.chartModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";
            debugger;
            this.chartModel.categories = this.reportDataSource.options.data.map(function (t: any) {
                return t.fin_year_code
            });

            this.chartModel.typeDesc = this.reportDataSource.options.data.map(function (t: any) {
                return t.opr_code_desc
            })[0];

            this.chartModel.amnt1 = this.reportDataSource.options.data.map(function (t: any) {
                return t.bed
            });

            (this.$refs.chartWindow as any).kendoWidget().center().open()
        }
    }

    mounted() {
        this.getAllFinYear();
    }
} 