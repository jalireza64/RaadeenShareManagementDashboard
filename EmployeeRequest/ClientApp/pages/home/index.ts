import { Vue, Component, Watch } from "vue-property-decorator";
import { EventType, getCurrentDate, formatNumber, getIsAutomaticLoadChartData, saveReportToBasePageCache, readReportFromBasePageCache } from "../../assets/utilities";
import SvDatepicker from "../../components/datepicker/datepicker.vue";
import '@progress/kendo-ui/js/kendo.buttongroup.js';

@Component({
    components: {
        SvDatepicker
    }
})
export default class HomeIndex extends Vue {

    rpt05Model = {
        shareS: 0,
        shareE: 100,
        percent: 10,
        effDate: "",
        isShowFilter : false,
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
                rotation: "auto"
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
            axisCrossingValues: [0, 10]
        },
        Tooltiptemplate: "",
        sumShrhActual: Array<number>(),
        sumShrhLegal: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    };
    ShowRpt05DashboardFilter() {
        this.rpt05Model.isShowFilter = true;
        (this.$refs.rpt05DashboardFilterWindow as any).kendoWidget().center().open()
    }
    getSpShrRpt05() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetSpShrRpt05",
            dataType: "json",
            data: {
                shareS: this.rpt05Model.shareS,
                shareE: this.rpt05Model.shareE,
                percent: this.rpt05Model.percent,
                effDate: this.rpt05Model.effDate
            },
            success: result => {
                if (result != null) {
                    this.rpt05Model.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

                    this.rpt05Model.categoryAxis.categories = result.actual.map(function (t: any) {
                        return t.col1
                    });

                    this.rpt05Model.sumShrhActual = result.actual.map(function (t: any) {
                        return t.sum_shrh
                    });

                    this.rpt05Model.sumShrhLegal = result.legal.map(function (t: any) {
                        return t.sum_shrh
                    });

                    saveReportToBasePageCache(this.rpt05Model, "spShrRpt05");

                    (this.$refs.rpt05DashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRpt05DashboardChart() {
        var chart = (this.$refs.rpt05Chart as any).kendoWidget();
        //chart.exportPDF({ paperSize: "A5", landscape: true }).done(function (data: any) {
        //    kendo.saveAs({
        //        dataURI: data,
        //        fileName:"rpt05Chart"
        //    })
        //})

        //chart.exportImage().done(function (data: any) {
        //    kendo.saveAs({
        //        dataURI: data,
        //        fileName: "rpt05Chart.jpg"
        //    })
        //})

        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rpt05Chart.svg"
            })
        })
    }

    rpt43Model = {
        intervalId: 0,
        isAutoRefresh: false,
        dateS: "",
        dateE: "",
        isShowFilter: false,
        valueAxis: [{
            //title: { text: this.$CaptionsLibrary.get('Rial') },
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
        valueAxisForFeeChange: [{
            //title: { text: this.$CaptionsLibrary.get('Rial') },
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
        }],
        Tooltiptemplate: "",
        TooltiptemplateForRange: "",
        TooltiptemplateForFeeChange: "",
        output: Array<object>(),
        seriesColors: ["darkorange", "darkorchid", "darkred", "darkseagreen", "darksalmon", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]

    };

    rpt43DateRangeTypeSelect(e: any) {
        if (e.indices == 0) {
            getCurrentDate((result: any) => {
                this.rpt43Model.dateS = result.beginOfMonthDate;
                this.rpt43Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 1) {
            getCurrentDate((result: any) => {
                this.rpt43Model.dateS = result.currentDate;
                this.rpt43Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 2) {
            getCurrentDate((result: any) => {
                this.rpt43Model.dateS = result.last1WeekDate;
                this.rpt43Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 3) {
            getCurrentDate((result: any) => {
                this.rpt43Model.dateS = result.last1MonthDate;
                this.rpt43Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 4) {
            getCurrentDate((result: any) => {
                this.rpt43Model.dateS = result.last1YearDate;
                this.rpt43Model.dateE = result.currentDate;
            });
        }
    }

    //rpt43SetInterval() {
    //    var that = this;
    //    this.rpt43Model.intervalId = setInterval(function () {
    //        that.getSpShrRpt43();
    //    }, 5000)
    //    this.rpt43Model.isAutoRefresh = true;
    //}
    //rpt43ClearInterval() {
    //    clearInterval(this.rpt43Model.intervalId);
    //    this.rpt43Model.isAutoRefresh = false;
    //}

    ShowRpt43DashboardFilter() {
        this.rpt43Model.isShowFilter = true;
        (this.$refs.rpt43DashboardFilterWindow as any).kendoWidget().center().open()
    }


    getSpShrRpt43() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetSpShrTelorance",
            dataType: "json",
            data: {
                dateS: this.rpt43Model.dateS,
                dateE: this.rpt43Model.dateE
            },
            success: result => {
                if (result != null) {
                    this.rpt43Model.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";
                    this.rpt43Model.TooltiptemplateForFeeChange = "#= series.name # (#= kendo.toString(value, 'n') #%)";
                    this.rpt43Model.TooltiptemplateForRange = "#= series.name # </br> #= category # </br> <div>(<i class='fa fa-arrow-down'></i>#= kendo.toString(value.from, 'n0') # - #= kendo.toString(value.to, 'n0') #<i class='fa fa-arrow-up'></i>)</div>";
                    var newObject = Array<object>();
                    result.dataList.forEach(function (item: any) {
                        if (item.final_fee == result.maxFinal) {
                            var newItem = {
                                tbl_date: item.tbl_date,
                                max_fee: item.max_fee,
                                min_fee: item.min_fee,
                                final_fee: item.final_fee,
                                first_fee: item.first_fee,
                                last_fee: item.last_fee,
                                rangeFee: result.rangeFee,
                                diff: item.diff,
                                extermum : "Max"
                            };
                            newObject.push(newItem)
                        }
                        else if (item.final_fee == result.minFinal) {
                            var newItem = {
                                tbl_date: item.tbl_date,
                                max_fee: item.max_fee,
                                min_fee: item.min_fee,
                                final_fee: item.final_fee,
                                first_fee: item.first_fee,
                                last_fee: item.last_fee,
                                rangeFee: result.rangeFee,
                                diff: item.diff,
                                extermum: "Min"
                            };
                            newObject.push(newItem)
                        }
                        else {
                            var newItem2 = {
                                tbl_date: item.tbl_date,
                                max_fee: item.max_fee,
                                min_fee: item.min_fee,
                                final_fee: item.final_fee,
                                first_fee: item.first_fee,
                                last_fee: item.last_fee,
                                rangeFee: result.rangeFee,
                                diff: item.diff
                            };
                            newObject.push(newItem2)
                        }
                    });

                    this.rpt43Model.output = newObject;
                    saveReportToBasePageCache(this.rpt43Model, "spShrRpt43");
                    (this.$refs.rpt43Tab as any).kendoWidget().select(0);
                    (this.$refs.rpt43Chart as any).kendoWidget().redraw();
                    (this.$refs.rpt43RangeChart as any).kendoWidget().redraw();
                    (this.$refs.rpt43DashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRpt43DashboardChart() {
        var chart = (this.$refs.rpt43Chart as any).kendoWidget();
        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rpt43Chart.svg"
            })
        })
    }

    rpt14Model = {
        effDate: "",
        kind: "1",
        isShowFilter: false,
        series: [{
            data: []
        }],
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
                rotation: "auto"
            }
        }],
        Tooltiptemplate: "",
        //sharePercent: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    };
    ShowRpt14DashboardFilter() {
        this.rpt14Model.isShowFilter = true;
        (this.$refs.rpt14DashboardFilterWindow as any).kendoWidget().center().open()
    }
    kindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.rpt14Model.kind = "1";
        }

        if (e.indices == 1) {
            this.rpt14Model.kind = "2";
        }
    }
    getSpShrRpt14() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetSpShrRpt14WithPastYear",
            dataType: "json",
            data: {
                kind: this.rpt14Model.kind,
                effDate: this.rpt14Model.effDate
            },
            success: result => {
                if (result != null) {
                    this.rpt14Model.Tooltiptemplate = "#= category # (#= series.name #) (#= kendo.toString(value, 'n0') #%)";

                    this.rpt14Model.series = result.map(function (t: any, index: any) {
                        var index = index + 1;
                        return {
                            name: t.Name,
                            data: t.DataOfShareholderCombination.map(function (q: any) {
                                return {
                                    category: q.category, value: q.value
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
                    saveReportToBasePageCache(this.rpt14Model, "spShrRpt14");
                    (this.$refs.rpt14DashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRpt14DashboardChart() {
        var chart = (this.$refs.rpt14Chart as any).kendoWidget();
        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rpt14Chart.svg"
            })
        })
    }

    rpt0702Model = {
        intervalId: 0,
        isAutoRefresh: false,
        type: "",
        typeDesc: "",
        dateS: "",
        dateE: "",
        finYearS: "",
        finYearE: "",
        shrhKind: "",
        isShowFilter: false,
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
        amnt2: Array<number>(),
        amnt3: Array<number>(),
        amnt4: Array<number>(),
        categories: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    };

    rpt0702DateRangeTypeSelect(e: any) {
        if (e.indices == 0) {
            getCurrentDate((result: any) => {
                this.rpt0702Model.dateS = result.beginOfMonthDate;
                this.rpt0702Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 1) {
            getCurrentDate((result: any) => {
                this.rpt0702Model.dateS = result.currentDate;
                this.rpt0702Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 2) {
            getCurrentDate((result: any) => {
                this.rpt0702Model.dateS = result.last1WeekDate;
                this.rpt0702Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 3) {
            getCurrentDate((result: any) => {
                this.rpt0702Model.dateS = result.last1MonthDate;
                this.rpt0702Model.dateE = result.currentDate;
            });
        }

        if (e.indices == 4) {
            getCurrentDate((result: any) => {
                this.rpt0702Model.dateS = result.last1YearDate;
                this.rpt0702Model.dateE = result.currentDate;
            });
        }
    }

    typeSelect0702(e: any) {
        if (e.indices == 0) {
            this.rpt0702Model.type = "1";
        }

        if (e.indices == 1) {
            this.rpt0702Model.type = "3";
        }

        if (e.indices == 2) {
            this.rpt0702Model.type = "4";
        }

        if (e.indices == 3) {
            this.rpt0702Model.type = "2";
        }
    }
    shrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.rpt0702Model.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.rpt0702Model.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.rpt0702Model.shrhKind = "";
        }
    }
    finYears = [];
    getAllFinYear() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetAllFinYear",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.finYears = result;
                    var cnt = this.finYears.length - 1
                    this.$nextTick(() => {
                        (this.$refs.finYearSeason as any).kendoWidget().select(cnt);
                        (this.$refs.finYearSeason as any).kendoWidget().trigger("change");
                        getIsAutomaticLoadChartData((output: any) => {
                            var spShrRptSeasonCacheObject = readReportFromBasePageCache("spShrRptSeason");
                            if (spShrRptSeasonCacheObject) {
                                this.rptSeasonModel = spShrRptSeasonCacheObject.Model;
                                (this.$refs.rptSeasonTab as any).kendoWidget().select(0);
                            } else {
                                if (output.isAutomaticLoadChartData) {
                                    this.getSpShrRptSeason();
                                }
                            }
                        })
                    });
                }
            },
            complete: () => {

                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ShowRpt0702DashboardFilter() {
        this.rpt0702Model.isShowFilter = true;
        (this.$refs.rpt0702DashboardFilterWindow as any).kendoWidget().center().open()
    }
    getSpShrRpt0702() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Rpt0702/GetSpShrRpt0702",
            dataType: "json",
            data: {
                dateS: this.rpt0702Model.dateS,
                dateE: this.rpt0702Model.dateE,
                finYearS: this.rpt0702Model.finYearS,
                finYearE: this.rpt0702Model.finYearE,
                shrhKind: this.rpt0702Model.shrhKind,
                shrOprCode: this.rpt0702Model.type
            },
            success: result => {
                if (result != null) {
                    this.rpt0702Model.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

                    this.rpt0702Model.categories = result.map(function (t: any) {
                        return t.fin_year_code
                    });

                    this.rpt0702Model.typeDesc = result.map(function (t: any) {
                        return t.opr_code_desc
                    })[0];

                    this.rpt0702Model.amnt1 = result.map(function (t: any) {
                        return t.bed
                    });

                    saveReportToBasePageCache(this.rpt0702Model, "spShrRpt0702");
                    (this.$refs.rpt0702DashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRpt0702DashboardChart() {
        var chart = (this.$refs.rpt0702Chart as any).kendoWidget();

        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rpt0702Chart.svg"
            })
        })
    }

    rpt0702AssignModel = {
        type: "",
        typeDesc: "",
        finYearS: "",
        finYearE: "",
        shrhKind: "",
        isShowFilter: false,
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
    };
    typeSelect0702Assign(e: any) {
        if (e.indices == 0) {
            this.rpt0702AssignModel.type = "1";
        }

        if (e.indices == 1) {
            this.rpt0702AssignModel.type = "3";
        }

        if (e.indices == 2) {
            this.rpt0702AssignModel.type = "4";
        }
    }
    shrhKindFlagSelect0702Assign(e: any) {
        if (e.indices == 0) {
            this.rpt0702AssignModel.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.rpt0702AssignModel.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.rpt0702AssignModel.shrhKind = "";
        }
    }
    ShowRpt0702AssignDashboardFilter() {
        this.rpt0702AssignModel.isShowFilter = true;
        (this.$refs.rpt0702AssignDashboardFilterWindow as any).kendoWidget().center().open()
    }
    getSpShrRpt0702Assign() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Rpt0702Assign/GetSpShrRpt0702Assign",
            dataType: "json",
            data: {
                finYearS: this.rpt0702AssignModel.finYearS,
                finYearE: this.rpt0702AssignModel.finYearE,
                shrhKind: this.rpt0702AssignModel.shrhKind,
                shrOprCode: this.rpt0702AssignModel.type
            },
            success: result => {
                if (result != null) {
                    this.rpt0702AssignModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

                    this.rpt0702AssignModel.categories = result.map(function (t: any) {
                        return t.fin_year_code
                    });

                    this.rpt0702AssignModel.typeDesc = result.map(function (t: any) {
                        return t.opr_code_desc
                    })[0];

                    this.rpt0702AssignModel.amnt1 = result.map(function (t: any) {
                        return t.bes
                    });

                    saveReportToBasePageCache(this.rpt0702AssignModel, "spShrRpt0702Assign");
                    (this.$refs.rpt0702AssignDashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRpt0702AssignDashboardChart() {
        var chart = (this.$refs.rpt0702AssignChart as any).kendoWidget();

        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rpt0702AssignChart.svg"
            })
        })
    }

    rptMaxBuyerModel = {
        dateS: "",
        dateE: "",
        shrhKind: "",
        isShowFilter: false,
        valueAxis: [{
            name:"sumShare",
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
            axisCrossingValues: [0, 10]
        },
        Tooltiptemplate: "",
        sumShare: Array<number>(),
        sumAmount: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    };

    rptMaxBuyerDateRangeTypeSelect(e: any) {
        if (e.indices == 0) {
            getCurrentDate((result: any) => {
                this.rptMaxBuyerModel.dateS = result.beginOfMonthDate;
                this.rptMaxBuyerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 1) {
            getCurrentDate((result: any) => {
                this.rptMaxBuyerModel.dateS = result.currentDate;
                this.rptMaxBuyerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 2) {
            getCurrentDate((result: any) => {
                this.rptMaxBuyerModel.dateS = result.last1WeekDate;
                this.rptMaxBuyerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 3) {
            getCurrentDate((result: any) => {
                this.rptMaxBuyerModel.dateS = result.last1MonthDate;
                this.rptMaxBuyerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 4) {
            getCurrentDate((result: any) => {
                this.rptMaxBuyerModel.dateS = result.last1YearDate;
                this.rptMaxBuyerModel.dateE = result.currentDate;
            });
        }
    }

    maxBuyerShrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.rptMaxBuyerModel.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.rptMaxBuyerModel.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.rptMaxBuyerModel.shrhKind = "";
        }
    }
    ShowRptMaxBuyerDashboardFilter() {
        this.rptMaxBuyerModel.isShowFilter = true;
        (this.$refs.rptMaxBuyerDashboardFilterWindow as any).kendoWidget().center().open()
    }
    getSpShrRptMaxBuyer() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetSpShrMaxBuyer",
            dataType: "json",
            data: {
                dateS: this.rptMaxBuyerModel.dateS,
                dateE: this.rptMaxBuyerModel.dateE,
                shrhKind: this.rptMaxBuyerModel.shrhKind
            },
            success: result => {
                if (result != null) {
                    this.rptMaxBuyerModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

                    this.rptMaxBuyerModel.categoryAxis.categories = result.map(function (t: any) {
                        return t.SHRH_CODE
                    });

                    this.rptMaxBuyerModel.sumShare = result.map(function (t: any) {
                        return t.sumshare
                    });

                    this.rptMaxBuyerModel.sumAmount = result.map(function (t: any) {
                        return t.amnt
                    });

                    saveReportToBasePageCache(this.rptMaxBuyerModel, "spShrRptMaxBuyer");
                    (this.$refs.rptMaxBuyerDashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRptMaxBuyerDashboardChart() {
        var chart = (this.$refs.rptMaxBuyerChart as any).kendoWidget();

        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rptMaxBuyerChart.svg"
            })
        })
    }

    rptMaxSellerModel = {
        dateS: "",
        dateE: "",
        shrhKind: "",
        isShowFilter: false,
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
            axisCrossingValues: [0, 10]
        },
        Tooltiptemplate: "",
        sumShare: Array<number>(),
        sumAmount: Array<number>(),
        seriesColors: ["brown", "burlywood", "cadetblue", "chocolate", "coral", "cornflowerblue", "crimson", "darkblue", "darkcyan", "darkgoldenrod", "red", "darkgreen", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]
    };

    rptMaxSellerDateRangeTypeSelect(e: any) {
        if (e.indices == 0) {
            getCurrentDate((result: any) => {
                this.rptMaxSellerModel.dateS = result.beginOfMonthDate;
                this.rptMaxSellerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 1) {
            getCurrentDate((result: any) => {
                this.rptMaxSellerModel.dateS = result.currentDate;
                this.rptMaxSellerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 2) {
            getCurrentDate((result: any) => {
                this.rptMaxSellerModel.dateS = result.last1WeekDate;
                this.rptMaxSellerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 3) {
            getCurrentDate((result: any) => {
                this.rptMaxSellerModel.dateS = result.last1MonthDate;
                this.rptMaxSellerModel.dateE = result.currentDate;
            });
        }

        if (e.indices == 4) {
            getCurrentDate((result: any) => {
                this.rptMaxSellerModel.dateS = result.last1YearDate;
                this.rptMaxSellerModel.dateE = result.currentDate;
            });
        }
    }

    maxSellerShrhKindFlagSelect(e: any) {
        if (e.indices == 0) {
            this.rptMaxSellerModel.shrhKind = "1";
        }

        if (e.indices == 1) {
            this.rptMaxSellerModel.shrhKind = "2";
        }

        if (e.indices == 2) {
            this.rptMaxSellerModel.shrhKind = "";
        }
    }
    ShowRptMaxSellerDashboardFilter() {
        this.rptMaxSellerModel.isShowFilter = true;
        (this.$refs.rptMaxSellerDashboardFilterWindow as any).kendoWidget().center().open()
    }
    getSpShrRptMaxSeller() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetSpShrMaxSeller",
            dataType: "json",
            data: {
                dateS: this.rptMaxSellerModel.dateS,
                dateE: this.rptMaxSellerModel.dateE,
                shrhKind: this.rptMaxSellerModel.shrhKind
            },
            success: result => {
                if (result != null) {
                    this.rptMaxSellerModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";

                    this.rptMaxSellerModel.categoryAxis.categories = result.map(function (t: any) {
                        return t.SHA_SHRH_CODE
                    });

                    this.rptMaxSellerModel.sumShare = result.map(function (t: any) {
                        return t.sumshare
                    });

                    this.rptMaxSellerModel.sumAmount = result.map(function (t: any) {
                        return t.amnt
                    });

                    saveReportToBasePageCache(this.rptMaxSellerModel, "spShrRptMaxSeller");
                    (this.$refs.rptMaxSellerDashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ExportRptMaxSellerDashboardChart() {
        var chart = (this.$refs.rptMaxSellerChart as any).kendoWidget();

        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rptMaxSellerChart.svg"
            })
        })
    }

    rptCurrentDateStateModel = {
        effDate: "",
        isShowFilter: false,
        listForMaxBuyer: Array<number>(),
        listForMaxSeller: Array<number>(),
        currentDateTransactionCnt: 0,
        currentDateTransactionQnt: 0,
        currentDatePay: 0,
        nameOfMaxBuyer: "",
        shareOfMaxBuyer: 0,
        percentOfMaxBuyer: 0,
        nameOfMaxSeller: "",
        shareOfMaxSeller: 0,
        percentOfMaxSeller: 0
   };

    getSpShrRptCurrentDateState() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetCurrentDateState",
            dataType: "json",
            data: {
                effDate: this.rptCurrentDateStateModel.effDate
            },
            success: result => {
                if (result != null) {

                    this.rptCurrentDateStateModel.currentDateTransactionCnt = result.currentDateTransactionCnt;
                    this.rptCurrentDateStateModel.currentDateTransactionQnt = result.currentDateTransactionQnt;
                    this.rptCurrentDateStateModel.currentDatePay = result.currentDatePay;
                    this.rptCurrentDateStateModel.nameOfMaxBuyer = result.nameOfMaxBuyer;
                    this.rptCurrentDateStateModel.shareOfMaxBuyer = result.shareOfMaxBuyer;
                    this.rptCurrentDateStateModel.percentOfMaxBuyer = result.percentOfMaxBuyer;
                    this.rptCurrentDateStateModel.nameOfMaxSeller = result.nameOfMaxSeller;
                    this.rptCurrentDateStateModel.shareOfMaxSeller = result.shareOfMaxSeller;
                    this.rptCurrentDateStateModel.percentOfMaxSeller = result.percentOfMaxSeller;

                    if (result.percentOfMaxBuyer != null) {
                        this.rptCurrentDateStateModel.listForMaxBuyer = [];
                        this.rptCurrentDateStateModel.listForMaxBuyer.push(Math.abs(result.percentOfMaxBuyer), Math.abs(result.percentOfMaxBuyer - 100));
                    }
                    if (result.percentOfMaxSeller != null) {
                        this.rptCurrentDateStateModel.listForMaxSeller = [];
                        this.rptCurrentDateStateModel.listForMaxSeller.push(Math.abs(result.percentOfMaxSeller), Math.abs(result.percentOfMaxSeller - 100));
                    }

                    saveReportToBasePageCache(this.rptCurrentDateStateModel, "spShrRptCurrentDateState");
                    (this.$refs.rptCurrentDateStateDashboardFilterWindow as any).kendoWidget().center().close()
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }
    ShowRptCurrentDateStateDashboardFilter() {
        this.rptCurrentDateStateModel.isShowFilter = true;
        (this.$refs.rptCurrentDateStateDashboardFilterWindow as any).kendoWidget().center().open()
    }
    //intervalId = 0;

    //setInterval() {
    //    var that = this;
    //    this.intervalId = setInterval(function () {
    //        if (that.rpt0702Model.isAutoRefresh) {
    //            that.getSpShrRpt0702();
    //        }
    //        if (that.rpt43Model.isAutoRefresh) {
    //            that.getSpShrRpt43();
    //        }
            
    //    }, 5000)
    //    this.rpt0702Model.isAutoRefresh = true;
    //}
    //clearInterval() {
    //    clearInterval(this.intervalId);
    //}


    rptSeasonModel = {
        intervalId: 0,
        isAutoRefresh: false,
        finYear: "",
        isShowFilter: false,
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
        output: Array<object>(),
        pastYearOutput: Array<object>(),
        outputGroup: Array<object>(),
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]

    };

    ShowRptSeasonDashboardFilter() {
        this.rptSeasonModel.isShowFilter = true;
        (this.$refs.rptSeasonDashboardFilterWindow as any).kendoWidget().center().open()
    }


    getSpShrRptSeason() {
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/RptSeason/GetSpShrRptSeasonDashboardWithPastFinYear",
            dataType: "json",
            data: {
                finYear: this.rptSeasonModel.finYear
            },
            success: result => {
                if (result != null) {
                    this.rptSeasonModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";
                    var newObject = Array<object>();
                        result.dataList.forEach(function (item: any) {
                            if (item.qnt == result.max) {
                                var newItem = {
                                    months: item.months,
                                    qnt: item.qnt,
                                    extermum: "Max"
                                };
                                newObject.push(newItem)
                            }
                            else if (item.qnt == result.min) {
                                var newItem = {
                                    months: item.months,
                                    qnt: item.qnt,
                                    extermum: "Min"
                                };
                                newObject.push(newItem)
                            }
                            else {
                                newObject.push(item)
                            }
                        });

                    this.rptSeasonModel.output = newObject;
                    this.rptSeasonModel.pastYearOutput = result.pastDataList;
                    (this.$refs.rptSeasonTab as any).kendoWidget().select(0);
                    (this.$refs.rptSeasonChart as any).kendoWidget().redraw();
                    (this.$refs.rptSeasonRadarChart as any).kendoWidget().redraw();
                    saveReportToBasePageCache(this.rptSeasonModel, "spShrRptSeason");
                    (this.$refs.rptSeasonDashboardFilterWindow as any).kendoWidget().center().close()

                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });

        //$.ajax({
        //    type: "POST",
        //    url: "/api/RptSeason/GetSpShrRptSeasonGroupDashboard",
        //    dataType: "json",
        //    data: {
        //        finYear: this.rptSeasonModel.finYear
        //    },
        //    success: result => {
        //        if (result != null) {
        //            this.rptSeasonModel.Tooltiptemplate = "#= series.name # (#= kendo.toString(value, 'n0') #)";
        //            var newObject = Array<object>();
        //            result.dataList.forEach(function (item: any) {
        //                if (item.qnt == result.max) {
        //                    var newItem = {
        //                        season: item.season,
        //                        qnt: item.qnt,
        //                        extermum: "Max"
        //                    };
        //                    newObject.push(newItem)
        //                }
        //                else if (item.qnt == result.min) {
        //                    var newItem = {
        //                        season: item.season,
        //                        qnt: item.qnt,
        //                        extermum: "Min"
        //                    };
        //                    newObject.push(newItem)
        //                }
        //                else {
        //                    newObject.push(item)
        //                }
        //            });

        //            this.rptSeasonModel.outputGroup = newObject;

        //            (this.$refs.rptSeasonDashboardFilterWindow as any).kendoWidget().center().close()

        //        }
        //    },
        //    complete: () => {
        //        window.app.$emit(EventType.EndWaiting);
        //    }
        //});
    }
    ExportRptSeasonDashboardChart() {
        var chart = (this.$refs.rptSeasonChart as any).kendoWidget();
        chart.exportSVG().done(function (data: any) {
            kendo.saveAs({
                dataURI: data,
                fileName: "rptSeasonChart.svg"
            })
        })
    }
    //shrTransactionGroupByYearDataSource: any = new kendo.data.DataSource({});
    rptShrTransactionGroupByYear = {
        dataList: new kendo.data.DataSource({}),
        Tooltiptemplate: "",
        sumQntPerDay : 0,
        sumCntPerDay : 0,
        qntPerDayTypeDesc : "",
        cntPerDayTypeDesc : "",
        qntPerDayTypeColor : "",
        cntPerDayTypeColor : "",
        isQntPerDayTypeUp : true,
        isCntPerDayTypeUp : true,
        listForSparkline: new kendo.data.DataSource({}),
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]

    }

    getShrTransactionGroupByYear() {
        window.app.$emit(EventType.StartWaiting);
        this.rptShrTransactionGroupByYear.sumQntPerDay = 0;
        this.rptShrTransactionGroupByYear.sumCntPerDay = 0;
        $.ajax({
            type: "POST",
            url: "/api/Home/GetShrTransactionGroupByYear",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.rptShrTransactionGroupByYear.Tooltiptemplate = "(#= kendo.toString(value, 'n0') #)";
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 2,
                        data: result.dataList,
                        serverPaging: false
                    });
                    this.rptShrTransactionGroupByYear.dataList = dataSource;

                    for (var i = 0; i < 2; i++) {
                        //@ts-ignore
                        this.rptShrTransactionGroupByYear.sumQntPerDay = result.dataList[i].qntperday - this.rptShrTransactionGroupByYear.sumQntPerDay;
                        //@ts-ignore
                        this.rptShrTransactionGroupByYear.sumCntPerDay = result.dataList[i].cntperday - this.rptShrTransactionGroupByYear.sumCntPerDay;
                    }

                    var sparklineDataSource = new kendo.data.DataSource({
                        data: result.dataList,
                        serverPaging: false
                    });

                    this.rptShrTransactionGroupByYear.listForSparkline = sparklineDataSource;

                    if (this.rptShrTransactionGroupByYear.sumQntPerDay > 0) {
                        this.rptShrTransactionGroupByYear.qntPerDayTypeDesc = "کاهش";
                            //@ts-ignore
                            document.getElementById("qntColorYear").style["color"] = "red";
                            this.$nextTick(() => {
                                this.rptShrTransactionGroupByYear.isQntPerDayTypeUp = false;
                            })
                        this.rptShrTransactionGroupByYear.isQntPerDayTypeUp = false;
                        } else {
                        this.rptShrTransactionGroupByYear.qntPerDayTypeDesc = "افزایش";
                            //@ts-ignore
                            document.getElementById("qntColorYear").style["color"] = "green";
                            this.$nextTick(() => {
                                this.rptShrTransactionGroupByYear.isQntPerDayTypeUp = true;
                            })       
                        }

                    if (this.rptShrTransactionGroupByYear.sumCntPerDay > 0) {
                        this.rptShrTransactionGroupByYear.cntPerDayTypeDesc = "کاهش";
                            //@ts-ignore
                            document.getElementById("cntColorYear").style["color"] = "red";

                        this.rptShrTransactionGroupByYear.isCntPerDayTypeUp = false;
                        } else {
                        this.rptShrTransactionGroupByYear.cntPerDayTypeDesc = "افزایش";
                            //@ts-ignore
                            document.getElementById("cntColorYear").style["color"] = "green";

                        this.rptShrTransactionGroupByYear.isCntPerDayTypeUp = true;
                    }
                    saveReportToBasePageCache(this.rptShrTransactionGroupByYear, "shrTransactionGroupByYear");
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    rptShrTransactionGroupByMonth = {
        dataList: new kendo.data.DataSource({}),
        sumQntPerDay: 0,
        sumCntPerDay: 0,
        qntPerDayTypeDesc: "",
        cntPerDayTypeDesc: "",
        qntPerDayTypeColor: "",
        cntPerDayTypeColor: "",
        isQntPerDayTypeUp: true,
        isCntPerDayTypeUp: true,
        listForSparkline: new kendo.data.DataSource({}),
        Tooltiptemplate: "",
        seriesColors: ["darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgrey", "dodgerblue", "firebrick", "forestgreen", "gold", "goldenrod", "hotpink", "black", "indianred", "indigo", "limegreen", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "gray", "mediumturquoise", "mediumvioletred", "midnightblue", "olivedrab", "orangered", "orchid", "peru", "plum", "powderblue", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "sienna", "skyblue", "slateblue", "slategrey", "springgreen", "steelblue", "tan", "thistle", "tomato", "turquoise", "violet", "yellowgreen"]

    }

    getShrTransactionGroupByMonth() {
        window.app.$emit(EventType.StartWaiting);
        this.rptShrTransactionGroupByMonth.sumQntPerDay = 0;
        this.rptShrTransactionGroupByMonth.sumCntPerDay = 0;
        $.ajax({
            type: "POST",
            url: "/api/Home/GetShrTransactionGroupByMonth",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.rptShrTransactionGroupByMonth.Tooltiptemplate = "(#= kendo.toString(value, 'n0') #)";
                    var dataSource = new kendo.data.DataSource({
                        pageSize: 2,
                        data: result.dataList,
                        serverPaging: false
                    });
                    this.rptShrTransactionGroupByMonth.dataList = dataSource;
                    for (var i = 0; i < 2; i++) {
                        //@ts-ignore
                        this.rptShrTransactionGroupByMonth.sumQntPerDay = result.dataList[i].qntperday - this.rptShrTransactionGroupByMonth.sumQntPerDay;
                        //@ts-ignore
                        this.rptShrTransactionGroupByMonth.sumCntPerDay = result.dataList[i].cntperday - this.rptShrTransactionGroupByMonth.sumCntPerDay;
                    }

                    var sparklineDataSource = new kendo.data.DataSource({
                        data: result.dataList,
                        serverPaging: false
                    });

                    this.rptShrTransactionGroupByMonth.listForSparkline = sparklineDataSource;

                    if (this.rptShrTransactionGroupByMonth.sumQntPerDay > 0) {
                        this.rptShrTransactionGroupByMonth.qntPerDayTypeDesc = "کاهش";
                        //@ts-ignore
                        document.getElementById("qntColorMonth").style["color"] = "red";
                        this.$nextTick(() => {
                            this.rptShrTransactionGroupByMonth.isQntPerDayTypeUp = false;
                        })
                        this.rptShrTransactionGroupByMonth.isQntPerDayTypeUp = false;
                    } else {
                        this.rptShrTransactionGroupByMonth.qntPerDayTypeDesc = "افزایش";
                        //@ts-ignore
                        document.getElementById("qntColorMonth").style["color"] = "green";
                        this.$nextTick(() => {
                            this.rptShrTransactionGroupByMonth.isQntPerDayTypeUp = true;
                        })
                    }

                    if (this.rptShrTransactionGroupByMonth.sumCntPerDay > 0) {
                        this.rptShrTransactionGroupByMonth.cntPerDayTypeDesc = "کاهش";
                        //@ts-ignore
                        document.getElementById("cntColorMonth").style["color"] = "red";

                        this.rptShrTransactionGroupByMonth.isCntPerDayTypeUp = false;
                    } else {
                        this.rptShrTransactionGroupByMonth.cntPerDayTypeDesc = "افزایش";
                        //@ts-ignore
                        document.getElementById("cntColorMonth").style["color"] = "green";

                        this.rptShrTransactionGroupByMonth.isCntPerDayTypeUp = true;
                    }
                    saveReportToBasePageCache(this.rptShrTransactionGroupByMonth, "shrTransactionGroupByMonth");
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    getRptShrTransaction() {
        this.getShrTransactionGroupByYear();
        this.getShrTransactionGroupByMonth();
        (this.$refs.transactionTab as any).kendoWidget().select(0);
    }

    manuModel = {
        ShowRptShrTransaction: false,
        ShowSpShrRpt43: false,
        ShowSpShrRpt14: false,
        ShowSpShrRpt05: false,
        ShowSpShrRptMaxSeller: false,
        ShowSpShrRptMaxBuyer: false,
        ShowSpShrRptCurrentDateState: false,
        ShowSpShrRptSeason: false,
        ShowSpShrRpt0702: false,
        ShowSpShrRpt0702Assign: false,
        ShowShareholderCompletionRateInformation: false
    }

    toggleRptShrTransaction() {
        if (this.manuModel.ShowRptShrTransaction == false) {
            this.manuModel.ShowRptShrTransaction = true;
        } else {
            this.manuModel.ShowRptShrTransaction = false;
        }     
    }

    toggleSpShrRpt43() {
        if (this.manuModel.ShowSpShrRpt43 == false) {
            this.manuModel.ShowSpShrRpt43 = true;
        } else {
            this.manuModel.ShowSpShrRpt43 = false;
        } 
    }

    toggleSpShrRpt14() {
        if (this.manuModel.ShowSpShrRpt14 == false) {
            this.manuModel.ShowSpShrRpt14 = true;
        } else {
            this.manuModel.ShowSpShrRpt14 = false;
        } 
    }

    toggleSpShrRpt05() {
        if (this.manuModel.ShowSpShrRpt05 == false) {
            this.manuModel.ShowSpShrRpt05 = true;
        } else {
            this.manuModel.ShowSpShrRpt05 = false;
        }
    }

    toggleSpShrRptMaxSeller() {
        if (this.manuModel.ShowSpShrRptMaxSeller == false) {
            this.manuModel.ShowSpShrRptMaxSeller = true;
        } else {
            this.manuModel.ShowSpShrRptMaxSeller = false;
        }
    }

    toggleSpShrRptMaxBuyer() {
        if (this.manuModel.ShowSpShrRptMaxBuyer == false) {
            this.manuModel.ShowSpShrRptMaxBuyer = true;
        } else {
            this.manuModel.ShowSpShrRptMaxBuyer = false;
        }
    }

    toggleSpShrRptCurrentDateState() {
        if (this.manuModel.ShowSpShrRptCurrentDateState == false) {
            this.manuModel.ShowSpShrRptCurrentDateState = true;
        } else {
            this.manuModel.ShowSpShrRptCurrentDateState = false;
        }
    }

    toggleSpShrRptSeason() {
        if (this.manuModel.ShowSpShrRptSeason == false) {
            this.manuModel.ShowSpShrRptSeason = true;
        } else {
            this.manuModel.ShowSpShrRptSeason = false;
        }
    }

    toggleSpShrRpt0702() {
        if (this.manuModel.ShowSpShrRpt0702 == false) {
            this.manuModel.ShowSpShrRpt0702 = true;
        } else {
            this.manuModel.ShowSpShrRpt0702 = false;
        }
    }

    toggleSpShrRpt0702Assign() {
        if (this.manuModel.ShowSpShrRpt0702Assign == false) {
            this.manuModel.ShowSpShrRpt0702Assign = true;
        } else {
            this.manuModel.ShowSpShrRpt0702Assign = false;
        }
    }

    toggleShareholderCompletionRateInformation() {
        if (this.manuModel.ShowShareholderCompletionRateInformation == false) {
            this.manuModel.ShowShareholderCompletionRateInformation = true;
        } else {
            this.manuModel.ShowShareholderCompletionRateInformation = false;
        }
    }

    lastReadDateOfBBS = "";

    getSystemStatusData() {
        window.app.$emit(EventType.StartWaiting);

        $.ajax({
            type: "POST",
            url: "/api/Shared/GetSystemStatusData",
            dataType: "json",
            success: result => {
                if (result != null) {

                    this.lastReadDateOfBBS = result.TblDate;
                    this.rptCurrentDateStateModel.effDate = this.lastReadDateOfBBS;
                    getIsAutomaticLoadChartData((output: any) => {
                        var spShrRptCurrentDateStateCacheObject = readReportFromBasePageCache("spShrRptCurrentDateState");
                        if (spShrRptCurrentDateStateCacheObject) {
                            this.rptCurrentDateStateModel = spShrRptCurrentDateStateCacheObject.Model;
                        } else {
                            if (output.isAutomaticLoadChartData) {
                                this.getSpShrRptCurrentDateState();
                            }
                        }
                    })
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    completionRateInformationModel = {
        cellphoneModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        addressModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        natCodeModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        birthDateModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        shrhAccModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        spBankCodeModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        emailModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        zipCodeModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        },
        telNoModel: {
            title: "",
            Count: 0,
            percent: Array<number>()
        }
    };

    getShareholderCompletionRateInformation() {
        debugger;
        window.app.$emit(EventType.StartWaiting);
        $.ajax({
            type: "POST",
            url: "/api/Home/GetShareholderCompletionRateInformation",
            dataType: "json",
            success: result => {
                if (result != null) {
                    this.completionRateInformationModel.cellphoneModel.title = result.dataList.CellphoneModel.CompletionTitle;
                    this.completionRateInformationModel.cellphoneModel.Count = result.dataList.CellphoneModel.CompletionCount;
                    this.completionRateInformationModel.cellphoneModel.percent = [];
                    this.completionRateInformationModel.cellphoneModel.percent.push(Math.abs(result.dataList.CellphoneModel.CompletionPercent), Math.abs(result.dataList.CellphoneModel.InCompletionPercent))

                    this.completionRateInformationModel.addressModel.title = result.dataList.AddressModel.CompletionTitle;
                    this.completionRateInformationModel.addressModel.Count = result.dataList.AddressModel.CompletionCount;
                    this.completionRateInformationModel.addressModel.percent = [];
                    this.completionRateInformationModel.addressModel.percent.push(Math.abs(result.dataList.AddressModel.CompletionPercent), Math.abs(result.dataList.AddressModel.InCompletionPercent))

                    this.completionRateInformationModel.natCodeModel.title = result.dataList.NatCodeModel.CompletionTitle;
                    this.completionRateInformationModel.natCodeModel.Count = result.dataList.NatCodeModel.CompletionCount;
                    this.completionRateInformationModel.natCodeModel.percent = [];
                    this.completionRateInformationModel.natCodeModel.percent.push(Math.abs(result.dataList.NatCodeModel.CompletionPercent), Math.abs(result.dataList.NatCodeModel.InCompletionPercent))

                    this.completionRateInformationModel.birthDateModel.title = result.dataList.BirthDateModel.CompletionTitle;
                    this.completionRateInformationModel.birthDateModel.Count = result.dataList.BirthDateModel.CompletionCount;
                    this.completionRateInformationModel.birthDateModel.percent = [];
                    this.completionRateInformationModel.birthDateModel.percent.push(Math.abs(result.dataList.BirthDateModel.CompletionPercent), Math.abs(result.dataList.BirthDateModel.InCompletionPercent))

                    this.completionRateInformationModel.shrhAccModel.title = result.dataList.ShrhAccModel.CompletionTitle;
                    this.completionRateInformationModel.shrhAccModel.Count = result.dataList.ShrhAccModel.CompletionCount;
                    this.completionRateInformationModel.shrhAccModel.percent = [];
                    this.completionRateInformationModel.shrhAccModel.percent.push(Math.abs(result.dataList.ShrhAccModel.CompletionPercent), Math.abs(result.dataList.ShrhAccModel.InCompletionPercent))

                    this.completionRateInformationModel.spBankCodeModel.title = result.dataList.SpBankCodeModel.CompletionTitle;
                    this.completionRateInformationModel.spBankCodeModel.Count = result.dataList.SpBankCodeModel.CompletionCount;
                    this.completionRateInformationModel.spBankCodeModel.percent = [];
                    this.completionRateInformationModel.spBankCodeModel.percent.push(Math.abs(result.dataList.SpBankCodeModel.CompletionPercent), Math.abs(result.dataList.SpBankCodeModel.InCompletionPercent))

                    this.completionRateInformationModel.emailModel.title = result.dataList.EmailModel.CompletionTitle;
                    this.completionRateInformationModel.emailModel.Count = result.dataList.EmailModel.CompletionCount;
                    this.completionRateInformationModel.emailModel.percent = [];
                    this.completionRateInformationModel.emailModel.percent.push(Math.abs(result.dataList.EmailModel.CompletionPercent), Math.abs(result.dataList.EmailModel.InCompletionPercent))

                    this.completionRateInformationModel.zipCodeModel.title = result.dataList.ZipCodeModel.CompletionTitle;
                    this.completionRateInformationModel.zipCodeModel.Count = result.dataList.ZipCodeModel.CompletionCount;
                    this.completionRateInformationModel.zipCodeModel.percent = [];
                    this.completionRateInformationModel.zipCodeModel.percent.push(Math.abs(result.dataList.ZipCodeModel.CompletionPercent), Math.abs(result.dataList.ZipCodeModel.InCompletionPercent))

                    this.completionRateInformationModel.telNoModel.title = result.dataList.TelNoModel.CompletionTitle;
                    this.completionRateInformationModel.telNoModel.Count = result.dataList.TelNoModel.CompletionCount;
                    this.completionRateInformationModel.telNoModel.percent = [];
                    this.completionRateInformationModel.telNoModel.percent.push(Math.abs(result.dataList.TelNoModel.CompletionPercent), Math.abs(result.dataList.TelNoModel.InCompletionPercent))

                    saveReportToBasePageCache(this.completionRateInformationModel,"shareholderCompletionRateInformation")
                }
            },
            complete: () => {
                window.app.$emit(EventType.EndWaiting);
            }
        });
    }

    isAutomaticLoadChartData = false;

    mounted() {
        $('.app').removeClass('back');

        this.getAllFinYear();

        getCurrentDate((result: any) => {
            this.rpt43Model.dateS = result.beginOfMonthDate;
            this.rpt43Model.dateE = result.currentDate;
            this.rpt05Model.effDate = result.currentDate;
            this.rpt14Model.effDate = result.currentDate;
            this.rpt0702Model.dateS = result.beginOfMonthDate;
            this.rpt0702Model.dateE = result.currentDate;
            this.rptMaxBuyerModel.dateS = result.beginOfMonthDate;
            this.rptMaxBuyerModel.dateE = result.currentDate;
            this.rptMaxSellerModel.dateS = result.beginOfMonthDate;
            this.rptMaxSellerModel.dateE = result.currentDate;

            getIsAutomaticLoadChartData((output: any) => {

                var shareholderCompletionRateInformationCacheObject = readReportFromBasePageCache("shareholderCompletionRateInformation");
                if (shareholderCompletionRateInformationCacheObject) {
                    this.completionRateInformationModel = shareholderCompletionRateInformationCacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getShareholderCompletionRateInformation();
                    }
                }

                var spShrRpt05CacheObject = readReportFromBasePageCache("spShrRpt05");
                if (spShrRpt05CacheObject) {
                    this.rpt05Model = spShrRpt05CacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRpt05();
                    }
                }

                var spShrRpt43CacheObject = readReportFromBasePageCache("spShrRpt43");
                if (spShrRpt43CacheObject) {
                    this.rpt43Model = spShrRpt43CacheObject.Model;
                    (this.$refs.rpt43Tab as any).kendoWidget().select(0);
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRpt43();
                    }
                }

                var spShrRpt14CacheObject = readReportFromBasePageCache("spShrRpt14");
                if (spShrRpt14CacheObject) {
                    this.rpt14Model = spShrRpt14CacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRpt14();
                    }
                }

                var spShrRpt0702CacheObject = readReportFromBasePageCache("spShrRpt0702");
                if (spShrRpt0702CacheObject) {
                    this.rpt0702Model = spShrRpt0702CacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRpt0702();
                    }
                }

                var spShrRpt0702AssignCacheObject = readReportFromBasePageCache("spShrRpt0702Assign");
                if (spShrRpt0702AssignCacheObject) {
                    this.rpt0702AssignModel = spShrRpt0702AssignCacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRpt0702Assign();
                    }
                }

                var spShrRptMaxBuyerCacheObject = readReportFromBasePageCache("spShrRptMaxBuyer");
                if (spShrRptMaxBuyerCacheObject) {
                    this.rptMaxBuyerModel = spShrRptMaxBuyerCacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRptMaxBuyer();
                    }
                }

                var spShrRptMaxSellerCacheObject = readReportFromBasePageCache("spShrRptMaxSeller");
                if (spShrRptMaxSellerCacheObject) {
                    this.rptMaxSellerModel = spShrRptMaxSellerCacheObject.Model;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getSpShrRptMaxSeller();
                    }
                }

                var shrTransactionGroupByYearCacheObject = readReportFromBasePageCache("shrTransactionGroupByYear");
                if (shrTransactionGroupByYearCacheObject) {
                    this.rptShrTransactionGroupByYear = shrTransactionGroupByYearCacheObject.Model;
                    this.rptShrTransactionGroupByYear.dataList = shrTransactionGroupByYearCacheObject.DataSource;
                    this.rptShrTransactionGroupByYear.listForSparkline = shrTransactionGroupByYearCacheObject.ChartDataSource;
                    (this.$refs.transactionTab as any).kendoWidget().select(0);
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getShrTransactionGroupByYear();
                    }
                }

                var shrTransactionGroupByMonthCacheObject = readReportFromBasePageCache("shrTransactionGroupByMonth");
                if (shrTransactionGroupByMonthCacheObject) {
                    this.rptShrTransactionGroupByMonth = shrTransactionGroupByMonthCacheObject.Model;
                    this.rptShrTransactionGroupByMonth.dataList = shrTransactionGroupByMonthCacheObject.DataSource;
                    this.rptShrTransactionGroupByMonth.listForSparkline = shrTransactionGroupByMonthCacheObject.ChartDataSource;
                } else {
                    if (output.isAutomaticLoadChartData) {
                        this.getShrTransactionGroupByMonth();
                    }
                }

            });



            //getIsAutomaticLoadChartData((output: any) => {
            //    if (output.isAutomaticLoadChartData == true) {                  
            ////        this.getShareholderCompletionRateInformation();
            ////        this.getSpShrRpt05();
            ////        this.getSpShrRpt43();
            ////        this.getSpShrRpt14();
            ////        this.getSpShrRpt0702();
            ////        this.getSpShrRpt0702Assign();
            ////        this.getSpShrRptMaxBuyer();
            ////        this.getSpShrRptMaxSeller();
            //        this.getRptShrTransaction();
            //    }
            //});
        });

        this.getSystemStatusData();
        //(this.$refs.profilePanel as any).kendoWidget().expand($("#item1"), false);
        //$('#item1 > span').addClass('k-state-selected');

        //(this.$refs.alternatePanel as any).kendoWidget().expand($("#item2"), false);
        //$('#item2 > span').addClass('k-state-selected');

    }
} 