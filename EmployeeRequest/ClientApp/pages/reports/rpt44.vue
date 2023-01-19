<template>
    <div class="rtl page">
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('CountAndQuantTransaction')"
                                 ref="Chart"
                                 :height="'100px'"
                                 :title-color="'currentColor'"
                                 :title-position="'top'"
                                 :chart-area-background="''"
                                 :legend-position="'bottom'"
                                 :legend-labels-color="'currentColor'"
                                 :legend-inactive-items-labels-color="'grey'"
                                 :tooltip="chartModel.tooltip"
                                 :series-colors="chartModel.seriesColors"                               
                                 :zoomable-mousewheel-lock="'y'"
                                 :pannable-lock="'y'"
                                 :series-defaults-type="'bubble'"
                                 :series="chartModel.series"
                                 :x-axis="chartModel.xAxis"
                                 :y-axis="chartModel.yAxis"
                                 :theme="'sass'">
                    </kendo-chart>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
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
                            {{$CaptionsLibrary.get('CountAndQuantTransaction')}}
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

                <kendo-grid-column :field="'tbl_date'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Date')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'cnt'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count')"
                                   :footer-template="`#: data.cnt ? kendo.toString(data.cnt.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'qnt'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Quant')"
                                   :footer-template="`#: data.qnt ? kendo.toString(data.qnt.sum, 'n0') : 0 #`"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt44.ts">
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
