import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, ResponseType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class ReportsRpt17 extends Vue {
    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        type: "",
        finYearS: "",
        finYearE: "",
        shareholderWatchIds: [],
        isShareholderWatchWindowShown: false,
        isShowFilter: false
    };

    shrOprCodeArray= [
        { text: this.$CaptionsLibrary.get('Profit'), value: '1' },
        { text: this.$CaptionsLibrary.get('Priority'), value: '2' },
        { text: this.$CaptionsLibrary.get('Forced'), value: '0' },
        { text: this.$CaptionsLibrary.get('Capital'), value: '4' }
    ]

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
        $.ajax({
            type: "POST",
            url: "/api/Rpt17/GetSpShrRpt17",
            dataType: "json",
            data: {
                finYearS: this.model.finYearS,
                finYearE: this.model.finYearE,
                shrOprCode: this.model.type,
                watchShareholderIds: this.model.shareholderWatchIds
            },
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result,
                        aggregate: [
                            { field: "bes1", aggregate: "sum" },
                            { field: "bes2", aggregate: "sum" },
                            { field: "bed1", aggregate: "sum" },
                            { field: "bed2", aggregate: "sum" },
                            { field: "remain", aggregate: "sum" }
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

    mounted() {
        this.GetMineAndPublicShareholderWatches();
        this.getAllFinYear();
    }
} 