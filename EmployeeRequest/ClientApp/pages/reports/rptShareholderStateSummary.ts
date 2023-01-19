import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType, getNotificationType, generateTimerCountUp} from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRptShareholderStateSummary extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        finYear: "",
        finYearStartDate: "",
        finYearEndDate: "",
        meetDate: "",
        currentDate: "",
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

    finYearChanged(e: any) {
        this.model.finYearStartDate = e.dataItem.START_DATE;
        this.model.finYearEndDate = e.dataItem.END_DATE;
    }

    toggleReport() {
        if (this.manuModel.ShowMenu == false) {
            this.manuModel.ShowMenu = true;
        } else {
            this.manuModel.ShowMenu = false;
        }
    }

    reportTitle = {
        periodStart: this.$CaptionsLibrary.get('PeriodStart'),
        periodEnd: this.$CaptionsLibrary.get('PeriodEnd'),
        meetDate: this.$CaptionsLibrary.get('Meeting'),
        EffectiveDate: this.$CaptionsLibrary.get('EffectiveDate'),
        capital: this.$CaptionsLibrary.get('Capital')
    };

    detailsColumnsDefinitions = [
        { field: "quantityOfStart", title: this.$CaptionsLibrary.get('ShareCount'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.quantityOfStart ? kendo.toString(data.quantityOfStart.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.quantityOfStart ? kendo.toString(data.quantityOfStart.sum, '0:00,0;(0:00,0)') : 0 #" },
        { field: "financeOfStart", title: this.$CaptionsLibrary.get('Financial'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.financeOfStart ? kendo.toString(data.financeOfStart.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.financeOfStart ? kendo.toString(data.financeOfStart.sum, '0:00,0;(0:00,0)') : 0 #" }
    ]

    detailsColumnsDefinitions2 = [
        { field: "payFinanceOfEndPeriod", title: this.$CaptionsLibrary.get('PayTo'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.payFinanceOfEndPeriod ? kendo.toString(data.payFinanceOfEndPeriod.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.payFinanceOfEndPeriod ? kendo.toString(data.payFinanceOfEndPeriod.sum, '0:00,0;(0:00,0)') : 0 #" },
        { field: "quantityOfEnd", title: this.$CaptionsLibrary.get('ShareCount'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.quantityOfEnd ? kendo.toString(data.quantityOfEnd.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.quantityOfEnd ? kendo.toString(data.quantityOfEnd.sum, '0:00,0;(0:00,0)') : 0 #" },
        { field: "financeOfEnd", title: this.$CaptionsLibrary.get('Financial'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.financeOfEnd ? kendo.toString(data.financeOfEnd.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.financeOfEnd ? kendo.toString(data.financeOfEnd.sum, '0:00,0;(0:00,0)') : 0 #" }

    ]

    detailsColumnsDefinitions3 = [
        { field: "quantityOfMeetDate", title: this.$CaptionsLibrary.get('ShareCount'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.quantityOfMeetDate ? kendo.toString(data.quantityOfMeetDate.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.quantityOfMeetDate ? kendo.toString(data.quantityOfMeetDate.sum, '0:00,0;(0:00,0)') : 0 #" }
    ]

    detailsColumnsDefinitions4 = [
        { field: "assignFinanceOfPrevFinYear", title: this.$CaptionsLibrary.get('AssignProfit'), format: "{0:##,#;(0:##,#)}", width: "150px", footerTemplate: "#: data.assignFinanceOfPrevFinYear ? kendo.toString(data.assignFinanceOfPrevFinYear.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.assignFinanceOfPrevFinYear ? kendo.toString(data.assignFinanceOfPrevFinYear.sum, '0:00,0;(0:00,0)') : 0 #" }
    ]

    detailsColumnsDefinitionsCapital = [
        { field: "capitalInfo04", title: this.$CaptionsLibrary.get('Debt'), format: "{0:##,#;(0:##,#)}", width: "200px", footerTemplate: "#: data.capitalInfo04 ? kendo.toString(data.capitalInfo04.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.capitalInfo04 ? kendo.toString(data.capitalInfo04.sum, '0:00,0;(0:00,0)') : 0 #" },
        { field: "capitalInfo05", title: this.$CaptionsLibrary.get('BankDeposit'), format: "{0:##,#;(0:##,#)}", width: "200px", footerTemplate: "#: data.capitalInfo05 ? kendo.toString(data.capitalInfo05.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.capitalInfo05 ? kendo.toString(data.capitalInfo05.sum, '0:00,0;(0:00,0)') : 0 #" },
        { field: "capitalInfo07", title: this.$CaptionsLibrary.get('RecieveFromDemands'), format: "{0:##,#;(0:##,#)}", width: "200px", footerTemplate: "#: data.capitalInfo07 ? kendo.toString(data.capitalInfo07.sum, '0:00,0;(0:00,0)') : 0 #", aggregates: "sum", groupFooterTemplate: "#: data.capitalInfo07 ? kendo.toString(data.capitalInfo07.sum, '0:00,0;(0:00,0)') : 0 #" }

    ]

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/RptShareholderStateSummary/GetSpShrRptShareholderStateSummary",
            dataType: "json",
            data: {
                watchShareholderIds: this.model.shareholderWatchIds,
                finYear: this.model.finYear,
                meetDate: this.model.meetDate
            },
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.result,
                            group: [{
                                field: "shrh_kind_desc", aggregates: [
                                    { field: "quantityOfStart", aggregate: "sum" },
                                    { field: "quantityOfEnd", aggregate: "sum" },
                                    { field: "financeOfStart", aggregate: "sum" },
                                    { field: "financeOfEnd", aggregate: "sum" },
                                    { field: "quantityOfMeetDate", aggregate: "sum" },
                                    { field: "assignFinanceOfPrevFinYear", aggregate: "sum" },
                                    { field: "payFinanceOfEndPeriod", aggregate: "sum" },
                                    { field: "capitalInfo04", aggregate: "sum" },
                                    { field: "capitalInfo05", aggregate: "sum" },
                                    { field: "capitalInfo07", aggregate: "sum" }
                                ]}],
                            aggregate: [
                                { field: "quantityOfStart", aggregate: "sum" },
                                { field: "quantityOfEnd", aggregate: "sum" },
                                { field: "financeOfStart", aggregate: "sum" },
                                { field: "financeOfEnd", aggregate: "sum" },
                                { field: "quantityOfMeetDate", aggregate: "sum" },
                                { field: "assignFinanceOfPrevFinYear", aggregate: "sum" },
                                { field: "payFinanceOfEndPeriod", aggregate: "sum" },
                                { field: "capitalInfo04", aggregate: "sum" },
                                { field: "capitalInfo05", aggregate: "sum" },
                                { field: "capitalInfo07", aggregate: "sum" }
                            ]
                        });
                        this.reportDataSource = dataSource;
                        this.reportTitle.periodStart = this.$CaptionsLibrary.get('PeriodStart') + " (" + this.model.finYearStartDate + ")";
                        this.reportTitle.periodEnd = this.$CaptionsLibrary.get('PeriodEnd') + " (" + this.model.finYearEndDate + ")";
                        this.reportTitle.meetDate = this.$CaptionsLibrary.get('Meeting') + " (" + this.model.meetDate + ")";
                        this.reportTitle.EffectiveDate = this.$CaptionsLibrary.get('EffectiveDate') + " (" + this.model.currentDate + ")";
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
        reportGrid.setOptions({
            excel: {
                allPages: true
            }
        });
        reportGrid.saveAsExcel();
    }

    finYears = []

    getAllFinYear() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Shared/GetAllFinYearWithDetail",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.finYears = result;
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    gridReordering() {
        debugger;
        var grid = (this.$refs.reportGrid as any).kendoWidget();

        grid.table.kendoSortable({
            filter: ">tbody >tr",
            hint: function (element: any) { //customize the hint
                var table = $('<table style="width: 100%;height: 40px;" class="k-grid k-widget"></table>'),
                    hint;

                table.append(element.clone()); //append the dragged element
                table.css("opacity", 0.7);

                return table; //return the hint element
            },
            cursor: "move",
            placeholder: function (element: any) {
                return $('<tr colspan="1" class="placeholder"></tr>');
            },
            change: function (e:any) {

                debugger
                var skip = grid.dataSource.skip() || 0,
                    oldIndex = e.oldIndex + skip,
                    newIndex = e.newIndex + skip,
                    data = grid.dataSource.data(),
                    dataItem = grid.dataSource.getByUid(e.item.data("uid"));

                grid.dataSource.remove(dataItem);
                grid.dataSource.insert(newIndex, dataItem);
            }
        });
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
        this.getAllFinYear();
    }

    updated() {
        getCurrentDate((result: any) => {
            this.model.currentDate = result.currentDate;
        });
        this.gridReordering();
    }
} 