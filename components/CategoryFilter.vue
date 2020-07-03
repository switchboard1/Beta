<template>
  <div>
    <v-expand-transition>
      <v-responsive v-if="!kick && home">
        <v-container class="pt-12 pb-8">
          <v-row justify="center">
            <v-col cols="auto" class="text-center">
              <h1 class="display-2 font-weight-bold grey--text text--darken-4">Welcome to Most for your Money!</h1>
              <h1 class="title font-weight-light">A new way to find what you need.</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-expand-transition>
    <v-row align="center" dense>
      <v-col cols="3">
        <v-select
          dark
          background-color="pink"
          :menu-props="{ offsetY: true }"
          solo
          class="text-capitalize"
          flat
          hide-details
          v-model="defaultTag"
          label="Category"
          :items="tags"
          full-width
        ></v-select>
      </v-col>
      <v-col cols="9">
        <v-text-field
          outlined
          color="pink"
          v-model="search"
          @input="filterStateAndSearch"
          hide-details
          type="search"
        />
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-row justify="center" v-if="!kick">
        <v-col cols="auto">
          <span class="grey--text text--darken-1">
            You can search for
            <strong class="ml-3 grey--text text--darken-3">micro</strong>
            <strong class="ml-3 grey--text text--darken-3">ales</strong>
            <strong class="ml-3 grey--text text--darken-3">IPA</strong>
          </span>
        </v-col>
      </v-row>

      <div class="my-8" v-if="kick && home">
        <v-btn
          text
          :class="{
            'pink--text': filterType === 'all',
            'grey--text': filterType !== 'all'
          }"
          @click="filterSort('all')"
        >SHOW ALL</v-btn>/
        <v-btn
          text
          :class="{
            'pink--text': filterType === 'categories',
            'grey--text': filterType !== 'categories'
          }"
          @click="filterSort('categories')"
        >CATEGORIES</v-btn>/
        <v-btn
          text
          :class="{
            'pink--text': filterType === 'collections',
            'grey--text': filterType !== 'collections'
          }"
          @click="filterSort('collections')"
        >COLLECTIONS</v-btn>/
        <v-btn
          text
          :class="{
            'pink--text': filterType === 'users',
            'grey--text': filterType !== 'users'
          }"
          @click="filterSort('users')"
        >USERS</v-btn>/
        <v-btn
          text
          :class="{
            'pink--text': filterType === 'products',
            'grey--text': filterType !== 'products'
          }"
          @click="filterSort('products')"
        >PRODUCTS</v-btn>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { states } from "@/helpers/states";
import { auth } from "@/plugins/firebase";
export default {
  props: ["home", "dashboard", "favorite"],
  data: () => ({
    defaultTag: "All",
    kick: false,
    search: "",
    filterType: "all",
    tags: ["All", ...states]
  }),
  computed: {
    ...mapGetters({
      collections: "categories/getCollections",
      products: "categories/getProducts",
      favorites: "categories/getFavorites",
      following: "auth/getFollowing"
    })
  },
  methods: {
    filterStateAndSearch() {
      this.filterType = "all";
      if (this.search === "") {
        this.kick = false;
        if (this.favorites.length === 0) {
          this.$store.commit("categories/setNoFavorite", true);
        }
        if (this.home) {
          this.$store.commit("categories/setFilteredData", []);
        } else if (this.dashboard) {
          auth.onAuthStateChanged(async user => {
            let filteredData = [];
            if (this.following.length > 0) {
              this.following.forEach(eachFollowing => {
                const followedUsersData = [
                  ...this.collections,
                  ...this.products
                ].filter(
                  eachData => eachData.userId === eachFollowing.userFollowed
                );
                filteredData = [...followedUsersData, ...filteredData];
              });
              const userCollections = [...this.collections].filter(
                collection => collection.userId === user.uid
              );
              const userProducts = [...this.products].filter(
                product => product.userId === user.uid
              );
              filteredData = [
                ...userCollections,
                ...userProducts,
                ...filteredData
              ];
            } else {
              filteredData = [...this.collections, ...this.products];
            }
            filteredData = filteredData.sort(
              (a, b) => b.timestamp.seconds - a.timestamp.seconds
            );
            this.$store.commit("categories/setFilteredData", filteredData);
          });
        } else if (this.favorite) {
          let filteredData = [];
          this.favorites.forEach(favorite => {
            [...this.collections].forEach(collection => {
              if (favorite.listId === collection.id) {
                filteredData = [collection, ...filteredData];
              }
            });
          });

          this.$store.commit("categories/setFilteredData", filteredData);
        }
        this.$store.commit("categories/setNoResult", false);
      } else {
        this.kick = true;
        this.$store.commit("categories/setNoFavorite", false);
        this.$store.dispatch("categories/filterByStateAndSearch", {
          search: this.search,
          tag: this.defaultTag
        });
      }
    },
    filterSort(type) {
      this.filterType = type;
      this.$store.dispatch("categories/filterSort", this.filterType);
    }
  }
};
</script>

<style></style>
