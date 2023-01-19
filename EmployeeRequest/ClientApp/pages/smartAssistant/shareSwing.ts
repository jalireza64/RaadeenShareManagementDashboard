import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, generateTimerCountUp, ResponseType, getNotificationType, addToShareholderWatch, saveReportToSmartAssistantCache, readReportFromSmartAssistantCache } from "../../assets/utilities";
import '@progress/kendo-ui/js/kendo.buttongroup.js';
import SvDatepicker from "../../components/datepicker/datepicker.vue";

@Component({
    components: {
        SvDatepicker
    }
})
export default class SmartAssistantShareSwing extends Vue {

    //styles = {
    //    "primary-color": "#26baee",                                         // primary color of component
    //    "secondary-color": "#9fe8fa",                                       // secondary color of component
    //    "in-range-background": "#c9f1fb",                                   // background-color of dates between start and end of range
    //    "icon-background": "#e9ecef",                                       // background-color of icon
    //    "text-color": "#495057",                                            // color of texts and numbers
    //    "hover-color": "#000",                                              // color of hovered dates
    //    "border-color": "#ced4da",                                          // color of border
    //    "z-index": 1000,                                                       // z-index of picker
    //    "disabled-opacity": 0.3,                                               // the opacity of disabled dates
    //    "overlay-color": "transparent",                                        // color of overlay
    //    "main-box-shadow": "1px 1px 8px 1px rgba(116, 116, 116, 0.5)",         // box-shadow of picker
    //    "day-dimensions": "2.08rem",                                           // width and height of dates
    //    "radius": "0.25rem",                                                     // border-radius of dates
    //    "background": "#fff",                                                 // background-color of picker
    //}

    //localeConfigs = {
    //    fa: {
    //        dir: {
    //            input: "rtl",
    //            picker: "rtl"
    //        }
    //    }
    //};

    kendoMessages: any = null;

    async beforeCreate() {
        //@ts-ignore
        this.kendoMessages = await import('../../assets/kendo.messages.fa-IR.js');
    }

    model = {
        reportTime: "00:00",
        //dateRange: "",
        dateS: "",
        dateE: "",
        finalFeeDiffS: -100,
        finalFeeDiffE: 100,
        isShowFilter: false,
        isShowBestSwingerChart: false,
        isShowWorstSwingerChart: false,
        valueAxisForShareQuant: [{
            title: { text: this.$CaptionsLibrary.get('Actual') },
            stack: "buy",
            name: "actualQuant",
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
        }, {
            title: { text: this.$CaptionsLibrary.get('Legal') },
            stack: "buy",
            name: "legalQuant",
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
        categoryAxisShareQuant: {
            color: "currentColor",
            labels: {
                rotation: {
                    angle: "auto"
                }
            },
            categories: [],
            axisCrossingValues: [0, 1000000000000]
        },
        seriesColorsShareQuant: ["goldenrod", "lightblue", "goldenrod", "lightblue"],
        TooltiptemplateForShareQuant: "",
        valueAxisForDailyStatistic: [{
            color: "currentColor",
            line: {
                visible: true
            },
            majorGridLines: {
                visible: true,
                color: "currentColor"
            },
            labels: {
                rotation: "auto"
            }
        }],
        TooltiptemplateForDailyStatistic: "",
        seriesColorsForDailyStatistic: ["green", "red", "gray"],
        valueAxisForQuantTypeStatistic: [{
            color: "currentColor",
            line: {
                visible: true
            },
            majorGridLines: {
                visible: true,
                color: "currentColor"
            },
            labels: {
                visible: true,
                rotation: "auto"
            }
        }],
        TooltiptemplateForQuantTypeStatistic: "",
        seriesColorsForQuantTypeStatistic: ["goldenrod", "lightblue"],
        seriesColors: ["darkorange", "darkorchid", "DodgerBlue", "darkseagreen", "darksalmon", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"],
        TooltiptemplateForShareSwingDiff: "",
        TooltiptemplateForShareSwingFinalFee: "",
        TooltiptemplateForShareSwingFinalFeeRange: "",
        valueAxisForShareSwing: [{
            title: { text: this.$CaptionsLibrary.get('Percent') },
            name: "diff",
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
                format: "{0:n}"
            }
        }, {
            title: { text: this.$CaptionsLibrary.get('Rial') },
            name: "finalFee",
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
        categoryAxisShareSwing: {
            color: "currentColor",
            labels: {
                rotation: {
                    angle: "auto"
                }
            },
            categories: [],
            axisCrossingValues: [0, 1000000000000]
        },
        TooltipForSwingerChart: {
            visible: true,
            format: "{3}: {2:N} %",
            opacity: 1
        },
        xAxisForSwingerChart: {
            title: { text: this.$CaptionsLibrary.get('ShareCount') },
            crosshair: {
                visible: true,
                tooltip: {
                    visible: false,
                    format: "{0:N0}"
                }
            },
            labels: {
                color: "currentColor",
                format: "{0:N0}",
                rotation: "auto"
            },

            plotBands: [{
                from: 0,
                to: 0,
                color: "#00f",
                opacity: 0.05
            }]
        },
        yAxisSwingerChart: {
            title: { text: this.$CaptionsLibrary.get('TransactionCount') },
            crosshair: {
                visible: true,
                tooltip: {
                    visible: false,
                    format: "{0:N0}"
                }
            },
            labels: {
                color: "currentColor",
                format: "{0:N0}",
                rotation: "auto"
            },
            line: {
                width: 0
            }
        },
        seriesColorsSwingerChart: ["goldenrod", "lightblue"]
    };

    detailsColumnsBuy = [
        { field: "BuyerSumShare", title: this.$CaptionsLibrary.get('ShareCount'), format: "{0:##,#;(0:##,#)}", width: "150px" },
        { field: "BuyerAmnt", title: this.$CaptionsLibrary.get('Amount'), format: "{0:##,#;(0:##,#)}", width: "150px" },
        { field: "BuyerCnt", title: this.$CaptionsLibrary.get('TransactionCount'), format: "{0:##,#;(0:##,#)}", width: "200px" }
    ]

    detailsColumnsSell = [
        { field: "SellerSumShare", title: this.$CaptionsLibrary.get('ShareCount'), format: "{0:##,#;(0:##,#)}", width: "150px" },
        { field: "SellerAmnt", title: this.$CaptionsLibrary.get('Amount'), format: "{0:##,#;(0:##,#)}", width: "150px" },
        { field: "SellerCnt", title: this.$CaptionsLibrary.get('TransactionCount'), format: "{0:##,#;(0:##,#)}", width: "200px" }
    ]

    manuModel = {
        ShowMenu: false,
        ShowMenuPositiveDays: false,
        ShowMenuNegativeDays: false,
        ShowMenuZeroDays: false,
        ShowMenuSwinger: false,
        ShowMenuChart: false,
        ShowMenuSwingerChart: false
    }

    shareholderWatchmodel = {
        shrhCode: "",
        shareholderWatchIds: [],
        isAddToShareholderWatchWindowShown: false,
    };

    showAddToShareholderWatchWindow() {
        this.shareholderWatchmodel.shrhCode = this.selectedShareholder;
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

    toggleReport() {
        if (this.manuModel.ShowMenu == false) {
            this.manuModel.ShowMenu = true;
        } else {
            this.manuModel.ShowMenu = false;
        }
    }

    toggleReportChart() {
        if (this.manuModel.ShowMenuChart == false) {
            this.manuModel.ShowMenuChart = true;
        } else {
            this.manuModel.ShowMenuChart = false;
        }
    }

    toggleSwingerChart() {
        if (this.manuModel.ShowMenuSwingerChart == false) {
            this.manuModel.ShowMenuSwingerChart = true;
        } else {
            this.manuModel.ShowMenuSwingerChart = false;
        }
    }

    toggleReportPositiveDays() {
        if (this.manuModel.ShowMenuPositiveDays == false) {
            this.manuModel.ShowMenuPositiveDays = true;
        } else {
            this.manuModel.ShowMenuPositiveDays = false;
        }
    }

    toggleReportNegativeDays() {
        if (this.manuModel.ShowMenuNegativeDays == false) {
            this.manuModel.ShowMenuNegativeDays = true;
        } else {
            this.manuModel.ShowMenuNegativeDays = false;
        }
    }

    toggleReportZeroDays() {
        if (this.manuModel.ShowMenuZeroDays == false) {
            this.manuModel.ShowMenuZeroDays = true;
        } else {
            this.manuModel.ShowMenuZeroDays = false;
        }
    }

    toggleReportSwinger() {
        if (this.manuModel.ShowMenuSwinger == false) {
            this.manuModel.ShowMenuSwinger = true;
        } else {
            this.manuModel.ShowMenuSwinger = false;
        }
    }

    exportChartReport() {
        var selectedTabIndex = (this.$refs.shareSwingChartTab as any).kendoWidget().select().index();
        switch (selectedTabIndex) {
            case 0:
                var chart = (this.$refs.shareSwingChart as any).kendoWidget();
                break;
            case 1:
                var chart = (this.$refs.dailyStatisticChart as any).kendoWidget();
                break;
            case 2:
                var chart = (this.$refs.shareBuyQuantChart as any).kendoWidget();
                break;
            case 3:
                var chart = (this.$refs.quantTypeStatisticChart as any).kendoWidget();
                break;
        }

        chart.exportImage().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "reportChart.png"
            })
        })
    }

    exportChartSwinger() {
        var selectedTabIndex = (this.$refs.swingerChartTab as any).kendoWidget().select().index();
        switch (selectedTabIndex) {
            case 0:
                var chart = (this.$refs.bestShareSwingChart as any).kendoWidget();
                break;
            case 1:
                var chart = (this.$refs.worstShareSwingChart as any).kendoWidget();
                break;
        }

        chart.exportImage().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "swingerChart.png"
            })
        })
    }

    exportExcelPositiveDays() {
        var selectedTabIndex = (this.$refs.positiveDayTab as any).kendoWidget().select().index();
        if (selectedTabIndex == 0) {
            var reportGrid = (this.$refs.positiveDayMaxBuyerGrid as any).kendoWidget();
        } else {
            var reportGrid = (this.$refs.positiveDayMaxSellerGrid as any).kendoWidget();
        }
        reportGrid.saveAsExcel();
    }

    exportExcelNegativeDays() {
        var selectedTabIndex = (this.$refs.negativeDayTab as any).kendoWidget().select().index();
        if (selectedTabIndex == 0) {
            var reportGrid = (this.$refs.negativeDayMaxBuyerGrid as any).kendoWidget();
        } else {
            var reportGrid = (this.$refs.negativeDayMaxSellerGrid as any).kendoWidget();
        }
        reportGrid.saveAsExcel();
    }

    exportExcelZeroDays() {
        var selectedTabIndex = (this.$refs.zeroDayTab as any).kendoWidget().select().index();
        if (selectedTabIndex == 0) {
            var reportGrid = (this.$refs.zeroDayMaxBuyerGrid as any).kendoWidget();
        } else {
            var reportGrid = (this.$refs.zeroDayMaxSellerGrid as any).kendoWidget();
        }
        reportGrid.saveAsExcel();
    }

    exportExcelSwinger() {
        var selectedTabIndex = (this.$refs.swingerTab as any).kendoWidget().select().index();
        if (selectedTabIndex == 0) {
            var reportGrid = (this.$refs.bestSwingerGrid as any).kendoWidget();
        } else {
            var reportGrid = (this.$refs.worstSwingerGrid as any).kendoWidget();
        }
        reportGrid.saveAsExcel();
    }

    positiveDayTabSelect() {
        this.selectedShareholder = null;
        (this.$refs.positiveDayMaxBuyerGrid as any).kendoWidget().clearSelection();
        (this.$refs.positiveDayMaxSellerGrid as any).kendoWidget().clearSelection();
    }

    negativeDayTabSelect() {
        this.selectedShareholder = null;
        (this.$refs.negativeDayMaxBuyerGrid as any).kendoWidget().clearSelection();
        (this.$refs.negativeDayMaxSellerGrid as any).kendoWidget().clearSelection();
    }

    zeroDayTabSelect() {
        this.selectedShareholder = null;
        (this.$refs.zeroDayMaxBuyerGrid as any).kendoWidget().clearSelection();
        (this.$refs.zeroDayMaxSellerGrid as any).kendoWidget().clearSelection();
    }

    gotoTransactionOfShareholder() {
        this.saveToCache();
        this.$router.push("/reports/rptTransactionOfShareholder/" + "&" + "&" + this.selectedShareholder);
    }

    finalFeeDiffChange(e: any) {
        this.model.finalFeeDiffS = e.values[0];
        this.model.finalFeeDiffE = e.values[1];
    }

    reportDataSource: any = [];

    positiveDayMaxBuyerDataSource: any = [];
    positiveDayMaxSellerDataSource: any = [];

    negativeDayMaxBuyerDataSource: any = [];
    negativeDayMaxSellerDataSource: any = [];

    zeroDayMaxBuyerDataSource: any = [];
    zeroDayMaxSellerDataSource: any = [];

    bestSwingerDataSource: any = [];
    worstSwingerDataSource: any = [];

    shareSwingChartDataSource = {};
    seriesForDailyStatistic = [{
        data: []
    }];

    seriesForQuantTypeStatistic = [{
        data: []
    }];

    seriesForBestSwingerChart: any = [{
        data: []
    }];

    seriesForWorstSwingerChart: any = [{
        data: []
    }];

    loadReportDataSource(fromEntity: boolean = true) {
        window.app.$emit(EventType.StartWaiting);
        this.startTimer();
        $.ajax({
            type: "POST",
            url: "/api/ShareSwing/GetShareSwingWithCountAndQuant",
            dataType: "json",
            data: {
                fromEntity: fromEntity,
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
                            data: result.obj.shareSwingDatalist
                        });
                        this.reportDataSource = dataSource;

                        var positiveDayMaxBuyerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.positiveDayDetail.positiveDayMaxBuyerList
                        });
                        this.positiveDayMaxBuyerDataSource = positiveDayMaxBuyerDataSource;

                        var positiveDayMaxSellerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.positiveDayDetail.positiveDayMaxSellerList
                        });
                        this.positiveDayMaxSellerDataSource = positiveDayMaxSellerDataSource;

                        var negativeDayMaxBuyerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.negativeDayDetail.negativeDayMaxBuyerList
                        });
                        this.negativeDayMaxBuyerDataSource = negativeDayMaxBuyerDataSource;

                        var negativeDayMaxSellerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.negativeDayDetail.negativeDayMaxSellerList
                        });
                        this.negativeDayMaxSellerDataSource = negativeDayMaxSellerDataSource;

                        var zeroDayMaxBuyerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.zeroDayDetail.zeroDayMaxBuyerList
                        });
                        this.zeroDayMaxBuyerDataSource = zeroDayMaxBuyerDataSource;

                        var zeroDayMaxSellerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.zeroDayDetail.zeroDayMaxSellerList
                        });
                        this.zeroDayMaxSellerDataSource = zeroDayMaxSellerDataSource;

                        var bestSwingerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.bestSwingerList.bestSwingerList
                        });
                        this.bestSwingerDataSource = bestSwingerDataSource;

                        var worstSwingerDataSource = new kendo.data.DataSource({
                            pageSize: 500,
                            data: result.obj.worstSwingerList.worstSwingerList
                        });
                        this.worstSwingerDataSource = worstSwingerDataSource;

                        this.model.TooltiptemplateForShareSwingDiff = "#= series.name # (#= kendo.toString(value, 'n') # %)";
                        this.model.TooltiptemplateForShareSwingFinalFee = "#= series.name # (#= kendo.toString(value, 'n0') #)";
                        this.model.TooltiptemplateForShareSwingFinalFeeRange = "#= series.name # </br> #= category # </br> <div>(<i class='fa fa-arrow-down'></i>#= kendo.toString(value.from, 'n0') # - #= kendo.toString(value.to, 'n0') #<i class='fa fa-arrow-up'></i>)</div>";

                        this.model.TooltiptemplateForDailyStatistic = "#= series.name # #= category # (#= kendo.toString(value, 'n0') #)";
                        this.model.TooltiptemplateForShareQuant = "#= series.stack # #= series.name # (#= kendo.toString(value, 'n0') #)";
                        this.model.TooltiptemplateForQuantTypeStatistic = "#= series.name # #= category # (#= kendo.toString(value, 'n0') # %)";
                        var newObject = Array<object>();
                        result.obj.shareSwingDatalist.forEach(function (item: any) {

                            if (item.FinalFee == result.obj.maxFinal) {
                                var newItem = {
                                    tblDate: item.TblDate,
                                    finalFee: item.FinalFee,
                                    diff: item.Diff,
                                    buyQuantActual: item.BuyQuantActual,
                                    buyQuantLegal: item.BuyQuantLegal,
                                    sellQuantActual: item.SellQuantActual,
                                    sellQuantLegal: item.SellQuantLegal,
                                    maxFinalFee: item.MaxFinalFee,
                                    minFinalFee: item.MinFinalFee,
                                    extermum: "Max"
                                };
                                newObject.push(newItem)
                            }
                            else if (item.FinalFee == result.obj.minFinal) {
                                var newItem = {
                                    tblDate: item.TblDate,
                                    finalFee: item.FinalFee,
                                    diff: item.Diff,
                                    buyQuantActual: item.BuyQuantActual,
                                    buyQuantLegal: item.BuyQuantLegal,
                                    sellQuantActual: item.SellQuantActual,
                                    sellQuantLegal: item.SellQuantLegal,
                                    maxFinalFee: item.MaxFinalFee,
                                    minFinalFee: item.MinFinalFee,
                                    extermum: "Min"
                                };
                                newObject.push(newItem)
                            }
                            else {
                                var newItem2 = {
                                    tblDate: item.TblDate,
                                    finalFee: item.FinalFee,
                                    diff: item.Diff,
                                    buyQuantActual: item.BuyQuantActual,
                                    buyQuantLegal: item.BuyQuantLegal,
                                    sellQuantActual: item.SellQuantActual,
                                    sellQuantLegal: item.SellQuantLegal,
                                    maxFinalFee: item.MaxFinalFee,
                                    minFinalFee: item.MinFinalFee,
                                };
                                newObject.push(newItem2)
                            }
                        });
                        this.shareSwingChartDataSource = newObject;
                        this.seriesForDailyStatistic = result.obj.dayTypeCountStatisticChartData.map(function (t: any, index: any) {
                            var index = index + 1;
                            return {
                                name: t.Name,
                                data: t.Data.map(function (q: any) {
                                    return {
                                        category: q.Category, value: q.Value
                                    }
                                }),
                                labels: {
                                    visible: index == 3 ? true : false,
                                    background: "transparent",
                                    position: "outsideEnd",
                                    template: "#= category #",
                                    color: "currentColor"
                                }
                            }
                        });
                        this.seriesForQuantTypeStatistic = result.obj.quantChartData.map(function (t: any, index: any) {
                            var index = index + 1;
                            return {
                                name: t.Name,
                                data: t.Data.map(function (q: any) {
                                    return {
                                        category: q.Category, value: q.Value
                                    }
                                }),
                                labels: {
                                    visible: index == 2 ? true : false,
                                    background: "transparent",
                                    position: "outsideEnd",
                                    template: "#= category #",
                                    color: "currentColor"
                                }
                            }
                        });
                        this.seriesForBestSwingerChart = [];
                        this.seriesForBestSwingerChart.push({
                            data: result.obj.bestSwingerList.bestSwingerList.map((t: any) => ({
                                x: t.BuyerSumShare + t.SellerSumShare,
                                y: t.BuyerCnt + t.SellerCnt,
                                size: t.QuantityPercent,
                                category: t.BuyerFullName
                            }))
                        });

                        this.seriesForWorstSwingerChart = [];
                        this.seriesForWorstSwingerChart.push({
                            data: result.obj.worstSwingerList.worstSwingerList.map((t: any) => ({
                                x: t.BuyerSumShare + t.SellerSumShare,
                                y: t.BuyerCnt + t.SellerCnt,
                                size: t.QuantityPercent,
                                category: t.BuyerFullName
                            }))
                        });
                        (this.$refs.FilterWindow as any).kendoWidget().center().close();
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

    diffTemplate() {
        return kendo.template(`
                                
                                <span dir='ltr' class="#: Diff == 0 ? '' : Diff > 0 ? 'buy-mode' : 'sell-mode' #" >
                                    #: Diff + ' %' || ' ' #
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
        const grid = e.sender;
        this.selectedRow = grid.dataItem(grid.select());
    }

    selectedShareholder: any = null;

    positiveDayMaxBuyerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHRH_CODE;
    }

    positiveDayMaxSellerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHA_SHRH_CODE;
    }

    negativeDayMaxBuyerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHRH_CODE;
    }

    negativeDayMaxSellerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHA_SHRH_CODE;
    }

    zeroDayMaxBuyerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHRH_CODE;
    }

    zeroDayMaxSellerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.SHA_SHRH_CODE;
    }

    bestSwingerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.BuyerShrhCode;
    }

    worstSwingerGridSelect(e: any) {
        const grid = e.sender;
        this.selectedShareholder = grid.dataItem(grid.select())?.BuyerShrhCode;
    }

    gotoRptMaxBuyer() {
        this.saveToCache();
        this.$router.push("/reports/rptMaxBuyer/" + this.selectedRow.TblDate.replaceAll("/", ""));
    }

    gotoRptMaxSeller() {
        this.saveToCache();
        this.$router.push("/reports/rptMaxSeller/" + this.selectedRow.TblDate.replaceAll("/", ""));
    }

    saveToCache() {
        saveReportToSmartAssistantCache(this.model, "smartAssistantShareSwingCacheStorage");
    }

    readFromCache() {
        var cacheObject = readReportFromSmartAssistantCache("smartAssistantShareSwingCacheStorage");
        if (cacheObject) {
            this.model = cacheObject.Model;
            //(this.$refs.dateRange as any).setDate([convertToGregorianDate(this.model.dateRange[0]) , convertToGregorianDate(this.model.dateRange[1])]);

            //(this.$refs.dateS as any).setDate((convertToGregorianDate(this.model.dateS)).toString());
            //(this.$refs.dateE as any).setDate((convertToGregorianDate(this.model.dateE)).toString());

            this.loadReportDataSource(false);
        }
    }

    onSelectShareSwingChartTab() {
        (this.$refs.shareSwingChart as any).kendoWidget().redraw();
        (this.$refs.dailyStatisticChart as any).kendoWidget().redraw();
        (this.$refs.shareBuyQuantChart as any).kendoWidget().redraw();
    }

    onSwingerTabSelect(e: any) {
        this.selectedShareholder = null;
        (this.$refs.bestSwingerGrid as any).kendoWidget().clearSelection();
        (this.$refs.worstSwingerGrid as any).kendoWidget().clearSelection();
        this.$nextTick(() => {
            var selectedTabIndex = (this.$refs.swingerTab as any).kendoWidget().select().index();
            (this.$refs.swingerChartTab as any).kendoWidget().select(selectedTabIndex);
        })
    }

    onSwingerChartTabSelect() {
        this.$nextTick(() => {
            var selectedTabIndex = (this.$refs.swingerChartTab as any).kendoWidget().select().index();
            (this.$refs.swingerTab as any).kendoWidget().select(selectedTabIndex);
        })
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

    mounted() {
        debugger;
        var test = (this.$refs.dateRange as any);
        this.readFromCache();
        this.GetMineAndPublicShareholderWatches();
        (this.$refs.shareSwingChartTab as any).kendoWidget().select(0);
        (this.$refs.positiveDayTab as any).kendoWidget().select(0);
        (this.$refs.negativeDayTab as any).kendoWidget().select(0);
        (this.$refs.zeroDayTab as any).kendoWidget().select(0);
        (this.$refs.swingerTab as any).kendoWidget().select(0);
        (this.$refs.swingerTab as any).kendoWidget().select(0)
    }
} 