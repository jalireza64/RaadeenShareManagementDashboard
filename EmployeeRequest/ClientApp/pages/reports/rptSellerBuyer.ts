import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType, generateTimerCountUp, addToShareholderWatch } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptSellerBuyer extends Vue {
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

    shareQuntTypeSelect(e: any) {

        if (e.indices == 0) {
            this.model.shareQuntType = "S>B";
        }

        if (e.indices == 1) {
            this.model.shareQuntType = "B>S";
        }

        if (e.indices == 2) {
            this.model.shareQuntType = "S=B";
        }

        if (e.indices == 3) {
            this.model.shareQuntType = "all";
        }
    }

    averageFeeTypeSelect(e: any) {

        if (e.indices == 0) {
            this.model.averageFeeType = "S>B";
        }

        if (e.indices == 1) {
            this.model.averageFeeType = "B>S";
        }

        if (e.indices == 2) {
            this.model.averageFeeType = "S=B";
        }

        if (e.indices == 3) {
            this.model.averageFeeType = "all";
        }
    }

    shareCountTypeSelect(e: any) {

        if (e.indices == 0) {
            this.model.shareCountType = "S>B";
        }

        if (e.indices == 1) {
            this.model.shareCountType = "B>S";
        }

        if (e.indices == 2) {
            this.model.shareCountType = "S=B";
        }

        if (e.indices == 3) {
            this.model.shareCountType = "all";
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
        dateSBuy: "",
        dateEBuy: "",
        shrhKind: "",
        shareQuntType: "",
        averageFeeType: "",
        shareCountType: "",
        sellQnt: 100000,
        buyQnt: 100000,
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
            url: "/api/RptSellerBuyer/GetSpShrRptSellerBuyer",
            dataType: "json",
            data: {
                watchShareholderIds: this.model.shareholderWatchIds,
                shareCountType: this.model.shareCountType,
                shareQuntType: this.model.shareQuntType,
                averageFeeType: this.model.averageFeeType,
                dateS: this.model.dateS,
                dateE: this.model.dateE,
                dateSBuy: this.model.dateSBuy,
                dateEBuy: this.model.dateEBuy,
                shrhKind: this.model.shrhKind,
                sellQnt: this.model.sellQnt,
                buyQnt: this.model.buyQnt
            },
            success: result => {
                debugger;
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result.result,
                        aggregate: [
                            { field: "seller_cnt", aggregate: "sum" },
                            { field: "seller_sumshare", aggregate: "sum" },
                            { field: "buyer_cnt", aggregate: "sum" },
                            { field: "buyer_sumshare", aggregate: "sum" }
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

    exportPdf() {
        var reportGrid = (this.$refs.reportGrid as any).kendoWidget();
        reportGrid.saveAsPDF();
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

    //Dates: [] | undefined;

    selectedShareholder: any = null;

    reportGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select());
    }

    gotoTransactionOfShareholder() {

        //this.Dates?.push(this.model.dateS.replaceAll("/", ""))

        this.$router.push("/reports/rptTransactionOfShareholder/" + "&" + "&" + this.selectedShareholder.SHRH_CODE);
    }

    mounted() {
        this.GetMineAndPublicShareholderWatches();
    }
} 