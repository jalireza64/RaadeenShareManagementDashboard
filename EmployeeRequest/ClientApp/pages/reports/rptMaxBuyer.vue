<template>
    <div class="rtl page">
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
        <kendo-window ref="shareholderWatchWindow" :title="$CaptionsLibrary.get('Show')+' '+$CaptionsLibrary.get('Watch')" :visible="model.isShareholderWatchWindowShown" :modal="true">

            <kendo-grid :data-source="watchGridDataSource"
                        ref="watchGrid"
                        @databinding="watchGridDataBinding"
                        class="watch-grid"
                        :column-menu="true"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        style="height:300px"
                        :scrolable="true">

                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'ShrhCode'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('Id')"></kendo-grid-column>

                <kendo-grid-column :field="'Fullname'"
                                   :width="300"
                                   :template="shareholderKindTemplate()"
                                   :title="$CaptionsLibrary.get('Specification')"></kendo-grid-column>

                <kendo-grid-column :field="'TransactionTypeDesc'"
                                   :width="150"
                                   :template="transactionTypeTemplate()"
                                   :title="$CaptionsLibrary.get('Type')"></kendo-grid-column>

                <kendo-grid-column :field="'LastTrDate'"
                                   :width="170"
                                   :title="$CaptionsLibrary.get('Date')"></kendo-grid-column>

                <kendo-grid-column :field="'Share'"
                                   :width="170"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Shares')"></kendo-grid-column>

                <kendo-grid-column :field="'Amount'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount')+' '+$CaptionsLibrary.get('Transaction')"></kendo-grid-column>

                <kendo-grid-column :field="'ShareRemaining'"
                                   :width="190"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Remain')+' '+$CaptionsLibrary.get('Shares')"></kendo-grid-column>

                <kendo-grid-column :field="'FinanceRemaining'"
                                   :width="190"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Remain')+' '+$CaptionsLibrary.get('Finance')"></kendo-grid-column>
            </kendo-grid>

        </kendo-window>
        <kendo-window ref="chartWindow" :title="$CaptionsLibrary.get('Chart')" :visible="chartModel.isShowChart" :modal="true">
            <div class="chart-container">
                <div class="form-group">
                    <kendo-chart :title-text="$CaptionsLibrary.get('BuyingMostShare')"
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
                <!--<div class="form-group">
                <label for="onlyWatch">{{$CaptionsLibrary.get("OnlyWatch")}}</label>
                <kendo-buttongroup id="onlyWatch" :index="1" @select="onlyWatchSelect">
                    <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Active")}}</kendo-buttongroup-button>
                    <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Deactive")}}</kendo-buttongroup-button>
                </kendo-buttongroup>
            </div>-->
                <div class="form-group">
                    <label for="accessLevel">{{$CaptionsLibrary.get("Watch")}}</label>
                    <div class="password-wrapper">
                        <kendo-multiselect v-model="model.shareholderWatchIds"
                                           id="accessLevel"
                                           :auto-close="false"
                                           :data-source="shareholderWatches"
                                           :data-text-field="'Title'"
                                           :data-value-field="'Id'"
                                           :filter="'contains'"
                                           :tag-mode="'single'"
                                           :tagTemplate="'<span>#: data.values.length #'+' '+$CaptionsLibrary.get('Watch')+' '+$CaptionsLibrary.get('Selected')+'</span>'"
                                           class="width-100">
                        </kendo-multiselect>
                        <kendo-button class="k-button k-primary" @click.prevent="loadWatchGridDataSource"><i class="far fa-eye"></i></kendo-button>
                    </div>
                </div>
                <div class="form-group">
                    <label for="fullname">{{$CaptionsLibrary.get("Specification")+" "+$CaptionsLibrary.get("Shareholder")}}</label>
                    <k-input id="fullname" v-model="model.fullname" type="text" class="width-100" />
                </div>
                <div class="form-group">
                    <label for="share">{{$CaptionsLibrary.get("Shares")+" "+$CaptionsLibrary.get("GreaterThan")}}</label>
                    <kendo-numerictextbox v-model.number="model.share" class="width-100"
                                          id="share"
                                          :round="false"
                                          :spinners="true">
                    </kendo-numerictextbox>
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
                            {{$CaptionsLibrary.get('BuyingMostShare')}}
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
                    <kendo-button id="target" v-show="manuModel.ShowMenu == true" :disabled="this.selectedShareholder == null" style="float:left;margin:2px" class="k-button k-primary">
                        <div>
                            <i class="fas fa-caret-square-down"></i>
                        </div>
                    </kendo-button>
                    <div>
                        <kendo-contextmenu :target="'#target'" :show-on="'click'" :align-to-anchor="true">
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
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
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

                <kendo-grid-column :field="'fullname'"
                                   :width="300"
                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                <kendo-grid-column :field="'SHRH_CODE'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'SharePercent'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Percent')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'sumshare'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('ShareCount')"
                                   :footer-template="`#: data.sumshare ? kendo.toString(data.sumshare.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'amnt'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount')"
                                   :footer-template="`#: data.amnt ? kendo.toString(data.amnt.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'cnt'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('TransactionCount')"
                                   :footer-template="`#: data.cnt ? kendo.toString(data.cnt.sum, 'n0') : 0 #`"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptMaxBuyer.ts">
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

    .password-wrapper {
        display: flex;
        align-items: center;
    }

    .password-wrapper button{
        height:2.3rem !important;
        width:2.3rem !important;
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
