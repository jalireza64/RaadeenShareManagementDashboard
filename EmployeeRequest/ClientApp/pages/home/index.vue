<template>
    <div class="rtl">
        <div>
            <kendo-window ref="rpt05DashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label for="shareS">{{$CaptionsLibrary.get("FromSharePercent")}}</label>
                        <kendo-numerictextbox v-model.number="rpt05Model.shareS" class="width-100"
                                              id="shareS"
                                              :min="0"
                                              :max="100"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                    </div>
                    <div class="form-group">
                        <label for="shareE">{{$CaptionsLibrary.get("ToSharePercent")}}</label>
                        <kendo-numerictextbox v-model.number="rpt05Model.shareE" class="width-100"
                                              id="shareE"
                                              :min="0"
                                              :max="100"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                    </div>
                    <div class="form-group">
                        <label for="percent">{{$CaptionsLibrary.get("FromGap")}}</label>
                        <kendo-numerictextbox v-model.number="rpt05Model.percent" class="width-100"
                                              id="percent"
                                              :min="0"
                                              :max="100"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                    </div>
                    <div class="form-group">
                        <label for="effDate">{{$CaptionsLibrary.get("EffectiveDate")}}</label>
                        <sv-datepicker v-model="rpt05Model.effDate" name="effDate" id="effDate"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRpt05" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rpt43DashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label>{{$CaptionsLibrary.get("Range")}}</label>
                        <kendo-buttongroup @select="rpt43DateRangeTypeSelect">
                            <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Default")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("1Day")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("1Week")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("1Month")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="4" style="width:100%">{{$CaptionsLibrary.get("1Year")}}</kendo-buttongroup-button>
                        </kendo-buttongroup>
                    </div>
                    <div class="form-group">
                        <label for="dateS">{{$CaptionsLibrary.get("FromTransDate")}}</label>
                        <sv-datepicker v-model="rpt43Model.dateS" name="dateS" id="dateS"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <label for="dateE">{{$CaptionsLibrary.get("ToTransDate")}}</label>
                        <sv-datepicker v-model="rpt43Model.dateE" name="dateE" id="dateE"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRpt43" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rptSeasonDashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label for="finYearSeason">{{$CaptionsLibrary.get("From") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                        <kendo-combobox v-model="rptSeasonModel.finYear"
                                        id="finYearSeason"
                                        ref="finYearSeason"
                                        name="finYearSeason"
                                        :data-source="finYears"
                                        :filter="'contains'"
                                        class="width-100">
                        </kendo-combobox>
                    </div>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRptSeason" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rpt14DashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label for="kindFlag">{{$CaptionsLibrary.get("Status")}}</label>
                        <kendo-buttongroup id="kindFlag" :index="0" v-model="rpt14Model.kind" @select="kindFlagSelect">
                            <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Yearly")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Monthly")}}</kendo-buttongroup-button>
                        </kendo-buttongroup>
                    </div>
                    <div class="form-group">
                        <label for="effDate">{{$CaptionsLibrary.get("EffectiveDate")}}</label>
                        <sv-datepicker v-model="rpt14Model.effDate" name="effDate" id="effDate"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRpt14" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rptCurrentDateStateDashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label for="effDate">{{$CaptionsLibrary.get("EffectiveDate")}}</label>
                        <sv-datepicker v-model="rptCurrentDateStateModel.effDate" name="effDate" id="effDate"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRptCurrentDateState" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rptMaxBuyerDashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label>{{$CaptionsLibrary.get("Range")}}</label>
                        <kendo-buttongroup @select="rptMaxBuyerDateRangeTypeSelect">
                            <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Default")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("1Day")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("1Week")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("1Month")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="4" style="width:100%">{{$CaptionsLibrary.get("1Year")}}</kendo-buttongroup-button>
                        </kendo-buttongroup>
                    </div>
                    <div class="form-group">
                        <label for="dateS">{{$CaptionsLibrary.get("FromDate")}}</label>
                        <sv-datepicker v-model="rptMaxBuyerModel.dateS" name="dateS" id="dateS"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <label for="dateE">{{$CaptionsLibrary.get("ToDate")}}</label>
                        <sv-datepicker v-model="rptMaxBuyerModel.dateE" name="dateE" id="dateE"></sv-datepicker>
                    </div>
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="rptMaxBuyerModel.shrhKind" @select="maxBuyerShrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRptMaxBuyer" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <kendo-window ref="rptMaxSellerDashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                <div class="container">
                    <div class="form-group">
                        <label>{{$CaptionsLibrary.get("Range")}}</label>
                        <kendo-buttongroup @select="rptMaxSellerDateRangeTypeSelect">
                            <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Default")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("1Day")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("1Week")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("1Month")}}</kendo-buttongroup-button>
                            <kendo-buttongroup-button selected-value="4" style="width:100%">{{$CaptionsLibrary.get("1Year")}}</kendo-buttongroup-button>
                        </kendo-buttongroup>
                    </div>
                    <div class="form-group">
                        <label for="dateS">{{$CaptionsLibrary.get("FromDate")}}</label>
                        <sv-datepicker v-model="rptMaxSellerModel.dateS" name="dateS" id="dateS"></sv-datepicker>
                    </div>
                    <div class="form-group">
                        <label for="dateE">{{$CaptionsLibrary.get("ToDate")}}</label>
                        <sv-datepicker v-model="rptMaxSellerModel.dateE" name="dateE" id="dateE"></sv-datepicker>
                    </div>
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="rptMaxSellerModel.shrhKind" @select="maxSellerShrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                    <div class="form-group">
                        <kendo-button @click.prevent="getSpShrRptMaxSeller" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                    </div>
                </div>
            </kendo-window>
            <div class="container-new">
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowRptShrTransaction == false" style="float:right;margin:5px;position:absolute">
                                <i class="fa fa-fire"></i>
                                {{$CaptionsLibrary.get('CountAndQuantTransaction')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleRptShrTransaction">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowRptShrTransaction == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getRptShrTransaction">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div>
                        <kendo-tabstrip ref="transactionTab">
                            <ul>
                                <li>
                                    {{$CaptionsLibrary.get('Year')}}
                                </li>
                                <li>
                                    {{$CaptionsLibrary.get('Month')}}
                                </li>
                            </ul>
                            <div>
                                <div class="form-group break-line" style="text-align:justify">
                                    <label>{{$MessagesLibrary.get("AvgOfTransactionCountWithComparisonOfLastYearPerDay")}}</label>
                                </div>
                                <br />
                                <div class="form-group break-line">
                                    <kendo-listview class="k-block k-info-colored" :data-source="rptShrTransactionGroupByYear.dataList" :template="'<div class=form-group><label>سال #:year#:</label></div><div class=form-group style=margin-right:70px><label>#:new Intl.NumberFormat().format(qntperday)# سهم و #:new Intl.NumberFormat().format(cntperday)# معامله در روز</label></div>'">

                                    </kendo-listview>
                                    <kendo-pager :data-source="rptShrTransactionGroupByYear.dataList"
                                                 :input="false"
                                                 :page-sizes="false"
                                                 :numeric="false"
                                                 :responsive="true"
                                                 :info="false">
                                    </kendo-pager>
                                </div>
                                <br />
                                <div class="form-group">
                                    <kendo-sparkline :type="'area'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :data-source="rptShrTransactionGroupByYear.listForSparkline"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :tooltip-format="'{0:##,#}'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :category-field="'year'" :tooltip-template="rptShrTransactionGroupByYear.Tooltiptemplate" :field="'qntperday'" :k-style="'smooth'"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                                <br /><br />
                                <div class="form-group" style="text-align:justify">
                                    <label>شما به طور میانگین با <span id="qntColorYear">{{rptShrTransactionGroupByYear.qntPerDayTypeDesc}}&nbsp;<span v-show="rptShrTransactionGroupByYear.isQntPerDayTypeUp"><i class="fa fa-arrow-circle-up"></i></span><span v-show="!rptShrTransactionGroupByYear.isQntPerDayTypeUp"><i class="fa fa-arrow-circle-down"></i></span></span> خرید و فروش <span>{{new Intl.NumberFormat().format(Math.abs(rptShrTransactionGroupByYear.sumQntPerDay))}}</span> سهمی و <span id="cntColorYear">{{rptShrTransactionGroupByYear.cntPerDayTypeDesc}}&nbsp;<span v-show="rptShrTransactionGroupByYear.isCntPerDayTypeUp"><i class="fa fa-arrow-circle-up"></i></span><span v-show="!rptShrTransactionGroupByYear.isCntPerDayTypeUp"><i class="fa fa-arrow-circle-down"></i></span></span> <span>{{new Intl.NumberFormat().format(Math.abs(rptShrTransactionGroupByYear.sumCntPerDay))}}</span> معامله ای به ازای هر روز نسبت به سال گذشته مواجه شده اید</label>
                                </div>

                            </div>
                            <div>
                                <div class="form-group break-line" style="text-align:justify">
                                    <label>{{$MessagesLibrary.get("AvgOfTransactionCountWithComparisonOfLastMonthPerDay")}}</label>
                                </div>
                                <br />
                                <div class="form-group break-line">
                                    <kendo-listview class="k-block k-info-colored" :data-source="rptShrTransactionGroupByMonth.dataList" :template="'<div class=form-group><label>ماه  #:monthDesc#  سال  #:year# :</label></div><div class=form-group style=margin-right:70px><label>#:new Intl.NumberFormat().format(qntperday)# سهم و #:new Intl.NumberFormat().format(cntperday)# معامله در روز</label></div>'">
                                    </kendo-listview>
                                    <kendo-pager :data-source="rptShrTransactionGroupByMonth.dataList"
                                                 :input="false"
                                                 :page-sizes="false"
                                                 :numeric="false"
                                                 :responsive="true"
                                                 :info="false">
                                    </kendo-pager>
                                </div>
                                <br />
                                <div class="form-group">
                                    <kendo-sparkline :type="'area'"
                                                     :series-colors="rptShrTransactionGroupByMonth.seriesColors"
                                                     :data-source="rptShrTransactionGroupByMonth.listForSparkline"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :tooltip-format="'{0:##,#}'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :category-field="'monthDesc'" :tooltip-template="rptShrTransactionGroupByYear.Tooltiptemplate" :field="'qntperday'" :k-style="'smooth'"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                                <br /><br /><br />
                                <div class="form-group" style="text-align:justify">
                                    <label>شما به طور میانگین با <span id="qntColorMonth">{{rptShrTransactionGroupByMonth.qntPerDayTypeDesc}}&nbsp;<span v-show="rptShrTransactionGroupByMonth.isQntPerDayTypeUp"><i class="fa fa-arrow-circle-up"></i></span><span v-show="!rptShrTransactionGroupByMonth.isQntPerDayTypeUp"><i class="fa fa-arrow-circle-down"></i></span></span> خرید و فروش <span>{{new Intl.NumberFormat().format(Math.abs(rptShrTransactionGroupByMonth.sumQntPerDay))}}</span> سهمی و <span id="cntColorMonth">{{rptShrTransactionGroupByMonth.cntPerDayTypeDesc}}&nbsp;<span v-show="rptShrTransactionGroupByMonth.isCntPerDayTypeUp"><i class="fa fa-arrow-circle-up"></i></span><span v-show="!rptShrTransactionGroupByMonth.isCntPerDayTypeUp"><i class="fa fa-arrow-circle-down"></i></span></span> <span>{{new Intl.NumberFormat().format(Math.abs(rptShrTransactionGroupByMonth.sumCntPerDay))}}</span> معامله ای به ازای هر روز نسبت به ماه گذشته مواجه شده اید</label>
                                </div>
                            </div>
                        </kendo-tabstrip>
                    </div>
                </div>
                <div class="bs-docs-example k-content box600-1">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRpt43 == false" style="float:right;margin:5px;position:absolute">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('ShareAmountSwing')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRpt43">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt43 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRpt43">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt43 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRpt43DashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt43 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRpt43DashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div>
                        <kendo-tabstrip ref="rpt43Tab">
                            <ul>
                                <li>
                                    {{$CaptionsLibrary.get("Fee")+" "+$CaptionsLibrary.get('Final')}}
                                </li>
                                <li>
                                    {{$CaptionsLibrary.get('UpAndDownRange')}}
                                </li>
                                <li>
                                    {{$CaptionsLibrary.get("Percent")+" "+$CaptionsLibrary.get("Change")+" "+$CaptionsLibrary.get("Fee")+" "+$CaptionsLibrary.get("Final")}}
                                </li>
                            </ul>
                            <div>
                                <div class="form-group">
                                    <kendo-chart :title-text="$CaptionsLibrary.get('ShareAmountSwing')"
                                                 ref="rpt43Chart"
                                                 :data-source="rpt43Model.output"
                                                 :series-defaults-tooltip-visible="true"
                                                 :series-defaults-tooltip-color="'currentColor'"
                                                 :series-defaults-notes-label-color="'black'"
                                                 :series-defaults-notes-icon-background="'lightgray'"
                                                 :series-defaults-notes-icon-border-color="'lightgray'"
                                                 :series-defaults-notes-line-color="'lightgray'"
                                                 :series-colors="rpt43Model.seriesColors"
                                                 :tooltip-visible="true"
                                                 :value-axis="rpt43Model.valueAxis"
                                                 :category-axis-labels-rotation-angle="'auto'"
                                                 :category-axis-color="'currentColor'"
                                                 :zoomable-mousewheel-lock="'y'"
                                                 :pannable-lock="'y'"
                                                 :title-color="'currentColor'"
                                                 :title-position="'top'"
                                                 :chart-area-background="''"
                                                 :chart-area-height="350"
                                                 :legend-position="'bottom'"
                                                 :legend-labels-color="'currentColor'"
                                                 :legend-inactive-items-labels-color="'grey'"
                                                 :series-defaults-type="'column'"
                                                 :theme="'sass'">
                                        <kendo-chart-series-item :category-field="'tbl_date'" :tooltip-template="rpt43Model.Tooltiptemplate" :field="'first_fee'" :name="$CaptionsLibrary.get('First')" :type="'area'"></kendo-chart-series-item>
                                        <kendo-chart-series-item :tooltip-template="rpt43Model.Tooltiptemplate" :field="'last_fee'" :name="$CaptionsLibrary.get('Last')" :type="'area'"></kendo-chart-series-item>
                                        <kendo-chart-series-item :tooltip-template="rpt43Model.Tooltiptemplate" :field="'final_fee'" :name="$CaptionsLibrary.get('Final')" :type="'line'" :k-style="'smooth'" :markers-visible="false" :note-text-field="'extermum'"></kendo-chart-series-item>

                                    </kendo-chart>
                                </div>
                            </div>
                            <div>
                                <div class="form-group">
                                    <kendo-chart :title-text="$CaptionsLibrary.get('ShareAmountSwing')"
                                                 ref="rpt43RangeChart"
                                                 :data-source="rpt43Model.output"
                                                 :series-defaults-tooltip-visible="true"
                                                 :series-defaults-tooltip-color="'currentColor'"
                                                 :series-defaults-notes-label-color="'black'"
                                                 :series-defaults-notes-icon-background="'lightgray'"
                                                 :series-defaults-notes-icon-border-color="'lightgray'"
                                                 :series-defaults-notes-line-color="'lightgray'"
                                                 :series-colors="rpt43Model.seriesColors"
                                                 :tooltip-visible="true"
                                                 :value-axis="rpt43Model.valueAxis"
                                                 :category-axis-labels-rotation-angle="'auto'"
                                                 :category-axis-color="'currentColor'"
                                                 :zoomable-mousewheel-lock="'y'"
                                                 :pannable-lock="'y'"
                                                 :height="'100px'"
                                                 :title-color="'currentColor'"
                                                 :title-position="'top'"
                                                 :chart-area-background="''"
                                                 :chart-area-height="350"
                                                 :legend-position="'bottom'"
                                                 :legend-labels-color="'currentColor'"
                                                 :legend-inactive-items-labels-color="'grey'"
                                                 :series-defaults-type="'column'"
                                                 :theme="'sass'">
                                        <kendo-chart-series-item :tooltip-template="rpt43Model.TooltiptemplateForRange" :category-field="'tbl_date'" :fromField="'min_fee'" :toField="'max_fee'" :name="$CaptionsLibrary.get('UpAndDownRange')" :type="'rangeColumn'"></kendo-chart-series-item>
                                    </kendo-chart>
                                    <!--<kendo-stockchart :title-text="$CaptionsLibrary.get('ShareAmountSwing')"
                            ref="rpt43RangeChart"
                            :data-source="rpt43Model.output"
                            :series-defaults-tooltip-visible="true"
                            :series-defaults-tooltip-color="'currentColor'"
                            :series-defaults-notes-label-color="'black'"
                            :series-defaults-notes-icon-background="'lightgray'"
                            :series-defaults-notes-icon-border-color="'lightgray'"
                            :series-defaults-notes-line-color="'lightgray'"
                            :series-colors="rpt43Model.seriesColors"
                            :tooltip-visible="true"
                            :value-axis="rpt43Model.valueAxis"
                            :category-axis-labels-rotation-angle="'auto'"
                            :category-axis-color="'currentColor'"
                            :zoomable-mousewheel-lock="'y'"
                            :pannable-lock="'y'"
                            :height="'100px'"
                            :title-color="'currentColor'"
                            :title-position="'top'"
                            :chart-area-background="''"
                            :chart-area-height="350"
                            :legend-position="'bottom'"
                            :legend-labels-color="'currentColor'"
                            :legend-inactive-items-labels-color="'grey'"
                            :series-defaults-type="'column'"
                            :theme="'sass'">
                   <kendo-chart-series-item :tooltip-template="rpt43Model.TooltiptemplateForRange" :category-field="'tbl_date'" :type="'candlestick'"
            :open-field="'first_fee'"
            :high-field="'max_fee'"
            :low-field="'min_fee'"
            :close-field="'last_fee'"></kendo-chart-series-item>
               </kendo-stockchart>-->

                                </div>
                            </div>
                            <div>
                                <div class="form-group">
                                    <kendo-chart :title-text="$CaptionsLibrary.get('Percent')+' '+$CaptionsLibrary.get('Change')+' '+$CaptionsLibrary.get('Fee')+' '+$CaptionsLibrary.get('Final')"
                                                 ref="rpt43FeeFinalDiffChart"
                                                 :data-source="rpt43Model.output"
                                                 :series-defaults-tooltip-visible="true"
                                                 :series-defaults-tooltip-color="'currentColor'"
                                                 :series-defaults-notes-label-color="'black'"
                                                 :series-defaults-notes-icon-background="'lightgray'"
                                                 :series-defaults-notes-icon-border-color="'lightgray'"
                                                 :series-defaults-notes-line-color="'lightgray'"
                                                 :series-colors="rpt43Model.seriesColors"
                                                 :tooltip-visible="true"
                                                 :value-axis="rpt43Model.valueAxisForFeeChange"
                                                 :category-axis-labels-rotation-angle="'auto'"
                                                 :category-axis-color="'currentColor'"
                                                 :zoomable-mousewheel-lock="'y'"
                                                 :pannable-lock="'y'"
                                                 :title-color="'currentColor'"
                                                 :title-position="'top'"
                                                 :chart-area-background="''"
                                                 :chart-area-height="350"
                                                 :legend-position="'bottom'"
                                                 :legend-labels-color="'currentColor'"
                                                 :legend-inactive-items-labels-color="'grey'"
                                                 :series-defaults-type="'column'"
                                                 :theme="'sass'">
                                        <kendo-chart-series-item :category-field="'tbl_date'" :tooltip-template="rpt43Model.TooltiptemplateForFeeChange" :field="'diff'" :name="$CaptionsLibrary.get('Change')" :type="'column'"></kendo-chart-series-item>

                                    </kendo-chart>
                                </div>
                            </div>
                        </kendo-tabstrip>
                    </div>
                </div>

                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRpt14 == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-pie"></i>
                                {{$CaptionsLibrary.get('ShareholderCombination')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRpt14">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt14 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRpt14">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt14 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRpt14DashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt14 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRpt14DashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('ShareholderCombination')"
                                     ref="rpt14Chart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-visible="false"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-type="'donut'"
                                     :series-defaults-start-angle="150"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rpt14Model.Tooltiptemplate"
                                     :series="rpt14Model.series"
                                     :series-colors="rpt14Model.seriesColors"
                                     :tooltip-visible="true"
                                     :labels-position="'outsideEnd'"
                                     :value-axis="rpt14Model.valueAxis"
                                     :category-axis-labels-rotation-angle="'auto'"
                                     :category-axis-color="'currentColor'"
                                     :theme="'sass'">
                        </kendo-chart>
                    </div>
                </div>
                <div class="bs-docs-example k-content box600-2">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRpt05 == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('ShareholderCount')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRpt05">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt05 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRpt05">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt05 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRpt05DashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt05 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRpt05DashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('ShareholderCount')"
                                     ref="rpt05Chart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-type="'column'"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rpt05Model.Tooltiptemplate"
                                     :series-colors="rpt05Model.seriesColors"
                                     :category-axis-categories="rpt05Model.categories"
                                     :tooltip-visible="true"
                                     :value-axis="rpt05Model.valueAxis"
                                     :category-axis="rpt05Model.categoryAxis"
                                     :zoomable-mousewheel-lock="'y'"
                                     :pannable-lock="'y'"
                                     :theme="'sass'">
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('Actual')" :data="rpt05Model.sumShrhActual" :k-style="'step'"></kendo-chart-series-item>
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('Legal')" :data="rpt05Model.sumShrhLegal" :k-style="'step'"></kendo-chart-series-item>
                        </kendo-chart>
                    </div>
                </div>

                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRptMaxSeller == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('SellingMostShare')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRptMaxSeller">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxSeller == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRptMaxSeller">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxSeller == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRptMaxSellerDashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxSeller == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRptMaxSellerDashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('SellingMostShare')"
                                     ref="rptMaxSellerChart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rptMaxSellerModel.Tooltiptemplate"
                                     :series-colors="rptMaxSellerModel.seriesColors"
                                     :category-axis="rptMaxSellerModel.categoryAxis"
                                     :tooltip-visible="true"
                                     :value-axis="rptMaxSellerModel.valueAxis"
                                     :zoomable-mousewheel-lock="'y'"
                                     :pannable-lock="'y'"
                                     :theme="'sass'">
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('ShareCount')" :data="rptMaxSellerModel.sumShare" :type="'line'" :markers-visible="false" :k-style="'smooth'" :axis="'sumShare'"></kendo-chart-series-item>
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('Amount')" :data="rptMaxSellerModel.sumAmount" :type="'column'" :k-style="'step'" :axis="'sumAmount'"></kendo-chart-series-item>
                        </kendo-chart>
                    </div>
                </div>
                <div class="bs-docs-example k-content box600-2">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRptMaxBuyer == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('BuyingMostShare')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRptMaxBuyer">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxBuyer == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRptMaxBuyer">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxBuyer == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRptMaxBuyerDashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptMaxBuyer == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRptMaxBuyerDashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('BuyingMostShare')"
                                     ref="rptMaxBuyerChart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rptMaxBuyerModel.Tooltiptemplate"
                                     :series-colors="rptMaxBuyerModel.seriesColors"
                                     :category-axis="rptMaxBuyerModel.categoryAxis"
                                     :tooltip-visible="true"
                                     :value-axis="rptMaxBuyerModel.valueAxis"
                                     :zoomable-mousewheel-lock="'y'"
                                     :pannable-lock="'y'"
                                     :theme="'sass'">
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('ShareCount')" :data="rptMaxBuyerModel.sumShare" :type="'line'" :markers-visible="false" :k-style="'smooth'" :axis="'sumShare'"></kendo-chart-series-item>
                            <kendo-chart-series-item :name="$CaptionsLibrary.get('Amount')" :data="rptMaxBuyerModel.sumAmount" :type="'column'" :k-style="'step'" :axis="'sumAmount'"></kendo-chart-series-item>
                        </kendo-chart>
                    </div>
                </div>
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRptCurrentDateState == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-pie"></i>
                                {{$CaptionsLibrary.get('CountAndQuantTransaction')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRptCurrentDateState">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptCurrentDateState == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRptCurrentDateState">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptCurrentDateState == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRptCurrentDateStateDashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group break-line">
                            <label><span><i class="fa fa-calendar-day"></i>&nbsp;&nbsp;{{$CaptionsLibrary.get("CountOfTransactionInCurrentDay")}}</span>: {{rptCurrentDateStateModel.currentDateTransactionCnt == null ? 0 : rptCurrentDateStateModel.currentDateTransactionCnt}}</label>
                        </div>
                        <div class="form-group break-line">
                            <label><span><i class="fa fa-calendar-day"></i>&nbsp;&nbsp;{{$CaptionsLibrary.get("QuantityOfTransactionInCurrentDay")}}</span>: {{rptCurrentDateStateModel.currentDateTransactionQnt == null ? 0 : rptCurrentDateStateModel.currentDateTransactionQnt}}</label>
                        </div>
                        <div class="form-group break-line">
                            <label><span><i class="fa fa-hand-holding-usd"></i>&nbsp;&nbsp;{{$CaptionsLibrary.get("PayToShareholderInCurrentDay")}}</span>: {{rptCurrentDateStateModel.currentDatePay == null ? 0 : rptCurrentDateStateModel.currentDatePay}}</label>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group" v-show="rptCurrentDateStateModel.nameOfMaxBuyer != ''">
                            <label><span><i class="fa fa-plus-square"></i>&nbsp;&nbsp;{{$CaptionsLibrary.get("BuyingMostShare")}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label>{{rptCurrentDateStateModel.nameOfMaxBuyer}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")}}</span>: {{rptCurrentDateStateModel.shareOfMaxBuyer}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")}}</span>: {{rptCurrentDateStateModel.percentOfMaxBuyer}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="rptCurrentDateStateModel.listForMaxBuyer"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group" v-show="rptCurrentDateStateModel.nameOfMaxSeller != ''">
                            <label><span><i class="fa fa-minus-square"></i>&nbsp;&nbsp;{{$CaptionsLibrary.get("SellingMostShare")}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label>{{rptCurrentDateStateModel.nameOfMaxSeller}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")}}</span>: {{rptCurrentDateStateModel.shareOfMaxSeller}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")}}</span>: {{rptCurrentDateStateModel.percentOfMaxSeller}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="rptCurrentDateStateModel.listForMaxSeller"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bs-docs-example k-content box600-1">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRptSeason == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('SeasonTransactionState')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRptSeason">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptSeason == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRptSeason">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptSeason == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRptSeasonDashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRptSeason == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRptSeasonDashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>

                    <div>
                        <kendo-tabstrip ref="rptSeasonTab">
                            <ul>
                                <li>
                                    {{$CaptionsLibrary.get('QuantityOfTransaction')}}
                                </li>
                                <li>
                                    {{$CaptionsLibrary.get('CompareWithLastYear')}}
                                </li>
                            </ul>
                            <div>
                                <div class="form-group">
                                    <kendo-chart :title-text="$CaptionsLibrary.get('SeasonTransactionState')"
                                                 ref="rptSeasonChart"
                                                 :series-defaults-tooltip-visible="true"
                                                 :series-defaults-tooltip-color="'currentColor'"
                                                 :series-defaults-notes-label-color="'black'"
                                                 :series-defaults-notes-icon-background="'lightgray'"
                                                 :series-defaults-notes-icon-border-color="'lightgray'"
                                                 :series-defaults-notes-line-color="'lightgray'"
                                                 :series-defaults-tooltip-template="rptSeasonModel.Tooltiptemplate"
                                                 :series-colors="rptSeasonModel.seriesColors"
                                                 :tooltip-visible="true"
                                                 :value-axis="rptSeasonModel.valueAxis"
                                                 :category-axis-labels-rotation-angle="'auto'"
                                                 :category-axis-color="'currentColor'"
                                                 :zoomable-mousewheel-lock="'y'"
                                                 :pannable-lock="'y'"
                                                 :height="'200px'"
                                                 :title-color="'currentColor'"
                                                 :title-position="'top'"
                                                 :chart-area-background="''"
                                                 :legend-position="'bottom'"
                                                 :legend-labels-color="'currentColor'"
                                                 :legend-inactive-items-labels-color="'grey'"
                                                 :chart-area-height="350"
                                                 :theme="'sass'">

                                        <kendo-chart-series-item :data="rptSeasonModel.output" :line-style="'smooth'" :category-field="'months'" :field="'qnt'" :name="$CaptionsLibrary.get('FinYear') +' '+ rptSeasonModel.finYear" :type="'area'" :note-text-field="'extermum'"></kendo-chart-series-item>
                                        <kendo-chart-series-item :data="rptSeasonModel.pastYearOutput" :line-style="'smooth'" :category-field="'months'" :field="'qnt'" :name="$CaptionsLibrary.get('PastFinYear')" :type="'area'" :note-text-field="'extermum'"></kendo-chart-series-item>
                                    </kendo-chart>
                                </div>
                            </div>
                            <div>
                                <div class="form-group">
                                    <kendo-chart :title-text="$CaptionsLibrary.get('SeasonTransactionState')"
                                                 ref="rptSeasonRadarChart"
                                                 :series-defaults-tooltip-visible="true"
                                                 :series-defaults-tooltip-color="'currentColor'"
                                                 :series-defaults-notes-label-color="'black'"
                                                 :series-defaults-notes-icon-background="'lightgray'"
                                                 :series-defaults-notes-icon-border-color="'lightgray'"
                                                 :series-defaults-notes-line-color="'lightgray'"
                                                 :series-defaults-tooltip-template="rptSeasonModel.Tooltiptemplate"
                                                 :series-colors="rptSeasonModel.seriesColors"
                                                 :tooltip-visible="true"
                                                 :value-axis="rptSeasonModel.valueAxis"
                                                 :category-axis-labels-rotation-angle="'auto'"
                                                 :category-axis-color="'currentColor'"
                                                 :zoomable-mousewheel-lock="'y'"
                                                 :pannable-lock="'y'"
                                                 :height="'200px'"
                                                 :title-color="'currentColor'"
                                                 :title-position="'top'"
                                                 :chart-area-background="''"
                                                 :legend-position="'bottom'"
                                                 :legend-labels-color="'currentColor'"
                                                 :legend-inactive-items-labels-color="'grey'"
                                                 :chart-area-height="350"
                                                 :theme="'sass'">

                                        <kendo-chart-series-item :data="rptSeasonModel.output" :line-style="'smooth'" :category-field="'months'" :field="'qnt'" :name="$CaptionsLibrary.get('FinYear') +' '+ rptSeasonModel.finYear" :type="'radarArea'" :note-text-field="'extermum'"></kendo-chart-series-item>
                                        <kendo-chart-series-item :data="rptSeasonModel.pastYearOutput" :line-style="'smooth'" :category-field="'months'" :field="'qnt'" :name="$CaptionsLibrary.get('PastFinYear')" :type="'radarArea'" :note-text-field="'extermum'"></kendo-chart-series-item>
                                    </kendo-chart>
                                </div>
                            </div>
                        </kendo-tabstrip>
                    </div>
                </div>
                <div class="bs-docs-example k-content">
                    <kendo-window ref="rpt0702DashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true" :width="'92%'">
                        <div class="container">
                            <div class="form-group">
                                <label for="type1">{{$CaptionsLibrary.get("Type")}}</label>
                                <kendo-buttongroup id="type1" :index="0" v-model="rpt0702Model.type" @select="typeSelect0702">
                                    <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Profit")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Priority")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Forced")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("Capital")}}</kendo-buttongroup-button>
                                </kendo-buttongroup>
                            </div>
                            <div class="form-group">
                                <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                                <kendo-buttongroup id="shrhKind" :index="2" v-model="rpt0702Model.shrhKind" @select="shrhKindFlagSelect">
                                    <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                                </kendo-buttongroup>
                            </div>
                            <div class="form-group break-line">
                                <label>{{$CaptionsLibrary.get("Range")}}</label>
                                <kendo-buttongroup @select="rpt0702DateRangeTypeSelect">
                                    <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Default")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("1Day")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("1Week")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("1Month")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="4" style="width:100%">{{$CaptionsLibrary.get("1Year")}}</kendo-buttongroup-button>
                                </kendo-buttongroup>
                            </div>
                            <div class="form-group">
                                <label for="dateS">{{$CaptionsLibrary.get("FromDate")}}</label>
                                <sv-datepicker v-model="rpt0702Model.dateS" name="dateS" id="dateS"></sv-datepicker>
                            </div>
                            <div class="form-group">
                                <label for="dateE">{{$CaptionsLibrary.get("ToDate")}}</label>
                                <sv-datepicker v-model="rpt0702Model.dateE" name="dateE" id="dateE"></sv-datepicker>
                            </div>
                            <div class="form-group">
                                <label for="finYear">{{$CaptionsLibrary.get("From") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                                <kendo-combobox v-model="rpt0702Model.finYearS"
                                                id="finYear"
                                                ref="finYear"
                                                name="finYear"
                                                :data-source="finYears"
                                                :filter="'contains'"
                                                class="width-100">
                                </kendo-combobox>
                            </div>
                            <div class="form-group">
                                <label for="finYear">{{$CaptionsLibrary.get("To") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                                <kendo-combobox v-model="rpt0702Model.finYearE"
                                                id="finYear"
                                                ref="finYear"
                                                name="finYear"
                                                :data-source="finYears"
                                                :filter="'contains'"
                                                class="width-100">
                                </kendo-combobox>
                            </div>
                            <div class="form-group break-line">
                                <kendo-button @click.prevent="getSpShrRpt0702" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                            </div>
                        </div>
                    </kendo-window>
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRpt0702 == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('PayToShareholders')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRpt0702">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRpt0702">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRpt0702DashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702 == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRpt0702DashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('PayToShareholders')"
                                     ref="rpt0702Chart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-type="'line'"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rpt0702Model.Tooltiptemplate"
                                     :series-colors="rpt0702Model.seriesColors"
                                     :category-axis-categories="rpt0702Model.categories"
                                     :tooltip-visible="true"
                                     :value-axis="rpt0702Model.valueAxis"
                                     :category-axis-labels-rotation-angle="'auto'"
                                     :category-axis-color="'currentColor'"
                                     :zoomable-mousewheel-lock="'y'"
                                     :pannable-lock="'y'"
                                     :theme="'sass'">
                            <kendo-chart-series-item :name="rpt0702Model.typeDesc" :data="rpt0702Model.amnt1" :k-style="'smooth'"></kendo-chart-series-item>
                        </kendo-chart>
                    </div>
                </div>

                <div class="bs-docs-example k-content">
                    <kendo-window ref="rpt0702AssignDashboardFilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
                        <div class="container">
                            <div class="form-group">
                                <label for="type">{{$CaptionsLibrary.get("Type")}}</label>
                                <kendo-buttongroup id="type" :index="0" v-model="rpt0702AssignModel.type" @select="typeSelect0702Assign">
                                    <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Profit")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Priority")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Forced")}}</kendo-buttongroup-button>
                                </kendo-buttongroup>
                            </div>
                            <div class="form-group">
                                <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                                <kendo-buttongroup id="shrhKind" :index="2" v-model="rpt0702AssignModel.shrhKind" @select="shrhKindFlagSelect0702Assign">
                                    <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                                    <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                                </kendo-buttongroup>
                            </div>
                            <div class="form-group">
                                <label for="finYear">{{$CaptionsLibrary.get("From") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                                <kendo-combobox v-model="rpt0702AssignModel.finYearS"
                                                id="finYear"
                                                ref="finYear"
                                                name="finYear"
                                                :data-source="finYears"
                                                :filter="'contains'"
                                                class="width-100">
                                </kendo-combobox>
                            </div>
                            <div class="form-group">
                                <label for="finYear">{{$CaptionsLibrary.get("To") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                                <kendo-combobox v-model="rpt0702AssignModel.finYearE"
                                                id="finYear"
                                                ref="finYear"
                                                name="finYear"
                                                :data-source="finYears"
                                                :filter="'contains'"
                                                class="width-100">
                                </kendo-combobox>
                            </div>
                            <div class="form-group">
                                <kendo-button @click.prevent="getSpShrRpt0702Assign" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                            </div>
                        </div>
                    </kendo-window>
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowSpShrRpt0702Assign == false" style="float:right;margin:5px">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get('AssignToShareholders')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSpShrRpt0702Assign">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702Assign == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getSpShrRpt0702Assign">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702Assign == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowRpt0702AssignDashboardFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowSpShrRpt0702Assign == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ExportRpt0702AssignDashboardChart">
                                <div>
                                    <i class="fa fa-file"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="form-group">
                        <kendo-chart :title-text="$CaptionsLibrary.get('AssignToShareholders')"
                                     ref="rpt0702AssignChart"
                                     :height="'100px'"
                                     :title-color="'currentColor'"
                                     :title-position="'top'"
                                     :chart-area-background="''"
                                     :legend-position="'bottom'"
                                     :legend-labels-color="'currentColor'"
                                     :legend-inactive-items-labels-color="'grey'"
                                     :series-defaults-type="'line'"
                                     :series-defaults-tooltip-visible="true"
                                     :series-defaults-tooltip-color="'currentColor'"
                                     :series-defaults-tooltip-template="rpt0702AssignModel.Tooltiptemplate"
                                     :series-colors="rpt0702AssignModel.seriesColors"
                                     :category-axis-categories="rpt0702AssignModel.categories"
                                     :tooltip-visible="true"
                                     :value-axis="rpt0702AssignModel.valueAxis"
                                     :category-axis-labels-rotation-angle="'auto'"
                                     :category-axis-color="'currentColor'"
                                     :zoomable-mousewheel-lock="'y'"
                                     :pannable-lock="'y'"
                                     :theme="'sass'">
                            <kendo-chart-series-item :name="rpt0702AssignModel.typeDesc" :data="rpt0702AssignModel.amnt1" :k-style="'smooth'"></kendo-chart-series-item>

                        </kendo-chart>
                    </div>
                </div>



            </div>
            <div class="container-new-2">
                <div class="bs-docs-example k-content box600-2">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowShareholderCompletionRateInformation == false" style="float:right;margin:5px">
                                <i class="fas fa-user-tag"></i>
                                {{$CaptionsLibrary.get('CompletionRate')+' '+$CaptionsLibrary.get('Information')+' '+$CaptionsLibrary.get('Shareholder')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleShareholderCompletionRateInformation">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowShareholderCompletionRateInformation == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="getShareholderCompletionRateInformation">
                                <div>
                                    <i class="fa fa-sync-alt"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <div class="container">
                        <div class="form-group">
                            <label><span><i class="fas fa-mobile"></i>&nbsp;&nbsp;{{completionRateInformationModel.cellphoneModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.cellphoneModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.cellphoneModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.cellphoneModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.cellphoneModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-phone"></i>&nbsp;&nbsp;{{completionRateInformationModel.telNoModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.telNoModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.telNoModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.telNoModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.telNoModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-map"></i>&nbsp;&nbsp;{{completionRateInformationModel.addressModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.addressModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.addressModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.addressModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.addressModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-mail-bulk"></i>&nbsp;&nbsp;{{completionRateInformationModel.emailModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.emailModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.emailModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.emailModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.emailModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-door-open"></i>&nbsp;&nbsp;{{completionRateInformationModel.zipCodeModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.zipCodeModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.zipCodeModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.zipCodeModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.zipCodeModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-certificate"></i>&nbsp;&nbsp;{{completionRateInformationModel.natCodeModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.natCodeModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.natCodeModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.natCodeModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.natCodeModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-calendar-day"></i>&nbsp;&nbsp;{{completionRateInformationModel.birthDateModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.birthDateModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.birthDateModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.birthDateModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.birthDateModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-file-invoice-dollar"></i>&nbsp;&nbsp;{{completionRateInformationModel.shrhAccModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.shrhAccModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.shrhAccModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.shrhAccModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.shrhAccModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label><span><i class="fas fa-file-invoice-dollar"></i>&nbsp;&nbsp;{{completionRateInformationModel.spBankCodeModel.title}}</span></label>
                            <div class="form-group break-line k-block" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                                <div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Count")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.spBankCodeModel.Count}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("Completed")}}</span>: {{completionRateInformationModel.spBankCodeModel.percent[0]}}</label>
                                    </div>
                                    <div class="form-group break-line">
                                        <label><span>{{$CaptionsLibrary.get("Percent")+' '+ $CaptionsLibrary.get("InCompleted")}}</span>: {{completionRateInformationModel.spBankCodeModel.percent[1]}}</label>
                                    </div>
                                </div>
                                <div style="text-align:left">
                                    <kendo-sparkline :type="'pie'"
                                                     :series-colors="rptShrTransactionGroupByYear.seriesColors"
                                                     :tooltip-visible="true"
                                                     :chart-area-background="''"
                                                     :chart-area-height="70"
                                                     :tooltip-format="'{0} %'"
                                                     :theme="'sass'">
                                        <kendo-sparkline-series-item :data="this.completionRateInformationModel.spBankCodeModel.percent"></kendo-sparkline-series-item>
                                    </kendo-sparkline>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" src="./index.ts">
</script>

<style scoped>
    .panel-bar {
        margin-bottom: 20px;
    }

    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    /*.container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px,1fr) minmax(600px,2fr));
        grid-gap: 20px;
        padding: 10px;
    }*/

    /*.container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

     .container-new-2 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(900px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }*/

    @media(min-width: 800px) {

    .container-new {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px,1fr) minmax(600px,2fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .container-new-2 {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(900px, -1fr) minmax(300px,1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    }

    .chart-container-one-row {
        display: grid;
        grid-template-columns: repeat(1);
        grid-gap: 20px;
        padding: 10px;
    }

    .form-group span {
        font-weight: bold;
    }

    .profile-photo {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 10%;
        border-radius: 50%;
    }

    @media(max-width: 800px) {
        .profile-photo {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 40%;
            border-radius: 50%;
        }
    }
</style>
