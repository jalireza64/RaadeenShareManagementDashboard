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
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
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
                    <label for="type">{{$CaptionsLibrary.get("Type")}}</label>
                    <kendo-combobox v-model="model.type"
                                    id="type"
                                    ref="type"
                                    name="type"
                                    :data-source="shrOprCodeArray"
                                    :data-text-field="'text'"
                                    :data-value-field="'value'"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
                </div>
                <div class="form-group">
                    <label for="finYearS">{{$CaptionsLibrary.get("FinYear")+' '+$CaptionsLibrary.get("From")}}</label>
                    <kendo-combobox v-model="model.finYearS"
                                    id="finYearS"
                                    ref="finYearS"
                                    name="finYearS"
                                    :data-source="finYears"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
                </div>
                <div class="form-group">
                    <label for="finYearE">{{$CaptionsLibrary.get("FinYear")+' '+$CaptionsLibrary.get("From")}}</label>
                    <kendo-combobox v-model="model.finYearE"
                                    id="finYearE"
                                    ref="finYearE"
                                    name="finYearE"
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
                            {{$CaptionsLibrary.get('FinancialSummary')}}
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
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'opr_code_desc'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('Type')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'bes1'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Assign')"
                                   :footer-template="`#: data.bes1 ? kendo.toString(data.bes1.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'bes2'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Assign')+' '+$CaptionsLibrary.get('Transitional')"
                                   :footer-template="`#: data.bes2 ? kendo.toString(data.bes2.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'bed1'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('PayTo')"
                                   :footer-template="`#: data.bed1 ? kendo.toString(data.bed1.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'bed2'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('PayTo')+' '+$CaptionsLibrary.get('Transitional')"
                                   :footer-template="`#: data.bed2 ? kendo.toString(data.bed2.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'remain'"
                                   :width="200"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Remain')"
                                   :footer-template="`#: data.remain ? kendo.toString(data.remain.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt17.ts">
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
