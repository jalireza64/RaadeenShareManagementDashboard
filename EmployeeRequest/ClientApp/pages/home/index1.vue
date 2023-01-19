<template>
    <div class="rtl" v-if="kendoMessages">
        <div class="bs-docs-example" data-content="اطلاعات شناسنامه ای">
            <div class="container">
                <div class="form-group">
                    <label>{{$CaptionsLibrary.get("Name")}}</label>
                    <kendo-maskedtextbox class="width-100">
                    </kendo-maskedtextbox>
                </div>
                <div class="form-group">
                    <label>نام خانوادگی</label>
                    <kendo-maskedtextbox class="width-100">
                    </kendo-maskedtextbox>
                </div>
                <div class="form-group break-line">
                    <label>محل سکونت</label>
                    <kendo-dropdownlist v-model.number="model.city"
                                        :data-source="cities"
                                        :data-text-field="'text'"
                                        :data-value-field="'value'"
                                        :filter="'contains'"
                                         class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group">
                    <label>جنسیت</label>
                    <kendo-dropdownlist v-model.number="model.gender"
                                        :data-source="genders"
                                        :data-text-field="'text'"
                                        :data-value-field="'value'"
                                        :filter="'contains'"
                                         class="width-100">
                    </kendo-dropdownlist>
                </div>
                <div class="form-group break-line">
                    <label>شاغل</label>
                    <kendo-switch v-model="checked" :messages="{checked: '', unchecked: ''}"></kendo-switch>
                </div>
            </div>
        </div>
        <br />
        <div class="bs-docs-example" data-content="تصویر و موقعیت جغرافیایی">
            <div class="container">
                <div class="form-group break-line">
                    <label>تصویر</label>
                    <sv-imagepicker id="approved-image"
                                    v-model="model.image"></sv-imagepicker>
                </div>
                <div class="form-group break-line">
                    <button class="k-button" @click="hi" :disabled="!checked">موقعیت جغرافیایی</button>
                </div>
            </div>
        </div>
        <br />
        <div class="bs-docs-example" data-content="دریافت اعلان">
            <div class="container">
                <div class="form-group">
                    <button class="k-button" @click="push" :disabled="!checked">دنبال کردن</button>
                </div>
                <div class="form-group">
                    <button class="k-button" @click="triggerPush" :disabled="!checked">دریافت اعلان</button>
                </div>
                <div class="form-group">
                    <button class="k-button" @click.prevent="showNotification" :disabled="!checked">نمایش اعلان</button>
                </div>
                <div class="form-group">
                    <kendo-button icon="cancel">انصراف</kendo-button>
                </div>
                <div class="form-group">
                    <kendo-buttongroup>
                        <kendo-buttongroup-button style="width:50px">اول</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:50px">دوم</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:50px">سوم</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:50px">چهارم</kendo-buttongroup-button>
                        <kendo-buttongroup-button style="width:50px">پنجم</kendo-buttongroup-button>
                    </kendo-buttongroup>
                </div>
                <div class="whole-row">
                    <kendo-grid :data-source="localDataSource"
                                :filterable="true">
                        <kendo-grid-column :field="'ProductID'"
                                           :title="'ID'"
                                           :width="40"></kendo-grid-column>
                        <kendo-grid-column :field="'ProductName'"
                                           :title="'نام و نام خانوادگی'"
                                           :width="120"></kendo-grid-column>
                        <kendo-grid-column :field="'UnitPrice'"
                                           :title="'کد ملی'"
                                           :width="120"
                                           :format="'{0:c}'"></kendo-grid-column>
                        <kendo-grid-column :field="'UnitsInStock'"
                                           :title="'شماره شناسنامه'"
                                           :width="120"></kendo-grid-column>
                        <kendo-grid-column :field="'Discontinued'"
                                           :width="120"
                                           :title="'شاغل'"></kendo-grid-column>
                    </kendo-grid>
                </div>
            </div>
        </div>
        <br />
    </div>
</template>

<script lang="ts" src="./index1.ts">
</script>

<style scoped>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 20px;
    }
</style>
