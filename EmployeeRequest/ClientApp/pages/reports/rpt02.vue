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
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true" :width="'92%'">
            <div class="container">
                <!--<div class="form-group">
        <label for="onlyWatch">{{$CaptionsLibrary.get("OnlyWatch")}}</label>
        <kendo-buttongroup id="onlyWatch" :index="0" @select="onlyWatchSelect">
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
                    <label for="shrhKind">{{$CaptionsLibrary.get("ShrhKind")}}</label>
                    <kendo-buttongroup id="shrhKind" :index="2" v-model="model.shrhKind" @select="shrhKindFlagSelect">
                        <kendo-buttongroup-button selected-value="1" style="width:100%">{{$CaptionsLibrary.get("Actual")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="2" style="width:100%">{{$CaptionsLibrary.get("Legal")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button selected-value="0" style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
                    <label for="dateS">{{$CaptionsLibrary.get("FromDate")}}</label>
                    <sv-datepicker v-model="model.dateS" name="dateS" id="dateS"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="dateE">{{$CaptionsLibrary.get("ToDate")}}</label>
                    <sv-datepicker v-model="model.dateE" name="dateE" id="dateE"></sv-datepicker>
                </div>
                <div class="form-group break-line">
                    <label for="share">{{$CaptionsLibrary.get("ShareCount")}}</label>
                    <kendo-rangeslider id="share"
                                       :selection-start="model.shareS"
                                       :selection-end="model.shareE"
                                       :min="0"
                                       :max="5000000000"
                                       :large-step="10000000000"
                                       :small-step="1000000"
                                       :change="shareChange"
                                       class="width-100">
                    </kendo-rangeslider>
                </div>
                <div class="form-group">
                    <label for="share">{{$CaptionsLibrary.get("ShareCount")}}</label>
                    <div class="captcha-wrapper">
                        <kendo-numerictextbox v-model.number="model.shareS" class="width-100"
                                              id="shareS"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                        <kendo-numerictextbox v-model.number="model.shareE" class="width-100"
                                              id="shareE"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                    </div>
                </div>
                <div class="form-group break-line">
                    <label for="shrQunt">{{$CaptionsLibrary.get("Percent")+" "+$CaptionsLibrary.get("Shares")}}</label>
                    <kendo-rangeslider id="shrQunt"
                                       :selection-start="model.shrQuntS"
                                       :selection-end="model.shrQuntE"
                                       :min="0"
                                       :max="100"
                                       :large-step="20"
                                       :small-step="5"
                                       :change="shrQuntChange"
                                       class="width-100">
                    </kendo-rangeslider>
                </div>

                <div class="form-group">
                    <label for="shrQunt">{{$CaptionsLibrary.get("Percent")+" "+$CaptionsLibrary.get("Shares")}}</label>
                    <div class="captcha-wrapper">
                        <kendo-numerictextbox v-model.number="model.shrQuntS" class="width-100"
                                              id="shrQuntS"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                        <kendo-numerictextbox v-model.number="model.shrQuntE" class="width-100"
                                              id="shareE"
                                              :round="false"
                                              :spinners="true">
                        </kendo-numerictextbox>
                    </div>
                </div>
                <!--<div class="form-group break-line">
        <label for="share">{{$CaptionsLibrary.get("ShareCount")+" "+$CaptionsLibrary.get("From")}}</label>
        <kendo-numerictextbox v-model.number="model.shareS" class="width-100"
                              id="share"
                              :round="false"
                              :spinners="true">
        </kendo-numerictextbox>
    </div>-->
                <div class="form-group break-line">
                    <label for="trnsKind">{{$CaptionsLibrary.get("Type")}}</label>
                    <kendo-combobox v-model="model.trnsKind"
                                    id="trnsKind"
                                    ref="trnsKind"
                                    name="trnsKind"
                                    :data-source="trnsKindArray"
                                    :data-text-field="'text'"
                                    :data-value-field="'value'"
                                    :filter="'contains'"
                                    class="width-100">
                    </kendo-combobox>
                </div>
                <div class="form-group break-line">
                    <label for="relTypeFlag">{{$CaptionsLibrary.get("WithShareholderRelationInfo")}}</label>
                    <kendo-buttongroup id="relTypeFlag" :index="1" @select="relTypeFlagSelect">
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Yes")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("No")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
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
                            {{$CaptionsLibrary.get('ShareholderQuantity')}}
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
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_code'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('IdNumber')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'name1'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Name')"></kendo-grid-column>

                <kendo-grid-column :field="'surname'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Family')"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_exch_code'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('BBSCode')"></kendo-grid-column>

                <kendo-grid-column :field="'mojudi_aval'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('StartQuantity')"
                                   :footer-template="`#: data.mojudi_aval ? kendo.toString(data.mojudi_aval.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'saham_kharidar'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Count')+' '+$CaptionsLibrary.get('Imported')"
                                   :footer-template="`#: data.saham_kharidar ? kendo.toString(data.saham_kharidar.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'amnt_kharidar'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Amount')+' '+$CaptionsLibrary.get('Imported')"
                                   :footer-template="`#: data.amnt_kharidar ? kendo.toString(data.amnt_kharidar.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'saham_forukhteh'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Count')+' '+$CaptionsLibrary.get('Exported')"
                                   :footer-template="`#: data.saham_forukhteh ? kendo.toString(data.saham_forukhteh.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'amnt_forukhteh'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Amount')+' '+$CaptionsLibrary.get('Exported')"
                                   :footer-template="`#: data.amnt_forukhteh ? kendo.toString(data.amnt_forukhteh.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'maande'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Remain')+' '+$CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.maande ? kendo.toString(data.maande.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'share_prcnt'"
                                   :width="150"
                                   :title="$CaptionsLibrary.get('Percent')"
                                   :footer-template="`#: data.share_prcnt ? kendo.toString(data.share_prcnt.sum, '0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'rem_amnt'"
                                   :width="150"
                                   :format="'{0:##,#;(0:##,#)}'"
                                   :title="$CaptionsLibrary.get('Remain')+' '+$CaptionsLibrary.get('Finance')"
                                   :footer-template="`#: data.rem_amnt ? kendo.toString(data.rem_amnt.sum, '0:00,0;(0:00,0)') : 0 #`"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt02.ts">
</script>

<style scoped>
        .captcha-wrapper {
        display: flex;
        align-items: center;
    }
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
