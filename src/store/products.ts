import { defineStore } from 'pinia'
import { request } from '@/datocms';
import { ref, computed, watch} from 'vue';
import { Category, Product, TypeOfProducts } from '@/types'
import { Filter } from '@/types'

export const useProductsStore = defineStore('products', ()=>{
  const products = ref<Product[]>([]);
  const product = ref<Product>();
  const loading = ref(false);
  const isSearchActive = ref(false);
  const searchValue = ref('');
  const error = ref<Error | unknown>();
  const currentProducts = ref(TypeOfProducts.All)
  const filteredProducts = computed(()=>{
    return products.value.filter(product => {
      if (filters.value.priceRange[0] > product.price){
        return false
      }
      if (filters.value.priceRange[1] < product.price){
        return false
      }
      if (filters.value.category && product.category !== filters.value.category){
        return false
      }
      if (filters.value.size && filters.value.size !== 'ALL' && product.size !== filters.value.size){
        return false
      }
      return true
    })
  })

  const maxPriceRange = 50;

  const filters = ref<Filter>(
    {
      priceRange: [0, maxPriceRange],
      category: null,
      size: 'ALL',
    }
  )

  const highestPrice = computed(()=>Math.max(...filteredProducts.value.map(product => product.price)))

  watch(highestPrice, (newHighestPrice)=>{
    if(newHighestPrice === -Infinity){
      filters.value.priceRange[1] = maxPriceRange
    }
    else{
      filters.value.priceRange[1] = newHighestPrice
    }
  })

  const fetchProducts = async (filter: TypeOfProducts = TypeOfProducts.All) => {
    error.value = null;
    loading.value = true;
    try {
      const res = await request({
        query: `query{
          allProducts${filter ? `(filter: { ${filter}: { eq: true } })` : '' } {
            id
            name
            price
            category
            size
            images {
              url
              }
            popular
            new
            }
          }`,
        variables: undefined,
        includeDrafts: undefined,
        excludeInvalid: undefined
      });
      products.value = res.allProducts;
    } catch (e) {
      error.value = e;
    }
    loading.value = false;
}

  const fetchProduct = async (id: string)=>{
    error.value = null;
    loading.value = true;
    try {
      const res = await request({
        query: `
        query{
          product(filter: { id: { eq: ${id} } }){
              id
              name
              price
              category
              size
              description
              images {
                url
                }
          }
        }
        `,
        variables: undefined,
        includeDrafts: undefined,
        excludeInvalid: undefined
      });
      product.value = res.product;
    } catch (e) {
      error.value = e;
    }
    loading.value = false;
  }

  const searchProducts = async (name: string) =>{
    if(name && typeof name == 'string'){
      try {
        const res = await request({
          query: `query {
            allProducts(
              filter: {
                name: {
                  matches: { pattern: "${name}", caseSensitive: false }
                }
              }
            ) {
              id
              name
              price
              category
              size
              images {
                url
                }
              popular
              new
            } 
          }`,
          variables: undefined,
          includeDrafts: undefined,
          excludeInvalid: undefined
        });
          products.value = res.allProducts;
          filters.value.priceRange = [0, maxPriceRange]
      } catch (e) {
        error.value = e;
      }
    }
  }

  const updateCategory = (category: Category) =>{
    if(filters.value.category != category) filters.value.category = category
    else filters.value.category = null
  }

  const updateCurrentProducts = (currentType: TypeOfProducts) =>{
    currentProducts.value = currentType
    fetchProducts(currentProducts.value)
  }
  
  const resetFilters = () => {
    filters.value = {
      priceRange: [0, maxPriceRange],
      category: null,
      size: "ALL",
    };
  };

  return {products, product, error, loading, fetchProducts, fetchProduct, filteredProducts, filters, updateCategory, currentProducts, updateCurrentProducts, highestPrice, resetFilters, isSearchActive, searchProducts, searchValue}
})