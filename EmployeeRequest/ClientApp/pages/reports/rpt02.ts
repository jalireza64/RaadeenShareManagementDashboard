import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType, generateTimerCountUp } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt02 extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        shrhKind: "",
        shrQuntS: 0,
        shrQuntE: 0,
        shareS: 0,
        shareE: 0,
        trnsKind: "",
        dateS: "",
        dateE: "",
        relTypeFlag: "",
        shareholderWatchIds: [],
        isShareholderWatchWindowShown: false,
        isShowFilter: false
    };

    watchGridDataBinding() {
        var grid = (this.$refs.watchGrid as any).kendoWidget();
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

    trnsKindArray= [
        { text: this.$CaptionsLibrary.get('Buy') + " " + this.$CaptionsLibrary.get('And') + " " + this.$CaptionsLibrary.get('Sell'), value: '1' },
        { text: this.$CaptionsLibrary.get('FirstShares'), value: '2' },
        { text: this.$CaptionsLibrary.get('Forced'), value: '3' },
        { text: this.$CaptionsLibrary.get('Capital'), value: '4' }
    ]

    shareChange(e: any) {
        this.model.shareS = e.values[0];
        this.model.shareE = e.values[1];
    }

    shrQuntChange(e: any) {
        this.model.shrQuntS = e.values[0];
        this.model.shrQuntE = e.values[1];
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

    relTypeFlagSelect(e: any) {
        if (e.indices == 0) {
            this.model.relTypeFlag = "1";
        }

        if (e.indices == 1) {
            this.model.relTypeFlag = "2";
        }
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

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/Rpt02/GetSpShrRpt02",
            dataType: "json",
            data: {
                watchShareholderIds: this.model.shareholderWatchIds,
                shrhKind: this.model.shrhKind,
                shrQuntS: this.model.shrQuntS,
                shrQuntE: this.model.shrQuntE,
                shareS: this.model.shareS,
                shareE: this.model.shareE,
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                trnsKind: this.model.trnsKind,
                relTypeFlag: this.model.relTypeFlag
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 100,
                            data: result.result,
                            aggregate: [
                                { field: "mojudi_aval", aggregate: "sum" },
                                { field: "saham_kharidar", aggregate: "sum" },
                                { field: "amnt_kharidar", aggregate: "sum" },
                                { field: "saham_forukhteh", aggregate: "sum" },
                                { field: "amnt_forukhteh", aggregate: "sum" },
                                { field: "maande", aggregate: "sum" },
                                { field: "share_prcnt", aggregate: "sum" },
                                { field: "rem_amnt", aggregate: "sum" }
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

    //loadReportDataSource2() {
    //    var that = this;
    //    debugger;
    //    var dataSource = new kendo.data.DataSource({
    //        pageSize: 100,
    //        serverPaging: true,
    //        transport: {
    //            read: function (options) {
    //                // make JSONP request to https://demos.telerik.com/kendo-ui/service/products
    //                $.ajax({
    //                    type: "POST",
    //                    url: "/api/Rpt02/GetSpShrRpt02",
    //                    dataType: "json",
    //                    data: {
    //                        watchShareholder: that.model.shareholderWatchList,
    //                        shrhKind: that.model.shrhKind,
    //                        shrQuntS: that.model.shrQuntS,
    //                        shrQuntE: that.model.shrQuntE,
    //                        shareS: that.model.shareS,
    //                        shareE: that.model.shareE,
    //                        dateS: that.model.dateS,
    //                        dateE: that.model.dateE,
    //                        trnsKind: that.model.trnsKind,
    //                        relTypeFlag: that.model.relTypeFlag
    //                    },

    //                    success: function (result) {
    //                        // notify the data source that the request succeeded
    //                        debugger;
    //                        if (result == null) {
    //                            options.success(result);
    //                            (that.$refs.FilterWindow as any).kendoWidget().center().close() 
    //                        }
                             
    //                    },
    //                    error: function (result) {
    //                        // notify the data source that the request failed
    //                        options.error(result);
    //                    }
    //                });


    //            }
    //        },
    //        aggregate: [
    //            { field: "mojudi_aval", aggregate: "sum" },
    //            { field: "saham_kharidar", aggregate: "sum" },
    //            { field: "amnt_kharidar", aggregate: "sum" },
    //            { field: "saham_forukhteh", aggregate: "sum" },
    //            { field: "amnt_forukhteh", aggregate: "sum" },
    //            { field: "maande", aggregate: "sum" },
    //            { field: "share_prcnt", aggregate: "sum" },
    //            { field: "rem_amnt", aggregate: "sum" }
    //        ]
    //    }); 

    //    that.reportDataSource = dataSource;
    //}

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
        debugger;
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
        this.GetMineAndPublicShareholderWatches();
    }
} 