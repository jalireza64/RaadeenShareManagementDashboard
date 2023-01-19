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
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true" :width="'92%'">
            <div class="container">
                <div class="form-group">
                    <label for="shareQuntType">{{$CaptionsLibrary.get("QuantityOfTransaction")}}</label>
                    <kendo-buttongroup id="shareQuntType" :index="3" v-model="model.shareQuntType" @select="shareQuntTypeSelect">
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-less-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-greater-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-equals" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="shareQuntType">{{$CaptionsLibrary.get('Count') +' '+$CaptionsLibrary.get('Transactions')}}</label>
                    <kendo-buttongroup id="shareCountType" :index="3" v-model="model.shareCountType" @select="shareCountTypeSelect">
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-less-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-greater-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-equals" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group">
                    <label for="averageFeeType">{{$CaptionsLibrary.get("Average")+' '+$CaptionsLibrary.get("Fee")+' '+$CaptionsLibrary.get("Transactions")}}</label>
                    <kendo-buttongroup id="averageFeeType" :index="3" v-model="model.averageFeeType" @select="averageFeeTypeSelect">
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-less-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-greater-than" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("Sell")}} <i class="fa fa-equals" style="margin:2px;"></i> {{$CaptionsLibrary.get("Buy")}}</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:100%">{{$CaptionsLibrary.get("All")}}</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="form-group break-line">
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
                    <label for="dateS">{{$CaptionsLibrary.get("FromDate")+' '+$CaptionsLibrary.get("Sell")}}</label>
                    <sv-datepicker v-model="model.dateS" name="dateS" id="dateS"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="dateE">{{$CaptionsLibrary.get("ToDate")+' '+$CaptionsLibrary.get("Sell")}}</label>
                    <sv-datepicker v-model="model.dateE" name="dateE" id="dateE"></sv-datepicker>
                </div>
                <div class="form-group break-line">
                    <label for="dateSBuy">{{$CaptionsLibrary.get("FromDate")+' '+$CaptionsLibrary.get("Buy")}}</label>
                    <sv-datepicker v-model="model.dateSBuy" name="dateSBuy" id="dateSBuy"></sv-datepicker>
                </div>
                <div class="form-group">
                    <label for="dateEBuy">{{$CaptionsLibrary.get("ToDate")+' '+$CaptionsLibrary.get("Buy")}}</label>
                    <sv-datepicker v-model="model.dateEBuy" name="dateEBuy" id="dateEBuy"></sv-datepicker>
                </div>
                <div class="form-group break-line">
                    <label for="sellQnt">{{$CaptionsLibrary.get("Quant")+" "+$CaptionsLibrary.get("Sell")+" "+$CaptionsLibrary.get("Shares")+" "+$CaptionsLibrary.get("GreaterThan")}}</label>
                    <kendo-numerictextbox v-model.number="model.sellQnt" class="width-100"
                                          id="sellQnt"
                                          :round="false"
                                          :spinners="true">
                    </kendo-numerictextbox>
                </div>
                <div class="form-group">
                    <label for="buyQnt">{{$CaptionsLibrary.get("Quant")+" "+$CaptionsLibrary.get("Buy")+" "+$CaptionsLibrary.get("Shares")+" "+$CaptionsLibrary.get("GreaterThan")}}</label>
                    <kendo-numerictextbox v-model.number="model.buyQnt" class="width-100"
                                          id="buyQnt"
                                          :round="false"
                                          :spinners="true">
                    </kendo-numerictextbox>
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
                            {{$CaptionsLibrary.get('ShareSwing')}}
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
                            <i class="fa fa-file-excel"></i>
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
                        :pageable="true"
                        :pdf-all-pages="true"
                        :pdf-avoid-links="true"
                        :pdf-paper-size="'a3'"
                        :pdf-margin="{ top: '2cm', left: '1cm', right: '1cm', bottom: '1cm' }"
                        :pdf-landscape="true"
                        :pdf-repeat-headers="true"
                        :pdf-scale="0.8">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>

                <kendo-grid-column :field="'SHRH_CODE'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('IdNumber')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'fullname'"
                                   :width="300"
                                   :title="$CaptionsLibrary.get('Fullname')"></kendo-grid-column>

                <kendo-grid-column :field="'seller_cnt'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count') +' '+$CaptionsLibrary.get('Transactions')+' '+ $CaptionsLibrary.get('Sell')"
                                   :footer-template="`#: data.seller_cnt ? kendo.toString(data.seller_cnt.sum, '00,0;(00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'seller_sumshare'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count') +' '+$CaptionsLibrary.get('Sell')+' '+$CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.seller_sumshare ? kendo.toString(data.seller_sumshare.sum, '00,0;(00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'sell_fee_avg'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Average') +' '+$CaptionsLibrary.get('Fee')+' '+$CaptionsLibrary.get('Sell')"></kendo-grid-column>

                <kendo-grid-column :field="'seller_amnt'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount') +' '+ $CaptionsLibrary.get('Sell')"></kendo-grid-column>

                <kendo-grid-column :field="'buyer_cnt'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count')+' '+$CaptionsLibrary.get('Transactions')+' '+ $CaptionsLibrary.get('Buy')"
                                   :footer-template="`#: data.buyer_cnt ? kendo.toString(data.buyer_cnt.sum, '00,0;(00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'buyer_sumshare'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count') +' '+$CaptionsLibrary.get('Buy')+' '+$CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.buyer_sumshare ? kendo.toString(data.buyer_sumshare.sum, '00,0;(00,0)') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'buy_fee_avg'"
                                   :width="200"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Average') +' '+$CaptionsLibrary.get('Fee')+' '+$CaptionsLibrary.get('Buy')"></kendo-grid-column>

                <kendo-grid-column :field="'buyer_amnt'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Amount') +' '+ $CaptionsLibrary.get('Buy')"></kendo-grid-column>

                <kendo-grid-column :field="'result'"
                                   :width="150"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Result')"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rptSellerBuyer.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
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
    .k-pdf-export .k-grid {
    font-family: Arial;
}
</style>
