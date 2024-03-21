<template>
  <div class="mt-4">
    <div class="flex flex-d-column gap-4 pl-5">
      <el-form
        label-width="auto"
        style="max-width: 600px"
        class="flex"
      >
        <el-form-item class="flex flex-d-column">
          <template v-slot:label>
            <span>Поиск</span>
          </template>
          <el-input
            @change="
              (val) => {
                productStore.search(val, select);
              }
            "
            v-model="input"
            style="width: 280px"
            size="large"
            placeholder="Поиск"
            :prefix-icon="Search"
          />
        </el-form-item>
        <el-form-item class="flex ml-5 flex-d-column">
          <template v-slot:label>
            <span>Категория</span>
          </template>
          <el-select
            @change="
              (val) => {
                productStore.search(input, val);
              }
            "
            v-model="select"
            size="large"
            placeholder="Выбрать"
            style="width: 180px"
          >
            <el-option
              v-for="category in [{ id: '', name: 'Все' }, ...categoryList]"
              :label="category.name"
              :value="category.id.toString()"
            />
          </el-select>
        </el-form-item>

        <el-button
          class="mt-8 ml-5"
          size="large"
          type="primary"
          :icon="Plus"
          @click="
            () => {
              dialogData = {product_visibility: true};
              centerDialogVisible = true;
              dialogKey = dialogKey+1;
            }
          "
          >Добавить</el-button
        >
      </el-form>

      <el-table
        id="table"
        v-loading="productStore.loading"
        :data="productStore.data"
        border
        style="width: 90%"
        class="table-font"
        height="60vh"
      >
        <el-table-column prop="model" label="Модель" />
        <el-table-column prop="release_date" label="Год релиза">
          <template #default="scope">
            <span>
              {{ moment(Date.parse(scope.row.release_date)).format("YYYY") }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="Цена">
          <template #default="scope">
            <span>{{
              productStore.moneyFormatter(scope.row.amount / 100)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="Описание товара" />
        <el-table-column prop="created_at" label="Дата добавления">
          <template #default="scope">
            <span>
              {{
                scope.row.created_at
                  ? moment(Date.parse(scope.row.created_at)).format(
                      "YYYY-MM-DD"
                    )
                  : ""
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="product_visibility" label="Активный">
          <template #default="scope">
            <el-checkbox
              :disabled="true"
              v-model="scope.row.product_visibility"
              size="large"
            />
          </template>
        </el-table-column>

        <el-table-column prop="category" label="Категория">
          <template #default="scope">
            <span>
              {{
                categoryList.find((c: any) => c.id == scope.row.category)!.name
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="130" prop="action" label="Действие">
          <template #default="scope">
            <el-button
              plain
              text
              type="primary"
              size="large"
              @click="
                async () => {
                  dialogData = scope.row;
                  centerDialogVisible = true;
                  dialogKey = dialogKey+1;
                }
              "
              >Изменить</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 150px; height: 150px">
        <el-pagination
          background
          @change="
            (v) => {
              productStore.get(v);
            }
          "
          layout="prev, pager, next"
          :total="parseInt(productStore.total.toString())"
        />
      </div>
    </div>
  </div>
  <ProductDialog :key="dialogKey" :active="centerDialogVisible" :data="dialogData"></ProductDialog>
  
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import { useProductsStore } from "~/stores/products";
import moment from "moment";
import ProductDialog from '~/components/dialog/ProductDialog.vue'
const input = ref("");
const select = ref("");

const productStore = useProductsStore();
const dialogKey = ref(0);
const centerDialogVisible = ref(false);
productStore.get();


const dialogData = ref({});

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

<style>
body {
  overflow: hidden;
}

.input-with-select .ep-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}

.ep-form-item__label-wrap {
  margin-left: 5px !important;
}

.flex-d-column {
  flex-direction: column;
  justify-items: start;
  align-items: start;
}

.table-font {
  font-size: small;
}

.table-font .ep-table__header th {
  height: 60px;
  text-align: center;
  align-items: center;
  font-weight: 700;
  background-color: #f8f8f8;
}
.table-font .ep-table__row td {
  text-align: center;
}

.ep-overlay-message-box{
    height: 100vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.ep-message-box--center{
    height: auto;
    padding: 20px;
    background: white;
    width: 260px;
}
</style>
