import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, OperationType, ResponseType, getNotificationType, checkShrhCodeValidity, onlyUnique } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import SvTextpicker from "../../components/textpicker/textpicker.vue";

@Component({
    components: {
        SvDatepicker, SvTextpicker
    }
})
export default class ShareholderWatchIndex extends Vue {
    kendoMessages: any = null;

    selectedShareholderWatch: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    initialModel = {
        id: 0,
        title: "",
        desc: "",
        isDefault: false,
        isPublic: false,
        files: [],
        shareholderCodeList: Array<string>(),
        shareholderCodeListDatasource: Array<string>(),
        operationType: OperationType.Add,
        operationTypeDesc: "",
        isShowWindow: false,
        isShowSync: false
    };

    shareholderWatchModel = { ...this.initialModel };

    shareholderWatchDeselect(e: any) {
        var item = e.dataItem;
        const index = this.shareholderWatchModel.shareholderCodeListDatasource.indexOf(item, 0);
        if (index > -1) {
            this.shareholderWatchModel.shareholderCodeListDatasource.splice(index, 1);
        }
    }

    addToSelectedValues(shrhCode: string) {

        this.shareholderWatchModel.shareholderCodeList.push(shrhCode);
        
        this.$nextTick(() => {
            var widget = (this.$refs.shareholderWatch as any).kendoWidget();
            widget.value(widget.value().concat([shrhCode]));
        });
    }

    selectValue(value: any) {
        if (value.length == 0) {
            return;
        }
        var id = this.addShrhCodeToDataSource(value);
        this.addToSelectedValues(id);
    }

    onInputKeyPress(e: any) {

        var shareholderWatch = (this.$refs.shareholderWatch as any).kendoWidget();
        this.$nextTick(() => {
            if (e.key === "Enter") {

                checkShrhCodeValidity(shareholderWatch.input.val(), (shrhCode: string) => {
                    if (shrhCode.length != 0) {
                        this.selectValue(shrhCode);
                        shareholderWatch.input.val("");
                    } else {
                        //@ts-ignore
                        this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('ShareholderNotFound'), getNotificationType(ResponseType.Warning))
                    }
                });
            }
        });



    }

    addShrhCodeToDataSource(shrhCode: any) {

        if (this.shareholderWatchModel.shareholderCodeListDatasource == null) {
            this.shareholderWatchModel.shareholderCodeListDatasource = Array<string>()

        }

        var duplicateShrhCode = this.shareholderWatchModel.shareholderCodeListDatasource.indexOf(shrhCode);
        if (duplicateShrhCode == -1) {
            this.shareholderWatchModel.shareholderCodeListDatasource.push(shrhCode);
        }

        return shrhCode;
    }

    reportDataSource: any = [];

    loadReportDataSource() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShareholderWatch/GetMineAllShareholderWatches",
            dataType: "json",
            success: result => {
                if (result != null) {
                    if (result.ResponseType === ResponseType.Ok) {
                        var dataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.result
                        });
                        this.reportDataSource = dataSource;
                        (this.$refs.ShareholderWatchesWindow as any).kendoWidget().center().close()
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

    showAdd() {
        this.clearForm();
        this.shareholderWatchModel.isShowWindow = true;
        this.shareholderWatchModel.operationType = OperationType.Add;
        this.shareholderWatchModel.operationTypeDesc = this.$CaptionsLibrary.get('Add');
        (this.$refs.ShareholderWatchesWindow as any).kendoWidget().center().open()
    }

    showEdit() {
        this.clearForm();
        debugger;
        //@ts-ignore
        if (JSON.parse(localStorage.getItem('shrhCodeWatchList')) != null) {
            this.shareholderWatchModel.isShowSync = true;
        }

        this.shareholderWatchModel.isShowWindow = true;
        this.shareholderWatchModel.operationType = OperationType.Modify;
        this.shareholderWatchModel.operationTypeDesc = this.$CaptionsLibrary.get('Edit');
        this.shareholderWatchModel.id = this.selectedShareholderWatch.Id;
        this.shareholderWatchModel.title = this.selectedShareholderWatch.Title;
        this.shareholderWatchModel.desc = this.selectedShareholderWatch.Desc1;
        this.shareholderWatchModel.isDefault = this.selectedShareholderWatch.IsDefault;
        this.shareholderWatchModel.isPublic = this.selectedShareholderWatch.IsPublic;
        debugger;
        this.shareholderWatchModel.shareholderCodeList = this.selectedShareholderWatch.WatchList.split(',').map(function (ids: any) {
            return ids;
        });

        var that = this;
        this.shareholderWatchModel.shareholderCodeList.forEach(function (value) {

            that.selectValue(value)
        });

        (this.$refs.ShareholderWatchesWindow as any).kendoWidget().center().open()
    }

    selectFile(e: any) {
        //@ts-ignore
        var file = document.querySelector('input[type=file]').files[0];
        var reader = new FileReader()
        var that = this;

        if (file.type == "text/plain") {
            reader.onload = function (event) {
                //@ts-ignore
                var listArray = event.target.result.split("\r\n");
                listArray.forEach(function (value: any) {
                    that.selectValue(value)
                });
            }
        } else {
            //@ts-ignore
            this.$root.$children[0].popupNotificationWidget.show(this.$MessagesLibrary.get('FileExtensionIsNotValid'), getNotificationType(ResponseType.Warning))
        }
        reader.readAsText(file);
    }

    removeFile() {
        this.shareholderWatchModel.shareholderCodeList = [];
        this.shareholderWatchModel.shareholderCodeListDatasource = [];
    }

    add() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/ShareholderWatch/AddShareholderWatch",
            data: {
                title: this.shareholderWatchModel.title,
                desc: this.shareholderWatchModel.desc,
                isDefault: this.shareholderWatchModel.isDefault,
                isPublic: this.shareholderWatchModel.isPublic,
                shareholderCodeList: this.shareholderWatchModel.shareholderCodeList
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message,getNotificationType(result.ResponseType));
                    (this.$refs.ShareholderWatchesWindow as any).kendoWidget().close();
                    this.selectedShareholderWatch = null;
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
            url: "/api/ShareholderWatch/modifyShareholderWatch",
            data: {
                id: this.shareholderWatchModel.id,
                title: this.shareholderWatchModel.title,
                desc: this.shareholderWatchModel.desc,
                isDefault: this.shareholderWatchModel.isDefault,
                isPublic: this.shareholderWatchModel.isPublic,
                shareholderCodeList: this.shareholderWatchModel.shareholderCodeList.filter(onlyUnique)
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    (this.$refs.ShareholderWatchesWindow as any).kendoWidget().close();
                    this.selectedShareholderWatch = null;
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
        if (this.shareholderWatchModel.operationType == OperationType.Add) {
            this.add()
        } else {
            this.modify();
        }
    }

    remove() {
        window.app.$emit(EventType.StartWaiting);
        this.shareholderWatchModel.id = this.selectedShareholderWatch.Id;

        $.ajax({
            type: "POST",
            url: "/api/ShareholderWatch/removeShareholderWatch",
            data: {
                id: this.shareholderWatchModel.id
            },
            dataType: "json",
            success: result => {
                if (result.ResponseType === ResponseType.Ok) {
                    //@ts-ignore
                    this.$root.$children[0].popupNotificationWidget.show(result.Message, getNotificationType(result.ResponseType));
                    this.selectedShareholderWatch = null;
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
        const grid = e.sender;
        this.selectedShareholderWatch = grid.dataItem(grid.select());
    }

    clearForm() {
        this.shareholderWatchModel = { ...this.initialModel };
        this.shareholderWatchModel.shareholderCodeList = [];
        this.shareholderWatchModel.shareholderCodeListDatasource = [];
    }

    getListFromLocalStorage() {
        //@ts-ignore
        var shrhCodeList = JSON.parse(localStorage.getItem('shrhCodeWatchList'))
        var that1 = this;
        shrhCodeList.forEach(function (value: any) {
            that1.selectValue(value)
        });
        localStorage.removeItem("shrhCodeWatchList");
    }

    mounted() {
        (this.$refs.shareholderWatch as any).kendoWidget().input.on('keydown', this.onInputKeyPress)
        this.loadReportDataSource();
    }
} 