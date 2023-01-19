<template>
    <div class="rtl page">
        <kendo-window ref="FilterWindow" :title="$CaptionsLibrary.get('Filter')" :visible="model.isShowFilter" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="effDate">{{$CaptionsLibrary.get("FromTransDate")}}</label>
                    <sv-datepicker v-model="model.effDate" name="effDate" id="effDate"></sv-datepicker>
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
                            {{$CaptionsLibrary.get('ShareholderCombination')}}
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
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">
                <kendo-grid-column :template="`#: ++record #`"
                                   :width="50"></kendo-grid-column>


                <kendo-grid-column :field="'shrh_kind_desc'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Type')"
                                   :footer-template="$CaptionsLibrary.get('SumTotal')"></kendo-grid-column>

                <kendo-grid-column :field="'shrh_code_count'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count') +' '+ $CaptionsLibrary.get('Shareholder')"
                                   :footer-template="`#: data.shrh_code_count ? kendo.toString(data.shrh_code_count.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'shareholder_percent'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Percent') +' '+ $CaptionsLibrary.get('Shareholder')"
                                   :footer-template="`#: data.shareholder_percent ? kendo.toString(data.shareholder_percent.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'share_percent'"
                                   :width="100"
                                   :title="$CaptionsLibrary.get('Percent') +' '+ $CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.share_percent ? kendo.toString(data.share_percent.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'share'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Count') +' '+ $CaptionsLibrary.get('Shares')"
                                   :footer-template="`#: data.share ? kendo.toString(data.share.sum, 'n0') : 0 #`"></kendo-grid-column>

                <kendo-grid-column :field="'average'"
                                   :width="100"
                                   :format="'{0:##,#}'"
                                   :title="$CaptionsLibrary.get('Average')"></kendo-grid-column>
            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./rpt14.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-gap: 20px;
        padding: 10px;
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
