﻿<template>
    <div class="rtl page">
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('TransactionOfShareholderStatus')"
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
                                 :series-colors="chartModel.seriesColors"
                                 :category-axis-categories="chartModel.categories"
                                 :tooltip-visible="true"
                                 :value-axis="chartModel.valueAxis"
                                 :category-axis-labels-rotation-angle="'auto'"
                                 :category-axis-labels-format="'{0:##,#;(0:##,#)}'"
                                 :category-axis-color="'currentColor'"
                                 :zoomable-mousewheel-lock="'y'"
                                 :pannable-lock="'y'"
                                 :theme="'sass'">
                        <kendo-chart-series-item :tooltip-template="chartModel.Tooltiptemplate" :name="$CaptionsLibrary.get('Buy')" :data="chartModel.buy" :type="'column'"></kendo-chart-series-item>
                        <kendo-chart-series-item :tooltip-template="chartModel.Tooltiptemplate" :name="$CaptionsLibrary.get('Sell')" :data="chartModel.sell" :type="'column'"></kendo-chart-series-item>
                        <kendo-chart-series-item :tooltip-template="chartModel.Tooltiptemplate" :name="$CaptionsLibrary.get('Remain')" :data="chartModel.remain" :type="'line'"></kendo-chart-series-item>
                    </kendo-chart>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="shrhCode">{{$CaptionsLibrary.get("Id")+" "+$CaptionsLibrary.get("Shareholder")}}</label>
                    <k-input v-model="model.shrhCode" name="shrhCode" id="shrhCode" class="width-100"></k-input>
                </div>
                <div class="form-group">
                    <label for="dateS">{{$CaptionsLibrary.get("FromDate")}}</label>
                    <sv-datepicker v-model="model.dateS" name="dateS" id="dateS"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="dateE">{{$CaptionsLibrary.get("ToDate")}}</label>
                    <sv-datepicker v-model="model.dateE" name="dateE" id="dateE"></sv-datepicker>
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
                            {{$CaptionsLibrary.get('TransactionOfShareholderStatus')}}
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
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @databinding="reportGridDataBinding"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        :column-menu="true"
                        :reorderable="true"
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'TblDate'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Date')"></kendo-grid-column>

                <kendo-grid-column :field="'ShrQuntBuy'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Buy')"
                                   :footer-template="`#: data.ShrQuntBuy ? kendo.toString(data.ShrQuntBuy.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'ShrQuntSell'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Sell')"
                                   :footer-template="`#: data.ShrQuntSell ? kendo.toString(data.ShrQuntSell.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :title="$CaptionsLibrary.get('Remain')"
                                   :template="`#: data.ShrQuntBuy + data.ShrQuntSell ? kendo.toString(window.remain = window.remain + (data.ShrQuntBuy + data.ShrQuntSell), '0:00,0;(0:00,0)') : 0 #`"
                                   :width="200"
                                   :footer-template="`#: data.ShrQuntBuy + data.ShrQuntSell ? kendo.toString(data.ShrQuntBuy.sum + data.ShrQuntSell.sum, 'n0') : 0 #`"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptTransactionOfShareholder.ts">
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
