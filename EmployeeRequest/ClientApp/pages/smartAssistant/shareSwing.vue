<template>
    <div class="rtl">
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="false" :modal="true">
            <div class="container">
                <!--<div class="form-group">
                    <label for="dateRange">{{$CaptionsLibrary.get("FromTransDate")}}</label>
                    <date-picker v-model="model.dateRange" ref="dateRange" :column="1" mode="range" type="date" :locale-config="localeConfigs" shortcut :modal="true" :auto-submit="false" input-format="jYYYY/jMM/jDD" format="jYYYY/jMM/jDD" clearable :styles="styles">
                        <template #icon>
                            <i class="fas fa-calendar"></i>
                        </template>
                    </date-picker>
                </div>-->
                <div class="form-group">
                    <label for="dateS">{{$CaptionsLibrary.get("FromTransDate")}}</label>
                    <sv-datepicker v-model="model.dateS" name="dateS" id="dateS"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="dateE">{{$CaptionsLibrary.get("ToTransDate")}}</label>
                    <sv-datepicker v-model="model.dateE" name="dateE" id="dateE"></sv-datepicker>
                </div>
                <div class="form-group break-line">
                    <label for="finalFeeDiff">{{$CaptionsLibrary.get("Percent")+" "+$CaptionsLibrary.get("Change")+" "+$CaptionsLibrary.get("Fee")+" "+$CaptionsLibrary.get("Final")}}</label>
                    <kendo-rangeslider id="finalFeeDiff"
                                       :selection-start="model.finalFeeDiffS"
                                       :selection-end="model.finalFeeDiffE"
                                       :min="-100"
                                       :max="100"
                                       :large-step="20"
                                       :small-step="2.5"
                                       :change="finalFeeDiffChange"
                                       class="width-100">
                    </kendo-rangeslider>
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="showReport" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="addToShareholderWatchWindow" :title="$CaptionsLibrary.get('Add')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Watch')" :visible="shareholderWatchmodel.isAddToShareholderWatchWindowShown" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="shareholderWatchIdsForAdd">{{$CaptionsLibrary.get("Watch")}}</label>
                    <kendo-multiselect v-model="shareholderWatchmodel.shareholderWatchIds"
                                       id="shareholderWatchIdsForAdd"
                                       :auto-close="false"
                                       :data-source="shareholderWatches"
                                       :data-text-field="'Title'"
                                       :data-value-field="'Id'"
                                       :filter="'contains'"
                                       :tag-mode="'single'"
                                       :tagTemplate="'<span>#: data.values.length #'+' '+$CaptionsLibrary.get('Watch')+' '+$CaptionsLibrary.get('Selected')+'</span>'"
                                       class="width-100">
                    </kendo-multiselect>
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="addToShareholderWatch" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div>
            <div class="container-new">
                <div class="bs-docs-example k-content" v-if="kendoMessages">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                        <div style="position:relative">
                            <div v-show="manuModel.ShowMenu == false" style="float:right;margin:5px;position:absolute">
                                <div style="float:right;margin:5px">
                                    <i class="fa fa-chart-bar"></i>
                                    {{$CaptionsLibrary.get('ShareAmountSwing')}}
                                </div>
                            </div>
                            <div v-show="manuModel.ShowMenu == true" style="float:right;margin:5px;position:absolute">
                                <div style="float:right;margin:5px">
                                    <i class="fa fa-clock"></i>
                                    <span>{{model.reportTime}}</span>
                                </div>
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReport">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="ShowFilter">
                                <div>
                                    <i class="fa fa-filter"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcel">
                                <div>
                                    <i class="far fa-file-excel"></i>
                                </div>
                            </kendo-button>
                            <kendo-button id="target" v-show="manuModel.ShowMenu == true" :disabled="selectedRow == null" style="float:left;margin:2px" class="k-button k-primary">
                                <div>
                                    <i class="fas fa-caret-square-down"></i>
                                </div>
                            </kendo-button>
                            <div>
                                <kendo-contextmenu :target="'#target'" :show-on="'click'" :align-to-anchor="true">
                                    <li @click="gotoRptMaxBuyer">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('BuyingMostShare')}}
                                    </li>
                                    <li @click="gotoRptMaxSeller">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('SellingMostShare')}}
                                    </li>
                                </kendo-contextmenu>
                            </div>
                        </div>
                    </div>
                    <kendo-grid :data-source="reportDataSource"
                                ref="reportGrid"
                                @databinding="reportGridDataBinding"
                                @change="reportGridSelect"
                                :resizable="true"
                                :sortable-mode="'multiple'"
                                :sortable-allow-unsort="true"
                                :sortable-show-indexes="true"
                                :selectable="true"
                                :filterable="true"
                                :groupable="true"
                                :pageable="true"
                                :column-menu="true">
                        <kendo-grid-column :template="`#: ++record #`"
                                           :width="70"></kendo-grid-column>

                        <kendo-grid-column :field="'TblDate'"
                                           :width="130"
                                           :title="$CaptionsLibrary.get('Date')"></kendo-grid-column>

                        <kendo-grid-column :field="'Diff'"
                                           :width="130"
                                           :template="diffTemplate()"
                                           :title="$CaptionsLibrary.get('Change')"></kendo-grid-column>

                        <kendo-grid-column :field="'FinalFee'"
                                           :width="130"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Final')"></kendo-grid-column>

                        <kendo-grid-column :field="'BuyQuantActual'"
                                           :width="180"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Buy')+' '+$CaptionsLibrary.get('Actual')"></kendo-grid-column>

                        <kendo-grid-column :field="'BuyQuantLegal'"
                                           :width="180"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Buy')+' '+$CaptionsLibrary.get('Legal')"></kendo-grid-column>

                        <kendo-grid-column :field="'SellQuantActual'"
                                           :width="180"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Sell')+' '+$CaptionsLibrary.get('Actual')"></kendo-grid-column>

                        <kendo-grid-column :field="'SellQuantLegal'"
                                           :width="180"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Sell')+' '+$CaptionsLibrary.get('Legal')"></kendo-grid-column>

                        <kendo-grid-column :field="'Quant'"
                                           :width="130"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Quant')"></kendo-grid-column>

                    </kendo-grid>
                </div>
                <div class="bs-docs-example k-content box600-2">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px;position:absolute">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get("StatisticReports")}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReportChart">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuChart == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportChartReport">
                                <div>
                                    <i class="far fa-file-image"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <kendo-tabstrip ref="shareSwingChartTab" @select="onSelectShareSwingChartTab">
                        <ul>
                            <li>
                                <i class="fas fa-chart-line"></i>&nbsp;
                                {{$CaptionsLibrary.get("Fee")+" "+$CaptionsLibrary.get("Final")}}
                            </li>
                            <li>
                                <i class="fas fa-chart-pie"></i>&nbsp;
                                {{$CaptionsLibrary.get('Status')+' '+$CaptionsLibrary.get('CalendarDays')}}
                            </li>
                            <li>
                                <i class="fas fa-chart-bar"></i>&nbsp;
                                {{$CaptionsLibrary.get('QuantityOfTransaction')}}
                            </li>
                            <li>
                                <i class="fas fa-chart-pie"></i>&nbsp;
                                {{$CaptionsLibrary.get('Percent')+' '+$CaptionsLibrary.get('Actual')+' '+$CaptionsLibrary.get('And')+' '+$CaptionsLibrary.get('Legal')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-chart v-show="shareSwingChartDataSource.length > 0" :title-text="$CaptionsLibrary.get('Percent')+' '+$CaptionsLibrary.get('Change')+' '+$CaptionsLibrary.get('Fee')+' '+$CaptionsLibrary.get('Final')"
                                         ref="shareSwingChart"
                                         :data-source="shareSwingChartDataSource"
                                         :series-defaults-tooltip-visible="true"
                                         :series-defaults-tooltip-color="'currentColor'"
                                         :series-defaults-notes-label-color="'black'"
                                         :series-defaults-notes-icon-background="'lightgray'"
                                         :series-defaults-notes-icon-border-color="'lightgray'"
                                         :series-defaults-notes-line-color="'lightgray'"
                                         :series-colors="model.seriesColors"
                                         :tooltip-visible="true"
                                         :value-axis="model.valueAxisForShareSwing"
                                         :category-axis-labels-rotation-angle="'auto'"
                                         :category-axis-color="'currentColor'"
                                         :category-axis="model.categoryAxisShareSwing"
                                         :zoomable-mousewheel-lock="'y'"
                                         :pannable-lock="'y'"
                                         :title-color="'currentColor'"
                                         :title-position="'top'"
                                         :chart-area-background="''"
                                         :chart-area-height="300"
                                         :legend-position="'bottom'"
                                         :legend-labels-color="'currentColor'"
                                         :legend-inactive-items-labels-color="'grey'"
                                         :series-defaults-type="'column'"
                                         :theme="'sass'">
                                <kendo-chart-series-item :category-field="'tblDate'" :tooltip-template="model.TooltiptemplateForShareSwingDiff" :field="'diff'" :name="$CaptionsLibrary.get('Change')" :type="'line'" :k-style="'smooth'" :markers-visible="false" :axis="'diff'"></kendo-chart-series-item>
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareSwingFinalFee" :field="'finalFee'" :name="$CaptionsLibrary.get('Final')" :type="'line'" :k-style="'smooth'" :markers-visible="false" :axis="'finalFee'" :note-text-field="'extermum'"></kendo-chart-series-item>
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareSwingFinalFeeRange" :category-field="'tblDate'" :fromField="'minFinalFee'" :toField="'maxFinalFee'" :name="$CaptionsLibrary.get('UpAndDownRange')" :type="'rangeColumn'" :axis="'finalFee'"></kendo-chart-series-item>
                            </kendo-chart>
                        </div>
                        <div>
                            <kendo-chart v-show="shareSwingChartDataSource.length > 0" :title-text="$CaptionsLibrary.get('TheDaysWithTransaction')"
                                         ref="dailyStatisticChart"
                                         :value-axis="model.valueAxisForDailyStatistic"
                                         :series="seriesForDailyStatistic"
                                         :chart-area-height="300"
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
                                         :series-colors="model.seriesColorsForDailyStatistic"
                                         :series-defaults-tooltip-template="model.TooltiptemplateForDailyStatistic"
                                         :tooltip-visible="true"
                                         :labels-position="'outsideEnd'"
                                         :category-axis-labels-rotation-angle="'auto'"
                                         :category-axis-color="'currentColor'"
                                         :theme="'sass'">
                            </kendo-chart>
                        </div>
                        <div>
                            <kendo-chart v-show="shareSwingChartDataSource.length > 0"
                                         :title-text="$CaptionsLibrary.get('Status')+' '+$CaptionsLibrary.get('QuantityOfTransaction')+' '+$CaptionsLibrary.get('Daily')"
                                         ref="shareBuyQuantChart"
                                         :series-defaults-stack="true"
                                         :data-source="shareSwingChartDataSource"
                                         :series-defaults-tooltip-visible="true"
                                         :series-defaults-tooltip-color="'currentColor'"
                                         :series-defaults-notes-label-color="'black'"
                                         :series-defaults-notes-icon-background="'lightgray'"
                                         :series-defaults-notes-icon-border-color="'lightgray'"
                                         :series-defaults-notes-line-color="'lightgray'"
                                         :series-colors="model.seriesColorsShareQuant"
                                         :tooltip-visible="true"
                                         :value-axis="model.valueAxisForShareQuant"
                                         :category-axis-labels-rotation-angle="'auto'"
                                         :category-axis-color="'currentColor'"
                                         :category-axis="model.categoryAxisShareQuant"
                                         :zoomable-mousewheel-lock="'y'"
                                         :pannable-lock="'y'"
                                         :title-color="'currentColor'"
                                         :title-position="'top'"
                                         :chart-area-background="''"
                                         :chart-area-height="300"
                                         :legend-visible="false"
                                         :legend-position="'bottom'"
                                         :legend-labels-color="'currentColor'"
                                         :legend-inactive-items-labels-color="'grey'"
                                         :series-defaults-type="'column'"
                                         :theme="'sass'">
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareQuant" :field="'buyQuantActual'" :name="$CaptionsLibrary.get('Actual')" :type="'column'" :k-style="'smooth'" :markers-visible="false" :category-field="'tblDate'" :axis="'actualQuant'" :stack="'خرید'"></kendo-chart-series-item>
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareQuant" :field="'buyQuantLegal'" :name="$CaptionsLibrary.get('Legal')" :type="'column'" :k-style="'smooth'" :markers-visible="false" :axis="'legalQuant'" :stack="'خرید'"></kendo-chart-series-item>
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareQuant" :field="'sellQuantActual'" :name="$CaptionsLibrary.get('Actual')" :type="'column'" :k-style="'smooth'" :markers-visible="false" :axis="'actualQuant'" :stack="'فروش'"></kendo-chart-series-item>
                                <kendo-chart-series-item :tooltip-template="model.TooltiptemplateForShareQuant" :field="'sellQuantLegal'" :name="$CaptionsLibrary.get('Legal')" :type="'column'" :k-style="'smooth'" :markers-visible="false" :axis="'legalQuant'" :stack="'فروش'"></kendo-chart-series-item>
                            </kendo-chart>
                        </div>
                        <div>
                            <kendo-chart v-show="shareSwingChartDataSource.length > 0" :title-text="$CaptionsLibrary.get('TheDaysWithTransaction')"
                                         ref="quantTypeStatisticChart"
                                         :value-axis="model.valueAxisForQuantTypeStatistic"
                                         :series="seriesForQuantTypeStatistic"
                                         :chart-area-height="300"
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
                                         :series-colors="model.seriesColorsForQuantTypeStatistic"
                                         :series-defaults-tooltip-template="model.TooltiptemplateForQuantTypeStatistic"
                                         :tooltip-visible="true"
                                         :labels-visible="true"
                                         :labels-position="'outsideEnd'"
                                         :labels-rotation="'auto'"
                                         :category-axis-labels-rotation-angle="'auto'"
                                         :category-axis-color="'currentColor'"
                                         :theme="'sass'">
                            </kendo-chart>
                        </div>
                    </kendo-tabstrip>
                </div>

            </div>
            <div class="container">
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-plus-circle"></i>
                                {{$CaptionsLibrary.get('PositiveDays')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReportPositiveDays">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuPositiveDays == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcelPositiveDays">
                                <div>
                                    <i class="far fa-file-excel"></i>
                                </div>
                            </kendo-button>
                            <kendo-button id="targetPositiveDays" v-show="manuModel.ShowMenuPositiveDays == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary">
                                <div>
                                    <i class="fas fa-caret-square-down"></i>
                                </div>
                            </kendo-button>
                            <div>
                                <kendo-contextmenu :target="'#targetPositiveDays'" :show-on="'click'" :align-to-anchor="true">
                                    <li @click="gotoTransactionOfShareholder">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('TransactionOfShareholderStatus')}}
                                    </li>
                                    <li @click="showAddToShareholderWatchWindow">
                                        <i class="fas fa-eye"></i>&nbsp;
                                        {{$CaptionsLibrary.get('Add')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Watch')}}
                                    </li>
                                </kendo-contextmenu>
                            </div>
                        </div>
                    </div>
                    <kendo-tabstrip ref="positiveDayTab" @select="positiveDayTabSelect">
                        <ul>
                            <li>
                                <i class="fas fa-caret-square-down"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Buy')}}
                            </li>
                            <li>
                                <i class="fas fa-caret-square-up"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Sell')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-grid :data-source="positiveDayMaxBuyerDataSource"
                                        ref="positiveDayMaxBuyerGrid"
                                        @change="positiveDayMaxBuyerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                        <div>
                            <kendo-grid :data-source="positiveDayMaxSellerDataSource"
                                        ref="positiveDayMaxSellerGrid"
                                        @change="positiveDayMaxSellerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHA_SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                    </kendo-tabstrip>
                </div>
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fas fa-minus-circle"></i>
                                {{$CaptionsLibrary.get('NegativeDays')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReportNegativeDays">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuNegativeDays == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcelPositiveDays">
                                <div>
                                    <i class="far fa-file-excel"></i>
                                </div>
                            </kendo-button>
                            <kendo-button id="targetNegativeDays" v-show="manuModel.ShowMenuNegativeDays == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary">
                                <div>
                                    <i class="fas fa-caret-square-down"></i>
                                </div>
                            </kendo-button>
                            <div>
                                <kendo-contextmenu :target="'#targetNegativeDays'" :show-on="'click'" :align-to-anchor="true">
                                    <li @click="gotoTransactionOfShareholder">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('TransactionOfShareholderStatus')}}
                                    </li>
                                    <li @click="showAddToShareholderWatchWindow">
                                        <i class="fas fa-eye"></i>&nbsp;
                                        {{$CaptionsLibrary.get('Add')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Watch')}}
                                    </li>
                                </kendo-contextmenu>
                            </div>
                        </div>
                    </div>
                    <kendo-tabstrip ref="negativeDayTab" @select="negativeDayTabSelect">
                        <ul>
                            <li>
                                <i class="fas fa-caret-square-down"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Buy')}}
                            </li>
                            <li>
                                <i class="fas fa-caret-square-up"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Sell')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-grid :data-source="negativeDayMaxBuyerDataSource"
                                        ref="negativeDayMaxBuyerGrid"
                                        @change="negativeDayMaxBuyerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                        <div>
                            <kendo-grid :data-source="negativeDayMaxSellerDataSource"
                                        ref="negativeDayMaxSellerGrid"
                                        @change="negativeDayMaxSellerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHA_SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                    </kendo-tabstrip>
                </div>
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px">
                                <i class="fab fa-creative-commons-zero"></i>
                                {{$CaptionsLibrary.get('ZeroDays')}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReportZeroDays">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuZeroDays == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcelZeroDays">
                                <div>
                                    <i class="far fa-file-excel"></i>
                                </div>
                            </kendo-button>
                            <kendo-button id="targetZeroDays" v-show="manuModel.ShowMenuZeroDays == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary">
                                <div>
                                    <i class="fas fa-caret-square-down"></i>
                                </div>
                            </kendo-button>
                            <div>
                                <kendo-contextmenu :target="'#targetZeroDays'" :show-on="'click'" :align-to-anchor="true">
                                    <li @click="gotoTransactionOfShareholder">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('TransactionOfShareholderStatus')}}
                                    </li>
                                    <li @click="showAddToShareholderWatchWindow">
                                        <i class="fas fa-eye"></i>&nbsp;
                                        {{$CaptionsLibrary.get('Add')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Watch')}}
                                    </li>
                                </kendo-contextmenu>
                            </div>
                        </div>
                    </div>
                    <kendo-tabstrip ref="zeroDayTab" @select="zeroDayTabSelect">
                        <ul>
                            <li>
                                <i class="fas fa-caret-square-down"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Buy')}}
                            </li>
                            <li>
                                <i class="fas fa-caret-square-up"></i>&nbsp;
                                {{$CaptionsLibrary.get('Maximum')+' '+$CaptionsLibrary.get('Sell')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-grid :data-source="zeroDayMaxBuyerDataSource"
                                        ref="zeroDayMaxBuyerGrid"
                                        @change="zeroDayMaxBuyerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                        <div>
                            <kendo-grid :data-source="zeroDayMaxSellerDataSource"
                                        ref="zeroDayMaxSellerGrid"
                                        @change="zeroDayMaxSellerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'fullname'"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'SHA_SHRH_CODE'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :field="'sumshare'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('ShareCount')"></kendo-grid-column>

                                <kendo-grid-column :field="'amnt'"
                                                   :width="150"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('Amount')"></kendo-grid-column>

                                <kendo-grid-column :field="'cnt'"
                                                   :width="200"
                                                   :format="'{0:##,#}'"
                                                   :title="$CaptionsLibrary.get('TransactionCount')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                    </kendo-tabstrip>
                </div>
            </div>
            <div class="container-new-first-big">
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr)">
                        <div style="position:relative">
                            <div style="float:right;margin:5px;position:absolute">
                                <div style="float:right;margin:5px">
                                    <i class="fa fa-chart-line"></i>
                                    {{$CaptionsLibrary.get('ShareSwing')}}
                                </div>
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleReportSwinger">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuSwinger == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcelSwinger">
                                <div>
                                    <i class="far fa-file-excel"></i>
                                </div>
                            </kendo-button>
                            <kendo-button id="targetSwinger" v-show="manuModel.ShowMenuSwinger == true" :disabled="selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary">
                                <div>
                                    <i class="fas fa-caret-square-down"></i>
                                </div>
                            </kendo-button>
                            <div>
                                <kendo-contextmenu :target="'#targetSwinger'" :show-on="'click'" :align-to-anchor="true">
                                    <li @click="gotoTransactionOfShareholder">
                                        <i class="fas fa-file-import"></i>&nbsp;
                                        {{$CaptionsLibrary.get('TransactionOfShareholderStatus')}}
                                    </li>
                                    <li @click="showAddToShareholderWatchWindow">
                                        <i class="fas fa-eye"></i>&nbsp;
                                        {{$CaptionsLibrary.get('Add')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Watch')}}
                                    </li>
                                </kendo-contextmenu>
                            </div>
                        </div>
                    </div>
                    <kendo-tabstrip ref="swingerTab" @select="onSwingerTabSelect">
                        <ul>
                            <li :title="$MessagesLibrary.get('BuyInNegativeDayAndSellInPositiveDay')">
                                <i class="far fa-thumbs-up"></i>&nbsp;
                                {{$CaptionsLibrary.get('Best')}}
                            </li>
                            <li :title="$MessagesLibrary.get('BuyInPositiveDayAndSellInNegativeDay')">
                                <i class="far fa-thumbs-down"></i>&nbsp;
                                {{$CaptionsLibrary.get('Worst')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-grid :data-source="bestSwingerDataSource"
                                        ref="bestSwingerGrid"
                                        @change="bestSwingerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'BuyerFullName'"
                                                   :locked="true"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'BuyerShrhCode'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :width="500"
                                                   :title="$CaptionsLibrary.get('Buy')"
                                                   :columns="detailsColumnsBuy"></kendo-grid-column>

                                <kendo-grid-column :width="500"
                                                   :title="$CaptionsLibrary.get('Sell')"
                                                   :columns="detailsColumnsSell"></kendo-grid-column>

                                <kendo-grid-column :field="'QuantityPercent'"
                                                   :width="200"
                                                   :format="'{0:n}'"
                                                   :title="$CaptionsLibrary.get('Percent')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Total')"></kendo-grid-column>

                            </kendo-grid>
                        </div>
                        <div>
                            <kendo-grid :data-source="worstSwingerDataSource"
                                        ref="worstSwingerGrid"
                                        @change="worstSwingerGridSelect"
                                        :resizable="true"
                                        :sortable-mode="'multiple'"
                                        :sortable-allow-unsort="true"
                                        :sortable-show-indexes="true"
                                        :selectable="true"
                                        :filterable="true"
                                        :groupable="true"
                                        :pageable="true"
                                        :column-menu="true"
                                        style="height:300px">

                                <kendo-grid-column :field="'BuyerFullName'"
                                                   :locked="true"
                                                   :width="300"
                                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                                <kendo-grid-column :field="'BuyerShrhCode'"
                                                   :width="200"
                                                   :hidden="true"
                                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                                <kendo-grid-column :width="500"
                                                   :title="$CaptionsLibrary.get('Buy')"
                                                   :columns="detailsColumnsBuy"></kendo-grid-column>

                                <kendo-grid-column :width="500"
                                                   :title="$CaptionsLibrary.get('Sell')"
                                                   :columns="detailsColumnsSell"></kendo-grid-column>

                                <kendo-grid-column :field="'QuantityPercent'"
                                                   :width="200"
                                                   :format="'{0:n}'"
                                                   :title="$CaptionsLibrary.get('Percent')+' '+$CaptionsLibrary.get('At')+' '+$CaptionsLibrary.get('Total')"></kendo-grid-column>

                            </kendo-grid>
                        </div>

                    </kendo-tabstrip>
                </div>
                <div class="bs-docs-example k-content">
                    <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                        <div style="position:relative">
                            <div style="float:right;margin:5px;position:absolute">
                                <i class="fa fa-chart-bar"></i>
                                {{$CaptionsLibrary.get("Chart")+" "+$CaptionsLibrary.get("ShareSwing")}}
                            </div>
                            <kendo-button style="float:left;margin:2px" class="k-button" @click.prevent="toggleSwingerChart">
                                <div>
                                    <i class="fa fa-bars"></i>
                                </div>
                            </kendo-button>
                            <kendo-button v-show="manuModel.ShowMenuSwingerChart == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportChartSwinger">
                                <div>
                                    <i class="far fa-file-image"></i>
                                </div>
                            </kendo-button>
                        </div>
                    </div>
                    <kendo-tabstrip ref="swingerChartTab" @select="onSwingerChartTabSelect">
                        <ul>
                            <li :title="$MessagesLibrary.get('BuyInNegativeDayAndSellInPositiveDay')">
                                <i class="far fa-thumbs-up"></i>&nbsp;
                                {{$CaptionsLibrary.get('Best')}}
                            </li>
                            <li :title="$MessagesLibrary.get('BuyInPositiveDayAndSellInNegativeDay')">
                                <i class="far fa-thumbs-down"></i>&nbsp;
                                {{$CaptionsLibrary.get('Worst')}}
                            </li>
                        </ul>
                        <div>
                            <kendo-chart :title-text="$CaptionsLibrary.get('Best')+' '+$CaptionsLibrary.get('ShareSwing')"
                                         ref="bestShareSwingChart"
                                         :chart-area-height="300"
                                         :title-color="'currentColor'"
                                         :title-position="'top'"
                                         :chart-area-background="''"
                                         :legend-position="'bottom'"
                                         :legend-labels-color="'currentColor'"
                                         :legend-inactive-items-labels-color="'grey'"
                                         :tooltip="model.TooltipForSwingerChart"
                                         :series-colors="model.seriesColorsSwingerChart"
                                         :zoomable-mousewheel-lock="'y'"
                                         :pannable-lock="'y'"
                                         :series-defaults-type="'bubble'"
                                         :series="seriesForBestSwingerChart"
                                         :x-axis="model.xAxisForSwingerChart"
                                         :y-axis="model.yAxisSwingerChart"
                                         :theme="'sass'">
                            </kendo-chart>
                        </div>
                        <div>
                            <kendo-chart :title-text="$CaptionsLibrary.get('Worst')+' '+$CaptionsLibrary.get('ShareSwing')"
                                         ref="worstShareSwingChart"
                                         :chart-area-height="300"
                                         :title-color="'currentColor'"
                                         :title-position="'top'"
                                         :chart-area-background="''"
                                         :legend-position="'bottom'"
                                         :legend-labels-color="'currentColor'"
                                         :legend-inactive-items-labels-color="'grey'"
                                         :tooltip="model.TooltipForSwingerChart"
                                         :series-colors="model.seriesColorsSwingerChart"
                                         :zoomable-mousewheel-lock="'y'"
                                         :pannable-lock="'y'"
                                         :series-defaults-type="'bubble'"
                                         :series="seriesForWorstSwingerChart"
                                         :x-axis="model.xAxisForSwingerChart"
                                         :y-axis="model.yAxisSwingerChart"
                                         :theme="'sass'">
                            </kendo-chart>
                        </div>
                    </kendo-tabstrip>
                </div>
            </div>

        </div>
    </div>
</template>

<script lang="ts" src="./shareSwing.ts">
</script>

<style scoped>

    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .container-new-last-big {
        height: 430px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .container-new {
        height: 430px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px,1fr) minmax(560px,2fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .container-new-first-big {
        height: 430px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(600px, 2fr) minmax(300px,1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    .chart-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(800px, 1fr));
        grid-gap: 20px;
        padding: 10px;
    }

    @media(max-width: 800px) {
        .chart-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 20px;
            padding: 10px;
        }

        .container-new {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
            grid-gap: 20px;
            padding: 10px;
        }

        .container-new-first-big {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
            grid-gap: 20px;
            padding: 10px;
        }

        .container-new-last-big {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 20px;
            padding: 10px;
        }
    }

    .bs-docs-example .k-grid {
        height: calc(100% - 54px);
    }

    .bs-docs-example .k-grid-content {
        height: calc(100% - 120px) !important;
    }

    @media(max-width: 800px) {
        .bs-docs-example .k-grid {
            height: calc(100% - 45px);
        }

        .bs-docs-example .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
</style>

<style>
</style>
