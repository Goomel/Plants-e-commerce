<template>
  <v-row>
    <v-col>
      <v-form @submit.prevent="searchProducts(searchValue)">
        <v-text-field
          label="Search"
          variant="underlined"
          v-model="searchValue"
          ref="searchInput"
        >
          <template v-slot:prepend>
            <v-btn type="submit" icon="mdi-magnify" size="medium" />
          </template>
          <template v-slot:append>
            <v-btn icon="mdi-close" size="medium" @click="closeSearch" />
          </template>
        </v-text-field>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useProductsStore } from "@/store/products";
import { storeToRefs } from "pinia";

const { isSearchActive, searchValue, filters, currentProducts, maxPriceRange } =
  storeToRefs(useProductsStore());
const { searchProducts, fetchProducts } = useProductsStore();

const closeSearch = () => {
  isSearchActive.value = false;
  searchValue.value = "";
  filters.value.priceRange = [0, maxPriceRange.value];
  fetchProducts(currentProducts.value);
};
</script>

<style scoped></style>
