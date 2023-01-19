<template>
    <div class="rtl page">
        <kendo-window ref="sellDetailWindow" :title="$CaptionsLibrary.get('SellingMostShare')" :visible="model.isShowSellDetailWindow" :modal="true">
            <div class="bs-docs-example k-content flex" v-if="kendoMessages">
                <div class="title k-alt" style="display: grid;grid-template-columns: repeat(1, 1fr);">
                    <div style="position:relative">
                        <div style="float:right;margin:5px">
                            <i class="fas fa-list-ol"></i>
                            {{$CaptionsLibrary.get('SellingMostShare')}}
                        </div>
                    </div>
                </div>
                <div class="container">
                    <kendo-grid :data-source="sellDetailDatasource"
                                ref="sellDetailGrid"
                                @databinding="sellDetailGridDataBinding"
                                class="detail-grid"
                                :resizable="true"
                                :sortable-mode="'multiple'"
                                :sortable-allow-unsort="true"
                                :sortable-show-indexes="true"
                                :column-menu="true"
                                :selectable="true"
                                :filterable="true"
                                :groupable="true"
                                style="height:300px"
                                :pageable="false">
                        <kendo-grid-column :template="`#: ++recordSellDetailGrid #`"
                                           :width="50"></kendo-grid-column>

                        <kendo-grid-column :field="'shrhCode'"
                                           :width="200"
                                           :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                        <kendo-grid-column :field="'fullname'"
                                           :width="250"
                                           :title="$CaptionsLibrary.get('Fullname')"
                                           :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                        <kendo-grid-column :field="'share'"
                                           :width="160"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('ShareCount')"
                                           :footer-template="`#: data.share ? kendo.toString(data.share.sum, 'n0') : 0 #`"></kendo-grid-column>

                        <kendo-grid-column :field="'amnt'"
                                           :width="200"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('Amount')"
                                           :footer-template="`#: data.amnt ? kendo.toString(data.amnt.sum, 'n0') : 0 #`"></kendo-grid-column>

                        <kendo-grid-column :field="'cnt'"
                                           :width="160"
                                           :format="'{0:##,#}'"
                                           :title="$CaptionsLibrary.get('TransactionCount')"
                                           :footer-template="`#: data.cnt ? kendo.toString(data.cnt.sum, 'n0') : 0 #`"></kendo-grid-column>

                        <kendo-grid-column :field="'sharePercent'"
                                           :width="160"
                                           :title="$CaptionsLibrary.get('Percent')"
                                           :footer-template="`#: data.sharePercent ? kendo.toString(data.sharePercent.sum, 'n0') : 0 #`"></kendo-grid-column>

                    </kendo-grid>
                </div>

            </div>
        </kendo-window>
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('SellingMostShare')"
                                 ref="Chart"
                                 :height="'100px'"
                                 :title-color="'currentColor'"
                                 :title-position="'top'"
                                 :chart-area-background="''"
                                 :legend-position="'bottom'"
                                 :legend-labels-color="'currentColor'"
                                 :legend-inactive-items-labels-color="'grey'"
                                 :series-defaults-tooltip-visible="true"
                                 :series-defaults-tooltip-color="'currentColor'"
                                 :series-defaults-tooltip-template="chartModel.Tooltiptemplate"
                                 :series-colors="chartModel.seriesColors"
                                 :category-axis="chartModel.categoryAxis"
                                 :tooltip-visible="true"
                                 :value-axis="chartModel.valueAxis"
                                 :zoomable-mousewheel-lock="'y'"
                                 :pannable-lock="'y'"
                                 :theme="'sass'">
                        <kendo-chart-series-item :name="$CaptionsLibrary.get('ShareCount')" :data="chartModel.sumShare" :type="'line'" :markers-visible="false" :k-style="'smooth'" :axis="'sumShare'"></kendo-chart-series-item>
                        <kendo-chart-series-item :name="$CaptionsLibrary.get('Amount')" :data="chartModel.sumAmount" :type="'column'" :k-style="'step'" :axis="'sumAmount'"></kendo-chart-series-item>
                    </kendo-chart>
                </div>
            </div>
        </kendo-window>
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
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
                            {{$CaptionsLibrary.get('SellingMostShare')}}
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
                    <kendo-button v-show="manuModel.ShowMenu == true" :disabled="this.selectedAgent == null" style="float:left;margin:2px" class="k-button k-primary">
                        <div>
                            <i class="fas fa-caret-square-up"></i>
                        </div>
                    </kendo-button>
                    <div>
                        <kendo-contextmenu :target="'#target'" :show-on="'click'" :align-to-anchor="true">
                            <li @click.prevent="showSellDetailWindow">
                                <i class="fas fa-file-import"></i>&nbsp;
                                {{$CaptionsLibrary.get('Detail')+' '+$CaptionsLibrary.get('SellingMostShare')}}
                            </li>
                        </kendo-contextmenu>
                    </div>
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
                        @databinding="reportGridDataBinding"
                        :databound="resetRowNumber"
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

                <kendo-grid-column :field="'agent_name'"
                                   :width="300"
                                   :title="$CaptionsLibrary.get('Specification')"></kendo-grid-column>

                <kendo-grid-column :field="'agent_code'"
                                   :width="120"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'SharePercent'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Percent')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'sumshare'"
                                   :width="120"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('ShareCount')"
                                   :footer-template="`#: data.sumshare ? kendo.toString(data.sumshare.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'amnt'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount')"
                                   :footer-template="`#: data.amnt ? kendo.toString(data.amnt.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'cnt'"
                                   :width="120"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('TransactionCount')"
                                   :footer-template="`#: data.cnt ? kendo.toString(data.cnt.sum, 'n0') : 0 #`"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptMaxSellerByAgent.ts">
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

    @media(max-width: 1000px) {
        .detail-grid {
            width: 300px;
            height: 300px;
        }
    }
    @media(min-width: 1000px) {

        .detail-grid {
            width: 900px;
            height: 300px;
        }
    }
</style>
