import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType, generateTimerCountUp, addToShareholderWatch, saveReportToCache, readReportFromCache  } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptMaxBuyer extends Vue {
    @Prop()
    filter!: string;

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

    shareholderWatchmodel = {
        shrhCode: "",
        shareholderWatchIds: [],
        isAddToShareholderWatchWindowShown: false,
    };

    showAddToShareholderWatchWindow() {
        this.shareholderWatchmodel.shrhCode = this.selectedShareholder.SHRH_CODE;
        this.shareholderWatchmodel.isAddToShareholderWatchWindowShown = true;
        (this.$refs.addToShareholderWatchWindow as any).kendoWidget().center().open()
    }

    addToShareholderWatch() {
        window.app.$emit(EventType.StartWaiting);
        addToShareholderWatch(this.shareholderWatchmodel.shrhCode, this.shareholderWatchmodel.shareholderWatchIds, (result: boolean) => {
            //@ts-ignore
            if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    (this.$refs.addToShareholderWatchWindow as any).kendoWidget().close();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
            }
            window.app.$emit(EventType.EndWaiting);
        })
    }

    model = {
        reportTime: "00:00",
        dateS: "",
        dateE: "",
        shrhKind: "",
        share: 100000,
        fullname: "",
        shareholderWatchIds: [],
        isShareholderWatchWindowShown: false,
        isShowFilter: false
    };

    watchGridDataBinding() {
        //var grid = (this.$refs.watchGrid as any).kendoWidget();
        //@ts-ignore
        window.record = 0;
    }

    shareholderWatch() {
        this.model.isShareholderWatchWindowShown = true;
        (this.$refs.shareholderWatchWindow as any).kendoWidget().center().open()
    }

    watchGridDataSource: any = [];

    transactionTypeTemplate() {
        return kendo.template(`
                                
                                <span class="#: TransactionType == '01' ? 'buy-mode' : 'sell-mode' #" >
                                    #: TransactionTypeDesc || ' ' #
                                </span>`);
    }

    shareholderKindTemplate() {
        return kendo.template(`
                                
                                <span>
                                    #: Fullname || ' ' #
                                </span>
                                <i style="float: left;vertical-align:middle" class="#: ShareholderKind != null ? 'fas' : '' # #: ShareholderKind == 1 ? 'fa-user-tie'
                                    : ShareholderKind == 2 ? 'fa-building'
                                    : '' #"
                                   title="#: ShareholderKind == 1 ? '${this.$CaptionsLibrary.get("Actual")}' 
                                    : ShareholderKind == 2 ? '${this.$CaptionsLibrary.get("Legal")}' 
                                    : '' #">
                                </i>`);
    }

    loadWatchGridDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetShareholderWatchesInformation",
            dataType: "json",
            data: {
                watchShareholderIds: this.model.shareholderWatchIds
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        //pageSize: 5,
                        data: result
                    });
                    this.watchGridDataSource = dataSource;
                }
            },
            complete: () => {
                debugger;
                this.model.isShareholderWatchWindowShown = true;
                (this.$refs.shareholderWatchWindow as any).kendoWidget().center().open()
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    shareholderWatches = new kendo.data.DataSource({})

    GetMineAndPublicShareholderWatches() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetMineAndPublicShareholderWatches",
            dataType: "json",
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            data: result.result,
                            group: [
                                // group by "category" and then by "subcategory"
                                { field: "Group" }
                            ]
                        });
                        this.shareholderWatches = dataSource;
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
            url: "/api/RptMaxBuyer/GetSpShrRptMaxBuyer",
            dataType: "json",
            data: {
                watchShareholderIds: this.model.shareholderWatchIds,
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                shrhKind: this.model.shrhKind,
                share: this.model.share,
                fullname: this.model.fullname
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

    //template = kendo.template(`<kendo-sparkline :type='pie' :tooltip-visible='true' :chart-area-height=70 :theme='sass'><kendo-sparkline-series-item :data='[80,20]'></kendo-sparkline-series-item></kendo-sparkline>`);

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
                return t.SHRH_CODE
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

    selectedShareholder: any = null;

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select());
    }

    gotoTransactionOfShareholder() {
        this.saveToCache();
        this.$router.push("/reports/rptTransactionOfShareholder/" + "&" + "&" + this.selectedShareholder.SHRH_CODE);
    }

    autoLoadReport() {
        if (this.filter != undefined) {
            var filterItems = this.filter.split("&");
            this.model.dateS = filterItems[0].substring(0, 4) + "/" + filterItems[0].substring(4, 6) + "/" + filterItems[0].substring(6, 8);
            this.model.dateE = filterItems[0].substring(0, 4) + "/" + filterItems[0].substring(4, 6) + "/" + filterItems[0].substring(6, 8);
            this.model.share = 0;
            this.loadReportDataSource();
        }
    }

    saveToCache() {
        saveReportToCache(this.model, this.reportDataSource.options.data, "rptMaxBuyerCacheStorage");
    }

    readFromCache() {
        var cacheObject = readReportFromCache("rptMaxBuyerCacheStorage");
        if (cacheObject) {
            this.model = cacheObject.Model;
            this.model.isShowFilter = false;
            this.reportDataSource = cacheObject.DataSource;
        } else {
            this.autoLoadReport();
        }
    }

    mounted() {
        this.GetMineAndPublicShareholderWatches();
        //this.autoLoadReport();
        this.readFromCache();
    }
} 