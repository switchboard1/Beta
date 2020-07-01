<template>
  <div>
    <v-container>
      <v-row justify="center">
        <v-col cols="10" v-if="dataLoading">Loading...</v-col>
        <v-col cols="10" v-else>
          <CategoryFilter :home="true" />
          <div class="mt-4">
            <noitem-card v-if="noResult" />
            <template v-else>
              <div v-for="data in filteredData" :key="data.id" style="border-top: 2px solid #eee">
                <Collection v-if="data.title" :collection="data" :favoritePage="false" />
                <Product v-if="data.productTitle" :product="data" :favoritePage="false" />
                <User v-if="data.firstname" :user="data" />
              </div>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CategoryFilter from "@/components/CategoryFilter";
import Collection from "@/components/filter_items/Collection";
import Product from "@/components/filter_items/Product";
import User from "@/components/filter_items/User";
import NoitemCard from "@/components/NoitemCard";
export default {
  components: {
    CategoryFilter,
    Collection,
    Product,
    User,
    NoitemCard
  },
  computed: {
    ...mapGetters({
      dataLoading: "categories/getDataLoading",
      noResult: "categories/getNoResult",
      filteredData: "categories/getFilteredData"
    })
  },
  mounted() {
    const dashboardPage = false;
    this.$store.dispatch("categories/fetchAllData", true);
  }
};
</script>

<style></style>
