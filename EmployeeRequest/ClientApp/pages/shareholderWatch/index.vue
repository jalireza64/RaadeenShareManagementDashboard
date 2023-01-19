<template>
    <div class="rtl page">
        <kendo-window ref="ShareholderWatchesWindow" :title="shareholderWatchModel.operationTypeDesc" :visible="shareholderWatchModel.isShowWindow" :modal="true" :width="'92%'">
            <div class="container">
                <div class="form-group">
                    <label for="title">{{$CaptionsLibrary.get("Title")}}</label>
                    <input type="text" class="k-textbox width-100" id="title" v-model="shareholderWatchModel.title" />
                </div>
                <div class="form-group">
                    <label for="desc">{{$CaptionsLibrary.get("Description")}}</label>
                    <input type="text" class="k-textbox width-100" id="desc" v-model="shareholderWatchModel.desc" />
                </div>
                <div class="form-group" v-show="shareholderWatchModel.isShowSync">
                    <kendo-button @click.prevent="getListFromLocalStorage" class="k-button k-primary">{{$MessagesLibrary.get("SyncWithLastList")}}</kendo-button>
                </div>
                <div class="form-group break-line">
                    <label>{{$CaptionsLibrary.get("Picture")}}</label>
                    <!--<input type="file" @onchange="SelectFile">-->
                    <kendo-upload :files="shareholderWatchModel.files"
                                  :auto-upload="false"
                                  :batch="false"
                                  :multiple="false"
                                  @select="selectFile"
                                  @remove="removeFile"
                                  :with-credentials="false" />
                    <div id="show-text"></div>
                    <!--<sv-textpicker id="approved-text" ref="file" v-model="shareholderWatchModel.file"></sv-textpicker>-->
                </div>
                <div class="form-group">
                    <label for="shrhCode">{{$CaptionsLibrary.get("IdNumber")}}</label>
                    <kendo-multiselect v-model="shareholderWatchModel.shareholderCodeList"
                                       id="shrhCode"
                                       ref="shareholderWatch"
                                       :auto-close="false"
                                       :data-source="shareholderWatchModel.shareholderCodeListDatasource"
                                       @deselect="shareholderWatchDeselect"
                                       :filter="'contains'"
                                       :tag-mode="'single'"
                                       :tagTemplate="'<span>#: data.values.length #'+' '+$CaptionsLibrary.get('ShareholderSelected')+'</span>'"
                                       class="width-100">
                    </kendo-multiselect>
                </div>
                <div class="form-group break-line">
                    <div class="switch-wrapper">
                        <label>{{$CaptionsLibrary.get("Default")}}</label>
                        <kendo-switch v-model="shareholderWatchModel.isDefault" :messages="{checked: '', unchecked: ''}"></kendo-switch>
                    </div>
                </div>
                <div class="form-group break-line">
                    <div class="switch-wrapper">
                        <label>{{$CaptionsLibrary.get("Public")}}</label>
                        <kendo-switch v-model="shareholderWatchModel.isPublic" :messages="{checked: '', unchecked: ''}"></kendo-switch>
                    </div>
                </div>
                <div class="form-group break-line">
                    <kendo-button @click.prevent="operation" class="k-button k-primary">{{$CaptionsLibrary.get("Confirm")}}</kendo-button>
                </div>
            </div>
        </kendo-window>
        <div class="bs-docs-example k-content flex" v-if="kendoMessages">
            <div class="title k-alt" style="display: grid;grid-template-columns: repeat(2, 1fr);">
                <div>
                    <div style="float:right;margin:5px">
                        <i class="fa fa-users"></i>
                        {{$CaptionsLibrary.get('Operation')}}
                    </div>
                </div>
                <div>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" @click.prevent="showAdd">
                        <div>
                            <i class="fa fa-plus"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedShareholderWatch != null" @click.prevent="showEdit">
                        <div>
                            <i class="fa fa-edit"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedShareholderWatch != null" @click.prevent="remove">
                        <div>
                            <i class="fa fa-minus"></i>
                        </div>
                    </kendo-button>
                </div>
            </div>
            <kendo-grid :data-source="reportDataSource"
                        ref="reportGrid"
                        @change="reportGridSelect"
                        :resizable="true"
                        :sortable-mode="'multiple'"
                        :sortable-allow-unsort="true"
                        :sortable-show-indexes="true"
                        :column-menu="true"
                        :selectable="true"
                        :filterable="true"
                        :groupable="true"
                        :pageable="true">

                <kendo-grid-column :field="'Title'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Title')"></kendo-grid-column>

                <kendo-grid-column :field="'Fullname'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('EmployeeInformation')"></kendo-grid-column>

                <kendo-grid-column :field="'IsDefaultDesc'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Default')"></kendo-grid-column>

                <kendo-grid-column :field="'IsPublicDesc'"
                                   :width="200"
                                   :title="$CaptionsLibrary.get('Public')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./index.ts">
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

    .switch-wrapper{
        display: flex;
        align-items: center;
    }

    .switch-wrapper label{
        flex: 1 1;
        text-align: right;
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
