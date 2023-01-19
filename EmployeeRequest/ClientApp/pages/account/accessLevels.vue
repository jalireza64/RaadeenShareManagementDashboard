<template>
    <div class="rtl page">
        <kendo-window ref="AccessLevelsWindow" :title="accessLevelsModel.operationTypeDesc" :visible="accessLevelsModel.isShowWindow" :modal="true">
            <div class="container">
                <div class="form-group">
                    <label for="title">{{$CaptionsLibrary.get("Title")}}</label>
                    <input type="text" class="k-textbox width-100" id="title" v-model="accessLevelsModel.title" />
                </div>
                <div class="form-group">
                    <label for="accessLevel">{{$CaptionsLibrary.get("AccessLevel")}}</label>
                    <kendo-multiselect v-model="accessLevelsModel.accessLevelDetailIds"
                                    id="accessLevel"
                                    :auto-close="false"
                                    :data-source="accessLevelDetails"
                                    :data-text-field="'Value'"
                                    :data-value-field="'Key'"
                                    :filter="'contains'"
                                    :tag-mode="'single'"
                                    :tagTemplate="'<span>#: data.values.length #'+' '+$CaptionsLibrary.get('AccessSelected')+'</span>'"
                                    class="width-100">
                    </kendo-multiselect>
                </div>
                <div class="form-group">
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
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedAccessLevel != null" @click.prevent="showEdit">
                        <div>
                            <i class="fa fa-edit"></i>
                        </div>
                    </kendo-button>
                    <kendo-button style="float:left;margin:2px" class="k-button k-primary" v-show="selectedAccessLevel != null" @click.prevent="remove">
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
                                   :title="$CaptionsLibrary.get('AccessLevel')"></kendo-grid-column>

            </kendo-grid>
        </div>
    </div>
</template>

<script lang="ts" src="./accessLevels.ts">
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
