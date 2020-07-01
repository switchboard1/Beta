<template>
  <v-container style="overflow-x: hidden;">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <CategoryFilter :favorite="true" />
      <div style="width: 90%" class="mx-auto mt-8">
        Sort by:
        <v-btn
          v-if="newestDescending"
          text
          :class="{
            'pink--text': filterType === 'newest',
            'grey--text': filterType !== 'newest'
          }"
          @click="filterList('newest-descending')"
        >Newest</v-btn>
        <v-btn
          v-else
          text
          :class="{
            'pink--text': filterType === 'newest-descending',
            'grey--text': filterType !== 'newest-descending'
          }"
          @click="filterList('newest')"
        >Newest</v-btn>/
        <v-btn
          v-if="createdDescending"
          text
          :class="{
            'pink--text': filterType === 'created',
            'grey--text': filterType !== 'created'
          }"
          @click="filterList('created-descending')"
        >Created</v-btn>
        <v-btn
          v-else
          text
          :class="{
            'pink--text': filterType === 'created-descending',
            'grey--text': filterType !== 'created-descending'
          }"
          @click="filterList('created')"
        >Created</v-btn>/
        <v-btn
          text
          v-if="categoryDescending"
          :class="{
            'pink--text': filterType === 'category',
            'grey--text': filterType !== 'category'
          }"
          @click="filterList('category-descending')"
        >Category</v-btn>
        <v-btn
          text
          v-else
          :class="{
            'pink--text': filterType === 'category-descending',
            'grey--text': filterType !== 'category-descending'
          }"
          @click="filterList('category')"
        >Category</v-btn>
      </div>
      <v-row>
        <v-col
          sm="10"
          md="10"
          lg="10"
          cols="12"
          style="border-right: 2px solid #eee; border-left: 2px solid #eee"
        >
          <div class="mt-4 mx-auto" style="width: 90%">
            <NoitemCard v-if="noResult && !noFavorite" />
            <div v-if="noFavorite">Nothing in favorites yet.</div>
            <template v-else>
              <div v-for="data in filteredData" :key="data.id" style="border-top: 2px solid #eee">
                <Collection :collection="data" v-if="data.title" :favoritePage="true" />
                <Product :product="data" v-if="data.productTitle" :favoritePage="true" />
                <User :user="data" v-if="data.firstname" />
              </div>
            </template>
          </div>
        </v-col>
        <v-col sm="2" md="2" lg="2" cols="12" :hidden="$vuetify.breakpoint.xsOnly">
          <v-row class="flex-column ml-4" no-gutters align="start">
            <h3 class="grey--text mb-4 px-4">Tools</h3>
            <v-btn to="/dashboard" text class="mb-2">Feed</v-btn>
            <v-btn to="/profile" text class="mb-2">Profile</v-btn>
            <v-btn to="/" text class="mb-2">Drafts</v-btn>
            <v-btn to="/favorites" text class="mb-2 pink--text">Favorites</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import CategoryFilter from "@/components/CategoryFilter";
import Collection from "@/components/filter_items/Collection";
import Product from "@/components/filter_items/Product";
import User from "@/components/filter_items/User";
import NoitemCard from "@/components/NoitemCard";
import { mapGetters } from "vuex";

export default {
  components: {
    CategoryFilter,
    Collection,
    Product,
    User,
    NoitemCard
  },
  data() {
    return {
      filterType: "newest",
      newestDescending: true,
      createdDescending: false,
      categoryDescending: false
    };
  },
  computed: {
    ...mapGetters({
      filteredData: "categories/getFilteredData",
      noFavorite: "categories/getNoFavorite",
      noResult: "categories/getNoResult",
      isLoggedIn: "auth/getIsLoggedIn",
      loading: "categories/getDataLoading"
    })
  },
  methods: {
    filterList(type) {
      this.filterType = type;
      if (type === "newest") {
        this.newestDescending = true;
      } else {
        this.newestDescending = false;
      }
      if (type === "created") {
        this.createdDescending = true;
      } else {
        this.createdDescending = false;
      }
      if (type === "category") {
        this.categoryDescending = true;
      } else {
        this.categoryDescending = false;
      }
      this.$store.dispatch("categories/filterFavorites", type);
    }
  },
  created() {
    this.$store.dispatch("categories/fetchAllFavorites", true);
  }
};
</script>

<style></style>
