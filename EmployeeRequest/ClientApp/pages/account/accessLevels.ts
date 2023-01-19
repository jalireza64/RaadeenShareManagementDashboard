import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, OperationType, ResponseType, getNotificationType } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import CryptoJS from "crypto-js";

@Component({
    components: {
        SvDatepicker
    }
})
export default class AccountAccessLevels extends Vue {
    kendoMessages: any = null;

    selectedAccessLevel: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    initialModel = {
        id: 0,
        title: "",
        accessLevelDetailIds: [],
        operationType: OperationType.Add,
        operationTypeDesc: "",
        isShowWindow: false
    };

    accessLevelsModel = { ...this.initialModel };

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/GetAllAccessLevels",
            dataType: "json",
            success: result => {
                if (result != null) {
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 500,
                        data: result
                    });
                    this.reportDataSource = dataSource;
                    (this.$refs.AccessLevelsWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    accessLevelDetails = [];

    getAllAccessLevelDetails() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/GetAllAccessLevelDetails",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.accessLevelDetails = result;
                    (this.$refs.AccessLevelsWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    accessLevels = [];

    showAdd() {
        this.clearForm();
        this.accessLevelsModel.isShowWindow = true;
        this.accessLevelsModel.operationType = OperationType.Add;
        this.accessLevelsModel.operationTypeDesc = this.$CaptionsLibrary.get('Add');
        (this.$refs.AccessLevelsWindow as any).kendoWidget().center().open()
    }

    showEdit() {
        this.accessLevelsModel.isShowWindow = true;
        this.accessLevelsModel.operationType = OperationType.Modify;
        this.accessLevelsModel.operationTypeDesc = this.$CaptionsLibrary.get('Edit');
        this.accessLevelsModel.id = this.selectedAccessLevel.Id;
        this.accessLevelsModel.title = this.selectedAccessLevel.Title;
        this.accessLevelsModel.accessLevelDetailIds = this.selectedAccessLevel.AccessIds.map(function (ids: any) {
            return ids;
        });
        (this.$refs.AccessLevelsWindow as any).kendoWidget().center().open()
    }

    add() {
        debugger;
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/AddAccessLevels",
            data: {
                title: this.accessLevelsModel.title,
                accessList: this.accessLevelsModel.accessLevelDetailIds,
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,getNotificationType(result.ResponseType));
                    (this.$refs.AccessLevelsWindow as any).kendoWidget().close();
                    this.selectedAccessLevel = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }
                
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    modify() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Account/modifyAccessLevel",
            data: {
                id: this.accessLevelsModel.id,
                title: this.accessLevelsModel.title,
                accessList: this.accessLevelsModel.accessLevelDetailIds,
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    (this.$refs.AccessLevelsWindow as any).kendoWidget().close();
                    this.selectedAccessLevel = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }

            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    operation() {
        if (this.accessLevelsModel.operationType == OperationType.Add) {
            this.add()
        } else {
            this.modify();
        }
    }

    remove() {
        debugger;
        window.app.$emit(EventType.StartWaiting);
        this.accessLevelsModel.id = this.selectedAccessLevel.Id;

        $.ajax({
            type: "POST",
            url: "/api/Account/removeAccessLevel",
            data: {
                id: this.accessLevelsModel.id
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    this.selectedAccessLevel = null;
                    this.loadReportDataSource();
                } else {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,
                        getNotificationType(result.ResponseType));
                }

            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    reportGridSelect(e: any) {
        debugger;
        const grid = e.sender;
        this.selectedAccessLevel = grid.dataItem(grid.select());
    }

    clearForm() {
        this.accessLevelsModel = { ...this.initialModel };
    }

    mounted() {
        this.loadReportDataSource();
        this.getAllAccessLevelDetails();
    }
} 