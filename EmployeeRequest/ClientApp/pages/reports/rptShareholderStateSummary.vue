<template>
    <div class="rtl page">
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
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true" :width="'60%'">
            <div class="container">
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
                    <label for="finYear">{{$CaptionsLibrary.get("From") +" "+ $CaptionsLibrary.get("FinYear")}}</label>
                    <kendo-combobox v-model="model.finYear"
                                    id="finYear"
                                    ref="finYear"
                                    name="finYear"
                                    :data-source="finYears"
                                    :data-text-field="'FIN_YEAR_CODE'"
                                    :data-value-field="'FIN_YEAR_CODE'"
                                    @select="finYearChanged"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
                </div>
                <div class="form-group break-line">
                    <label for="meetDate">{{$CaptionsLibrary.get("Meeting")}}</label>
                    <sv-datepicker v-model="model.meetDate" name="meetDate" id="meetDate"></sv-datepicker>
                </div>
                <div class="form-group break-line">
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
                            {{$CaptionsLibrary.get('ShareholderStateSummary')}}
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
                        :pageable="true"
                        :reorderable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :locked="true"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_code'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('IdNumber')"></kendo-grid-column>

                <kendo-grid-column :field="'cert_info'"
                                   :width="300"
                                   :locked="true"
                                   :title="$CaptionsLibrary.get('Specification')"
                                   :group-footer-template="$CaptionsLibrary.get('Sum')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_kind_desc'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('ShrhKind')"></kendo-grid-column>

                <kendo-grid-column :field="'cert_no'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('CertificateId')"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_exch_code'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('BBSCode')"></kendo-grid-column>

                <kendo-grid-column :width="300"
                                   :title="this.reportTitle.periodStart"
                                   :columns="detailsColumnsDefinitions">
                </kendo-grid-column>

                <!--<kendo-grid-column :field="'quantityOfStart'"
                       :width="300"
                       :format="'{0:##,#;(0:##,#)}'"
                       :title="this.reportTitle.quantityOfStart"
                       :footer-template="`#: data.quantityOfStart ? kendo.toString(data.quantityOfStart.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

    <kendo-grid-column :field="'financeOfStart'"
                       :width="300"
                       :format="'{0:##,#;(0:##,#)}'"
                       :title="this.reportTitle.financeOfStart"
                       :footer-template="`#: data.financeOfStart ? kendo.toString(data.financeOfStart.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>-->

                <kendo-grid-column :width="200"
                                   :title="this.reportTitle.meetDate"
                                   :columns="detailsColumnsDefinitions3">
                </kendo-grid-column>

                <kendo-grid-column :width="200"
                                   :title="$CaptionsLibrary.get('PastFinYear')"
                                   :columns="detailsColumnsDefinitions4">
                </kendo-grid-column>
                <kendo-grid-column :width="600"
                                   :title="this.reportTitle.capital"
                                   :columns="detailsColumnsDefinitionsCapital">
                </kendo-grid-column>
                <!--<kendo-grid-column :field="'assignFinanceOfPrevFinYear'"
       :width="200"
       :format="'{0:##,#;(0:##,#)}'"
       :title="$CaptionsLibrary.get('AssignProfit')"
       :footer-template="`#: data.assignFinanceOfPrevFinYear ? kendo.toString(data.assignFinanceOfPrevFinYear.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>-->
                <!--<kendo-grid-column :field="'quantityOfMeetDate'"
    :width="300"
    :format="'{0:##,#;(0:##,#)}'"
    :title="this.reportTitle.quantityOfMeetDate"
    :footer-template="`#: data.quantityOfMeetDate ? kendo.toString(data.quantityOfMeetDate.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>-->

                <kendo-grid-column :width="450"
                                   :title="this.reportTitle.periodEnd"
                                   :columns="detailsColumnsDefinitions2">
                </kendo-grid-column>

                <!--<kendo-grid-column :field="'quantityOfEnd'"
                       :width="300"
                       :format="'{0:##,#;(0:##,#)}'"
                       :title="this.reportTitle.quantityOfEnd"
                       :footer-template="`#: data.quantityOfEnd ? kendo.toString(data.quantityOfEnd.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

    <kendo-grid-column :field="'financeOfEnd'"
                       :width="300"
                       :format="'{0:##,#;(0:##,#)}'"
                       :title="this.reportTitle.financeOfEnd"
                       :footer-template="`#: data.financeOfEnd ? kendo.toString(data.financeOfEnd.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>-->
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptShareholderStateSummary.ts">
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
      .k-grid tbody tr {
        cursor: move;
      }

      .placeholder {
        outline-style: dashed;
        outline-width: 1px;
        outline-color: red;
      }
</style>
