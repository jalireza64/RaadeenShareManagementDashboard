<template>
    <div class="rtl page">
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('PayToShareholders')"
                                 ref="Chart"
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
                        <kendo-chart-series-item :name="chartModel.typeDesc" :data="chartModel.amnt1" :k-style="'smooth'"></kendo-chart-series-item>
                    </kendo-chart>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="type">{{$CaptionsLibrary.get("Type")}}</label>
                    <kendo-buttongroup id="type" :index="0" v-model="model.type" @select="typeSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Profit")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Priority")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("Forced")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="3" style="width:100%">{{$CaptionsLibrary.get("Capital")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="model.shrhKind" @select="shrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
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
                    <label for="finYear">{{$CaptionsLibrary.get("From") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                    <kendo-combobox v-model="model.finYearS"
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
                    <kendo-combobox v-model="model.finYearE"
                                    id="finYear"
                                    ref="finYear"
                                    name="finYear"
                                    :data-source="finYears"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
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
                            {{$CaptionsLibrary.get('PayToShareholders')}}
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
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'fin_year_code'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('FinYear')"></kendo-grid-column>

                <kendo-grid-column :field="'opr_code_desc'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Type')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'bed'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount')"
                                   :footer-template="`#: data.bed ? kendo.toString(data.bed.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt0702.ts">
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
