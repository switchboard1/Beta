<template>
  <v-container style="overflow-x: hidden;">
    <div v-if="userLoading">Loading...</div>
    <v-row v-else justify="end">
      <v-row align="center" class="mb-12 mx-auto" dense style="max-width: 1000px">
        <v-col sm="3" md="3" lg="3" cols="12">
          <v-select
            dark
            background-color="pink"
            :menu-props="{ offsetY: true }"
            solo
            flat
            hide-details
            v-model="defaultTag"
            label="Category"
            :items="tags"
            full-width
          ></v-select>
        </v-col>
        <v-col sm="9" md="9" lg="9" cols="12" :class="{ 'mb-4': $vuetify.breakpoint.xsOnly }">
          <v-text-field
            outlined
            color="pink"
            hide-details
            type="search"
            v-model="searchInput"
            @input="searchFilter"
          />
        </v-col>
      </v-row>
      <v-col sm="8" md="8" lg="8" cols="12" class="px-12">
        <v-row align="center" justify="center" class="pb-8" style="border-bottom: 2px solid #eee">
          <v-col cols="auto">
            <div
              style="width: 144px; height: 144px; border-radius: 50%; position: relative;"
              class="grey"
            >
              <span
                style="position: absolute; bottom: 5%; right: 5%; color: #fff; width: 35px; height: 35px; box-shadow: inset 0 0 0 3px white, inset 0 0 0 3px white; border-radius: 50%;"
                class="grey lighten-1 d-flex justify-center align-center"
              >
                <v-icon dark size="16">fas fa-crown</v-icon>
              </span>
            </div>
          </v-col>
          <v-col cols="auto">
            <v-row class="mb-4" align="center">
              <h1 class="headline mr-8" v-if="publicName">{{ name }}</h1>
              <h1 class="headline mr-8" v-else>{{ username }}</h1>
              <v-checkbox
                color="pink"
                v-model="publicName"
                label="Show real name"
                :disabled="checkboxLoading"
                @change="checkPublicName"
              ></v-checkbox>
            </v-row>
            <v-row class="pl-4">
              <v-btn fab dark small color="light-blue darken-4" class="mr-4">
                <v-icon dark>fab fa-facebook-f</v-icon>
              </v-btn>
              <v-btn fab dark small color="light-blue lighten-1" class="mr-4">
                <v-icon dark>fab fa-twitter</v-icon>
              </v-btn>
              <v-btn fab dark small color="pink darken-3">
                <v-icon dark>fab fa-instagram</v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
        <div class="my-8">
          Sort by:
          <v-btn
            text
            :class="{
              'pink--text': filterType === 'date',
              'grey--text': filterType !== 'date'
            }"
            @click="filterList('date')"
          >DATE</v-btn>/
          <v-btn
            text
            :class="{
              'pink--text': filterType === 'categories',
              'grey--text': filterType !== 'categories'
            }"
            @click="filterList('categories')"
          >CATEGORIES</v-btn>
        </div>
        <template v-if="filteredItems.length > 0">
          <div v-for="(product, index) in filteredItems" :key="index" class="mb-8">
            <ListItem :product="product" :username="username" :userId="userId" :profile="true" />
          </div>
        </template>
        <div v-else>No items found.</div>
      </v-col>
      <v-col
        sm="2"
        md="2"
        lg="2"
        cols="12"
        :hidden="$vuetify.breakpoint.xsOnly"
        style="border-left: 2px solid #eee;"
      >
        <v-row class="flex-column ml-4" no-gutters align="start">
          <h3 class="grey--text mb-4 px-4">Tools</h3>
          <v-btn to="/dashboard" text class="mb-2">Feed</v-btn>
          <v-btn to="/profile" text class="mb-2 pink--text">Profile</v-btn>
          <v-btn to="/" text class="mb-2">Drafts</v-btn>
          <v-btn to="/favorites" text class="mb-2">Favorites</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth, db } from "@/plugins/firebase";
import ListItem from "@/components/ListItem";
import { states } from "@/helpers/states";
import { mapGetters } from "vuex";

export default {
  components: {
    ListItem
  },
  data() {
    return {
      userLoading: true,
      name: "",
      username: "",
      userId: "",
      filterType: "date",
      filteredItems: [],
      items: [],
      categories: [],
      defaultTag: "All",
      tags: ["All", ...states],
      publicName: false,
      checkboxLoading: false,
      searchInput: ""
    };
  },
  computed: {
    ...mapGetters({
      currentPublicName: "auth/getPublicName"
    })
  },
  async mounted() {
    const state = this;

    this.userLoading = true;
    await auth.onAuthStateChanged(async function(user) {
      if (user) {
        const userFromDB = await db.collection("users").doc(user.uid);
        const userDoc = await userFromDB.get();

        state.name = `${userDoc.data().firstname} ${userDoc.data().lastname}`;
        state.userId = userDoc.id;
        state.username = userDoc.data().username;
        state.publicName = userDoc.data().publicName;

        const existingItemList = await db
          .collection("item-list")
          .where("userId", "==", user.uid)
          .get();

        existingItemList.forEach(doc => {
          doc.data().items.forEach(item => {
            if (!item.nonAuthorId) {
              state.items = [item, ...state.items];
              state.filteredItems = [item, ...state.filteredItems];
              state;
            }
          });
          state.categories = [...doc.data().categories, ...state.categories];
          state.categories = state.categories.sort();
        });

        const allItemLists = await await db.collection("item-list").get();

        allItemLists.forEach(doc => {
          doc.data().items.forEach(item => {
            if (item.nonAuthorId === user.uid) {
              state.items = [item, ...state.items];
              state.filteredItems = [item, ...state.filteredItems];
              state;
            }
          });
        });

        state.filteredItems = state.filteredItems.sort(
          (a, b) => b.timestamp.seconds - a.timestamp.seconds
        );

        state.userLoading = false;
      } else {
        state.userLoading = false;
        return;
      }
    });
  },
  methods: {
    searchFilter() {
      let tempItems = [...this.items];

      tempItems = tempItems.filter(item =>
        item.productTitle.toLowerCase().includes(this.searchInput.toLowerCase())
      );

      this.filteredItems = tempItems;
    },
    filterList(type) {
      this.setFilterType(type);
      this.filterItems();
    },
    setFilterType(type) {
      this.filterType = type;
    },
    filterItems() {
      const state = this;
      const tempItems = [...this.items];
      if (this.filterType === "categories") {
        tempItems.sort(function(a, b) {
          return state.categories.indexOf(a) - state.categories.indexOf(b);
        });
        this.filteredItems = tempItems;
      }
      if (this.filterType === "date") {
        tempItems.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        this.filteredItems = tempItems;
      }
    },
    async checkPublicName() {
      this.checkboxLoading = true;
      await db
        .collection("users")
        .doc(this.userId)
        .update({
          publicName: this.publicName
        });
      this.checkboxLoading = false;
    }
  }
};
</script>

<style></style>
