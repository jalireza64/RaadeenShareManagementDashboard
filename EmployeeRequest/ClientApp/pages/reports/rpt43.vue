<template>
    <div class="rtl page">
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('ShareAmountSwing')"
                 ref="Chart"
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
                 :series-defaults-tooltip-template="chartModel.Tooltiptemplate"
                 :series-colors="chartModel.seriesColors"
                 :category-axis-categories="chartModel.categories"
                 :tooltip-visible="true"
                 :value-axis="chartModel.valueAxis"
                 :category-axis-labels-rotation-angle="'auto'"
                 :category-axis-color="'currentColor'"
                 :zoomable-mousewheel-lock="'y'"
                 :pannable-lock="'y'"
                 :theme="'sass'">
        <kendo-chart-series-item :name="$CaptionsLibrary.get('Maximum')" :data="chartModel.max" :type="'area'"></kendo-chart-series-item>
        <kendo-chart-series-item :name="$CaptionsLibrary.get('Minimum')" :data="chartModel.min" :type="'area'"></kendo-chart-series-item>
        <kendo-chart-series-item :name="$CaptionsLibrary.get('Final')" :data="chartModel.final" :type="'area'"></kendo-chart-series-item>
        <kendo-chart-series-item :name="$CaptionsLibrary.get('First')" :data="chartModel.first" :type="'area'"></kendo-chart-series-item>
        <kendo-chart-series-item :name="$CaptionsLibrary.get('Last')" :data="chartModel.last" :type="'area'"></kendo-chart-series-item>
    </kendo-chart>

                    <!--<kendo-stockchart :data-source="chartDataSource"
                                      :title-color="'currentColor'"
                                      :title-position="'top'"
                                      :chart-area-background="''"
                                      :legend-position="'bottom'"
                                      :legend-labels-color="'currentColor'"
                                      :legend-inactive-items-labels-color="'grey'"
                                      :series-defaults-type="'column'"
                                      :series-defaults-tooltip-visible="true"
                                      :series-defaults-tooltip-color="'currentColor'"
                                      :series-defaults-tooltip-template="chartModel.Tooltiptemplate"
                                      :series-colors="chartModel.seriesColors"
                                      :tooltip-visible="true"
                                      :value-axis="chartModel.valueAxis"
                                      :category-axis-labels-rotation-angle="'auto'"

                                      :date-field="'Date'"
                                      :title-text="'The Boeing Company NYSE:BA'"
                                      :category-axis-labels-rotation="'auto'"
                                      :theme="'sass'">
                        <kendo-chart-series-item :type="'candlestick'"
                                                 :open-field="'Open'"
                                                 :high-field="'High'"
                                                 :low-field="'Low'"
                                                 :close-field="'Close'">
                        </kendo-chart-series-item>
                    </kendo-stockchart>-->
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
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
                                       :min="-20"
                                       :max="20"
                                       :large-step="5"
                                       :small-step="0.5"
                                       :change="finalFeeDiffChange"
                                       class="width-100">
                    </kendo-rangeslider>
                </div>
                <div class="form-group">
                    <kendo-button @click.prevent="showReport" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
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
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showChart">
                        <div>
                            <i class="fa fa-chart-bar"></i>
                        </div>
                    </kendo-button>
                    <kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="exportExcel">
                        <div>
                            <i class="fa fa-file"></i>
                        </div>
                    </kendo-button>
                    <kendo-button id="target" v-show="manuModel.ShowMenu == true" :disabled="this.selectedRow == null" style="float:left;margin:2px" class="k-button k-primary">
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
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'tbl_date'"
                                   :width="130"
                                   :title="$CaptionsLibrary.get('Date')"></kendo-grid-column>

                <kendo-grid-column :field="'first_fee'"
                                   :width="160"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('First')"></kendo-grid-column>

                <kendo-grid-column :field="'max_fee'"
                                   :width="160"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Maximum')"></kendo-grid-column>

                <kendo-grid-column :field="'min_fee'"
                                   :width="160"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Minimum')"></kendo-grid-column>

                <kendo-grid-column :field="'last_fee'"
                                   :width="160"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Last')"></kendo-grid-column>

                <kendo-grid-column :field="'final_fee'"
                                   :width="160"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Final')"></kendo-grid-column>

                <kendo-grid-column :field="'diff'"
                                   :width="130"
                                   :template="diffTemplate()"
                                   :title="$CaptionsLibrary.get('Change')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt43.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
    }

        .bs-docs-example .k-grid {
        height: calc(100% - 43px);
    }

    .bs-docs-example .k-grid-content {
        height: calc(100% - 120px) !important;
    }

    @media(max-width: 800px) {
        .bs-docs-example .k-grid {
            height: calc(100% - 50px);
    }
        .bs-docs-example .k-grid-content {
            height: calc(100% - 120px) !important;
        }
    }
</style>

<style>

</style>
