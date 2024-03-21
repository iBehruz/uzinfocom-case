<template>
  <el-dialog
    v-model="centerDialogVisible"
    :title="
      props.data?.id != null
        ? 'Редоктирование товара - #' + props.data?.id + ' ' + props.data?.model
        : 'Добовление товара'
    "
    width="600"
    center
    :align-center="true"
    :draggable="true"
  >
    <el-form
      @submit="onSubmit"
      label-width="auto"
      style="max-width: 600px"
      class="flex"
    >
      <span>
        <div class="flex flex-d-column">
          <div class="flex">
            <el-form-item v-bind="modelProps" class="flex flex-d-column">
              <template v-slot:label>
                <span>Модель</span>
              </template>
              <el-input
                v-model="model"
                style="width: 270px"
                size="large"
                placeholder="Название модели"
              />
            </el-form-item>
            <el-form-item
              v-bind="release_dateProps"
              class="flex ml-5 flex-d-column"
            >
              <template v-slot:label>
                <span>Год релиза</span>
              </template>

              <el-date-picker
                style="width: 270px"
                v-model="release_date"
                type="year"
                placeholder="xxxx-xx-xx"
                size="large"
              />
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item v-bind="categoryProps" class="flex flex-d-column">
              <template v-slot:label>
                <span>Категория</span>
              </template>
              <el-select
                v-model="category"
                size="large"
                placeholder="Выбрать"
                style="width: 270px"
              >
                <el-option
                  v-for="category in categoryList"
                  :label="category.name"
                  :value="parseInt(category.id)"
                />
              </el-select>
            </el-form-item>

            <el-form-item v-bind="amountProps" class="flex ml-5 flex-d-column">
              <template v-slot:label>
                <span>Рекомендуемая розничная цена</span>
              </template>
              <el-input
                v-maska:[options]
                v-model="amount"
                style="width: 270px"
                size="large"
                placeholder="0"
              />
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item v-bind="created_atProps" class="flex flex-d-column">
              <template v-slot:label>
                <span>Дата добавления товара в систему </span>
              </template>
              <el-date-picker
                style="width: 270px"
                v-model="created_at"
                type="date"
                placeholder="xxxx-xx-xx"
                size="large"
              />
            </el-form-item>
            <el-form-item
              v-bind="product_visibilityProps"
              class="flex ml-5 flex-d-column"
            >
              <template v-slot:label>
                <span>Активный</span>
              </template>
              <el-switch
                v-model="product_visibility"
                size="large"
                label="Видимость товара для пользователей магазина"
              />
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item v-bind="descriptionProps" class="flex flex-d-column">
              <template v-slot:label>
                <span>Описание </span>
              </template>
              <el-input
                v-model="description"
                style="width: 560px"
                :rows="5"
                type="textarea"
                placeholder="Описание товара"
              />
            </el-form-item>
          </div>
          <div class="dialog-footer">
            <el-button
              v-if="props.data?.id == null"
              type="primary"
              native-type="submit"
            >
              Добавить
            </el-button>

            <el-button
              type="danger"
              v-if="props.data?.id != null"
              @click="async ()=>{
                confirmDeletion();

              }"
              >Удалить</el-button
            >
            <el-button
              v-if="props.data?.id != null"
              native-type="submit"
              type="primary"
            >
              Сохронить
            </el-button>
          </div>
        </div>
      </span>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import { useProductsStore } from "~/stores/products";
import moment from "moment";
import { vMaska } from "maska";

import { useForm } from "vee-validate";
import * as yup from "yup";
import { toTypedSchema } from "@vee-validate/yup";

const props = defineProps({
  active: Boolean,
  data: Object,
});

const options = reactive({
  mask: "0.99",
  // eslint-disable-next-line no-useless-escape
  tokens: {
    0: { multiple: true },
    9: { optional: true },
  },
  preProcess: (val: any) => val.replaceAll(" ", ""),
  postProcess: (val: any) => {
    if (!val) {
      return "";
    }
    const sub = 3 - (val.includes(",") ? val.length - val.indexOf(",") : 0);
    console.log(val.replaceAll(" ", ""), sub);
    return Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    })
      .formatToParts(val.replaceAll(",", "."))
      .map((p) => (p.type != "literal" && p.type != "currency" ? p.value : ""))
      .join("")
      .slice(0, sub ? -sub : undefined);
  },
});

const productStore = useProductsStore();
const centerDialogVisible = ref(props.active ?? false);
productStore.get();
const toast = (text: string) => {
  ElMessage.success(text);
};

const confirmDeletion = () => {
    centerDialogVisible.value = false;
  ElMessageBox.confirm(
    'Вы действительно хотите удалить товар #'+props.data?.id+' '+props.data?.model+' ?',
    '',
    {
      confirmButtonText: 'Да',
      cancelButtonText: 'Нет',
        showClose: false,
      center: true
    }
  )
    .then(async () => {
        await productStore.remove(props.data?.id);
                  
                  toast('Товар удалено')
                  productStore.get();
    })
    .catch(() => {
        
    })
}


const schema = toTypedSchema(
  yup.object({
    model: yup.string().required("Заполните обязательное поля").label("Model"),
    release_date: yup
      .string()
      .required("Заполните обязательное поля")
      .label("Release date"),
    amount: yup
      .string()
      .required("Заполните обязательное поля")
      .label("Amount"),
    category: yup
      .number()
      .required("Заполните обязательное поля")
      .label("Category"),
    created_at: yup.string(),
    product_visibility: yup.boolean(),
    description: yup.string(),
  })
);

const forma = useForm({
  validationSchema: schema,
  initialValues: props.data,
});

const { defineField, handleSubmit, resetForm, errors } = forma;

const elPlusConfig = (state: any) => ({
  props: {
    validateEvent: false,
    error: state.errors[0],
    required: state.required,
  },
});

const [model, modelProps] = defineField("model", elPlusConfig);
const [category, categoryProps] = defineField("category", elPlusConfig);
const [release_date, release_dateProps] = defineField(
  "release_date",
  elPlusConfig
);
const [created_at, created_atProps] = defineField("created_at", elPlusConfig);
const [product_visibility, product_visibilityProps] = defineField(
  "product_visibility",
  elPlusConfig
);
const [amount, amountProps] = defineField("amount", elPlusConfig);
const [description, descriptionProps] = defineField(
  "description",
  elPlusConfig
);

const onSubmit = handleSubmit(async (values) => {
  if (props.data?.id != null) {
    await productStore.update(props.data?.id!, values as any);
    centerDialogVisible.value = false;
    toast("Товар обновлен");
    productStore.get();
  } else {
    await productStore.create(values as any);
    centerDialogVisible.value = false;
    toast("Товар успешно создана");
    productStore.get();
  }
});

const categoryList = ref([
  {
    id: "1",
    name: "Битовая техника",
  },
  {
    id: "2",
    name: "Футболки",
  },
  {
    id: "3",
    name: "Ноутбуки",
  },
  {
    id: "4",
    name: "Смартфоны",
  },
]);
</script>

