import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios, { AxiosError } from "axios";
import moment from "moment";

interface Product {
    id: Number;
    model: String;
    release_date: String;
    category: Number;
    amount: Number;
    description: String;
    created_at: String;
    product_visibility: Boolean;
    product_image: String;
  }

export const useProductsStore = defineStore("products", () => {

  const total = ref(0 as number);
  const loading = ref(false);
  const loaded = ref(false);
  const response = ref({} as any);
  const dataProds = ref({data: [] as any});
  const data = computed(()=> dataProds.value.data);
  const endpoint = "https://deviceshopmaster-json-server.onrender.com";
  function moneyFormatter(amount: number){
        const amountString = amount.toString();
      return Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).formatToParts(amount).map(
        p => p.type != 'literal' && p.type != 'currency' ? p.value : ''
      ).join('')
        .slice(0, undefined)
  }

  async function get(_page: number = 1) {
    loading.value = true;
    try {
      const _response = await axios.get(endpoint+"/products", {
        params: {
          _page: _page
        }
      });

      response.value = _response;
      dataProds.value.data = response.value.data;
      total.value = _response.headers["x-total-count"] as number;
      loaded.value = true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }
    } finally {
        loading.value = false;
    }
  }

  async function search(value: String, category?: string) {
    loading.value = true;
    try {
      const _response = await axios.get(endpoint+"/products", {
        params: {
          model_like: value,
          category: category != '' ? category : null
        }
      });
      response.value = _response;
      loaded.value = true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }
    } finally {
        loading.value = false;
    }
  }

  async function create(_data: Product) {
    loading.value = true;
    try {
      const _response = await axios.post(endpoint+"/products", { 
        model: _data.model,
        amount: _data.amount.toString().replaceAll(' ', '').replaceAll(',', '.'),
        category: _data.category,
        description: _data.description,
        created_at: moment(Date.now()).format("YYYY-MM-DD"),
        product_image: _data.product_image,
        product_visibility: _data.product_visibility,
        release_date: _data.release_date
       });
      loaded.value = true;
      return _response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }
    } finally {
        loading.value = false;
    }
    
  }

  async function update(id: Number, _data: Product) {
    loading.value = true;
    try {
      const _response = await axios.patch(endpoint+"/products/"+id, {
        model: _data.model,
        amount: _data.amount.toString().replaceAll(' ', '').replaceAll(',', '.'),
        category: _data.category,
        description: _data.description,
        product_image: _data.product_image,
        product_visibility: _data.product_visibility,
        release_date: _data.release_date
      });
      loaded.value = true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }
    } finally {
        loading.value = false;
    }
  }

  async function remove(id: Number) {
    loading.value = true;
    try {
      const _response = await axios.delete(endpoint+"/products/"+id);
      loaded.value = true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // handleAxiosError(error);
      } else {
        // handleUnexpectedError(error);
      }
    } finally {
        loading.value = false;
    }
  }

  return { loading, loaded, response, data, dataProds, total, get, update, create, remove, search, moneyFormatter };
});