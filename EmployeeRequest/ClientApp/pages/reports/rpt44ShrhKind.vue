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
                    <label for="kindFlag">{{$CaptionsLibrary.get("Status")}}</label>
                    <kendo-buttongroup id="kindFlag" :index="0" v-model="model.kindFlag" @select="kindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Sell")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="shareQuntType">{{$CaptionsLibrary.get("QuantityOfTransaction")}}</label>
                    <kendo-buttongroup id="shareQuntType" :index="2" v-model="model.shareQuntType" @select="shareQuntTypeSelect">
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Actual")}} <i class="fa fa-less-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Actual")}} <i class="fa fa-greater-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
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
                            {{$CaptionsLibrary.get('TransactionStateOfActualAndLegal')}}
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
                    <!--<kendo-button v-show="manuModel.ShowMenu == true" style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showChart">
        <div>
            <i class="fa fa-chart-bar"></i>
        </div>
    </kendo-button>-->
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

                <kendo-grid-column :field="'TBL_DATE'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Date')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'SHR_QUNT_ACTUAL'"
                                   :width="180"
                                   :format="'{0:##,#}'"
                                   :title="this.reportTitle.ShrQuntActual"
                                   :footer-template="`#: data.SHR_QUNT_ACTUAL ? kendo.toString(data.SHR_QUNT_ACTUAL.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'SHR_QUNT_LEGAL'"
                                   :width="180"
                                   :format="'{0:##,#}'"
                                   :title="this.reportTitle.ShrQuntLegal"
                                   :footer-template="`#: data.SHR_QUNT_LEGAL ? kendo.toString(data.SHR_QUNT_LEGAL.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'SHR_QUNT'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Quant')"
                                   :footer-template="`#: data.SHR_QUNT ? kendo.toString(data.SHR_QUNT.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'TRNS_COUNT_ACTUAL'"
                                   :width="180"
                                   :format="'{0:##,#}'"
                                   :title="this.reportTitle.TrnsCountActual"
                                   :footer-template="`#: data.TRNS_COUNT_ACTUAL ? kendo.toString(data.TRNS_COUNT_ACTUAL.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'TRNS_COUNT_LEGAL'"
                                   :width="180"
                                   :format="'{0:##,#}'"
                                   :title="this.reportTitle.TrnsCountLegal"
                                   :footer-template="`#: data.TRNS_COUNT_LEGAL ? kendo.toString(data.TRNS_COUNT_LEGAL.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'TRNS_COUNT'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count')"
                                   :footer-template="`#: data.TRNS_COUNT ? kendo.toString(data.TRNS_COUNT.sum, 'n0') : 0 #`"></kendo-grid-column>



            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt44ShrhKind.ts">
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
