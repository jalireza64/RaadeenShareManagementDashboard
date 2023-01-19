import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, generateTimerCountUp, ResponseType, getNotificationType, saveReportToCache, readReportFromCache } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt43 extends Vue {

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        dateS: "",
        dateE: "",
        finalFeeDiffS: -20,
        finalFeeDiffE: 20,
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

    finalFeeDiffChange(e: any) {
        this.model.finalFeeDiffS = e.values[0];
        this.model.finalFeeDiffE = e.values[1];
    }

    reportDataSource: any = [];

    //chartData = [
    //    { "Date": "1398/01/01", "Close": 40.635, "Volume": 1650185491, "Open": 40.640, "High": 40.680, "Low": 39.090 },
    //    { "Date": "1398/01/02", "Close": 40.130, "Volume": 1979918237, "Open": 40.130, "High": 40.292, "Low": 36.460 },
    //    //{ "Date": "\/Date(1201824000000)\/", "Close": 38.440, "Volume": 1572505911, "Open": 38.440, "High": 38.480, "Low": 36.697 },
    //    //{ "Date": "\/Date(1204329600000)\/", "Close": 38.240, "Volume": 1922276774, "Open": 38.240, "High": 38.290, "Low": 35.940 },
    //    //{ "Date": "\/Date(1207008000000)\/", "Close": 37.031, "Volume": 2078426778, "Open": 37.032, "High": 37.070, "Low": 34.350 },
    //    //{ "Date": "\/Date(1209600000000)\/", "Close": 38.240, "Volume": 1727585885, "Open": 38.250, "High": 38.270, "Low": 34.886 },
    //    //{ "Date": "\/Date(1212278400000)\/", "Close": 38.650, "Volume": 1776948280, "Open": 38.630, "High": 38.680, "Low": 36.700 },
    //    //{ "Date": "\/Date(1214870400000)\/", "Close": 39.900, "Volume": 1456330078, "Open": 39.900, "High": 39.921, "Low": 36.550 },
    //    //{ "Date": "\/Date(1217548800000)\/", "Close": 40.100, "Volume": 1557166494, "Open": 40.095, "High": 40.140, "Low": 38.260 },
    //    //{ "Date": "\/Date(1220227200000)\/", "Close": 39.841, "Volume": 1506305343, "Open": 39.840, "High": 39.910, "Low": 38.240 },
    //    //{ "Date": "\/Date(1222819200000)\/", "Close": 39.859, "Volume": 2034928239, "Open": 39.852, "High": 39.880, "Low": 37.330 },
    //    //{ "Date": "\/Date(1225497600000)\/", "Close": 41.993, "Volume": 1542204312, "Open": 41.990, "High": 42.020, "Low": 38.710 },
    //    //{ "Date": "\/Date(1228089600000)\/", "Close": 42.300, "Volume": 1255678260, "Open": 42.298, "High": 42.310, "Low": 40.360 },
    //    //{ "Date": "\/Date(1230768000000)\/", "Close": 43.290, "Volume": 1685490186, "Open": 43.290, "High": 43.310, "Low": 40.160 },
    //    //{ "Date": "\/Date(1233446400000)\/", "Close": 42.130, "Volume": 1445458017, "Open": 42.040, "High": 42.170, "Low": 40.260 },
    //    //{ "Date": "\/Date(1235865600000)\/", "Close": 42.140, "Volume": 1958550854, "Open": 42.140, "High": 42.300, "Low": 40.190 },
    //    //{ "Date": "\/Date(1238544000000)\/", "Close": 42.860, "Volume": 1533883066, "Open": 42.890, "High": 43.050, "Low": 41.390 },
    //    //{ "Date": "\/Date(1241136000000)\/", "Close": 42.230, "Volume": 2396221596, "Open": 42.240, "High": 42.280, "Low": 38.230 },
    //    //{ "Date": "\/Date(1243814400000)\/", "Close": 39.800, "Volume": 2709886930, "Open": 39.960, "High": 40.000, "Low": 37.160 },
    //    //{ "Date": "\/Date(1246406400000)\/", "Close": 39.000, "Volume": 2091835303, "Open": 38.938, "High": 39.000, "Low": 35.540 },
    //    //{ "Date": "\/Date(1249084800000)\/", "Close": 38.960, "Volume": 1986978146, "Open": 38.970, "High": 39.030, "Low": 36.260 },
    //    //{ "Date": "\/Date(1251763200000)\/", "Close": 40.910, "Volume": 1860762246, "Open": 40.910, "High": 40.950, "Low": 38.320 },
    //    //{ "Date": "\/Date(1254355200000)\/", "Close": 42.880, "Volume": 1974572432, "Open": 42.890, "High": 42.920, "Low": 39.880 },
    //    //{ "Date": "\/Date(1257033600000)\/", "Close": 44.780, "Volume": 1903112379, "Open": 44.770, "High": 44.860, "Low": 41.610 },
    //    //{ "Date": "\/Date(1259625600000)\/", "Close": 44.700, "Volume": 1533161602, "Open": 44.710, "High": 44.760, "Low": 42.880 },
    //    //{ "Date": "\/Date(1262304000000)\/", "Close": 45.360, "Volume": 1823989418, "Open": 45.350, "High": 45.400, "Low": 42.530 },
    //    //{ "Date": "\/Date(1264982400000)\/", "Close": 45.470, "Volume": 1730644867, "Open": 45.485, "High": 45.550, "Low": 42.930 },
    //    //{ "Date": "\/Date(1267401600000)\/", "Close": 44.420, "Volume": 1749294085, "Open": 44.440, "High": 44.440, "Low": 42.060 },
    //    //{ "Date": "\/Date(1270080000000)\/", "Close": 46.590, "Volume": 1171507724, "Open": 46.590, "High": 46.650, "Low": 43.300 },
    //    //{ "Date": "\/Date(1272672000000)\/", "Close": 47.500, "Volume": 1282648621, "Open": 47.500, "High": 47.520, "Low": 45.660 },
    //    //{ "Date": "\/Date(1275350400000)\/", "Close": 47.880, "Volume": 1228561577, "Open": 47.880, "High": 47.920, "Low": 46.160 },
    //    //{ "Date": "\/Date(1277942400000)\/", "Close": 50.640, "Volume": 992870269, "Open": 50.640, "High": 50.654, "Low": 47.470 },
    //    //{ "Date": "\/Date(1280620800000)\/", "Close": 49.020, "Volume": 981208528, "Open": 49.020, "High": 49.060, "Low": 44.390 },
    //    //{ "Date": "\/Date(1283299200000)\/", "Close": 51.631, "Volume": 573031521, "Open": 51.630, "High": 51.680, "Low": 47.810 },
    //    //{ "Date": "\/Date(1285891200000)\/", "Close": 55.010, "Volume": 1103427032, "Open": 54.959, "High": 55.060, "Low": 51.340 },
    //    //{ "Date": "\/Date(1288569600000)\/", "Close": 54.680, "Volume": 995365278, "Open": 54.660, "High": 54.770, "Low": 48.660 },
    //    //{ "Date": "\/Date(1291161600000)\/", "Close": 52.840, "Volume": 577831801, "Open": 52.840, "High": 52.840, "Low": 49.180 },
    //    //{ "Date": "\/Date(1293840000000)\/", "Close": 51.370, "Volume": 849837840, "Open": 51.380, "High": 51.460, "Low": 41.630 },
    //    //{ "Date": "\/Date(1296518400000)\/", "Close": 45.650, "Volume": 569927484, "Open": 45.650, "High": 45.870, "Low": 42.160 }
    //];

    //chartDataSource = new kendo.data.DataSource({
    //    pageSize: 500,
    //    data: this.chartData
    //});

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/RptTelorance/GetSpShrTelorance",
            dataType: "json",
            data: {
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                finalFeeDiffS: this.model.finalFeeDiffS,
                finalFeeDiffE: this.model.finalFeeDiffE
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.result
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
        max: Array<number>(),
        min: Array<number>(),
        final: Array<number>(),
        first: Array<number>(),
        last: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    }

    showChart() {
        (this.$refs.chartWindow as any).kendoWidget().center().open()
        if (this.reportDataSource.length != 0) {
            this.chartModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

            this.chartModel.categories = this.reportDataSource.options.data.map(function (t: any) {
                return t.tbl_date
            });

            this.chartModel.max = this.reportDataSource.options.data.map(function (t: any) {
                return t.max_fee
            });

            this.chartModel.min = this.reportDataSource.options.data.map(function (t: any) {
                return t.min_fee
            });

            this.chartModel.final = this.reportDataSource.options.data.map(function (t: any) {
                return t.final_fee
            });

            this.chartModel.first = this.reportDataSource.options.data.map(function (t: any) {
                return t.first_fee
            });

            this.chartModel.last = this.reportDataSource.options.data.map(function (t: any) {
                return t.last_fee
            });
        }
    }

    diffTemplate() {
        return kendo.template(`
                                
                                <span dir='ltr' class="#: diff == 0 ? '' : diff > 0 ? 'buy-mode' : 'sell-mode' #" >
                                    #: diff + ' %' || ' ' #
                                </span>`);
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

    selectedRow: any = null;

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedRow = grid.dataItem(grid.select());
    }

    gotoRptMaxBuyer() {
        this.saveToCache();
        this.$router.push("/reports/rptMaxBuyer/" + this.selectedRow.tbl_date.replaceAll("/", ""));
    }

    gotoRptMaxSeller() {
        this.saveToCache();
        this.$router.push("/reports/rptMaxSeller/" + this.selectedRow.tbl_date.replaceAll("/", ""));
    }

    saveToCache() {
        saveReportToCache(this.model, this.reportDataSource.options.data, "rpt43CacheStorage");
    }

    readFromCache() {
        var cacheObject = readReportFromCache("rpt43CacheStorage");
        if (cacheObject) {
            this.model = cacheObject.Model;
            this.model.isShowFilter = false;
            this.reportDataSource = cacheObject.DataSource;
        }
    }

    mounted() {
        this.readFromCache();
    }
} 