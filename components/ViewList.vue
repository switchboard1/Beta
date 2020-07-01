<template>
  <div class="wrapper" ref="modal">
    <div
      class="modal pb-12"
      :class="{ 'px-0': $vuetify.breakpoint.smAndDown, 'px-8': $vuetify.breakpoint.mdAndUp}"
    >
      <v-row
        class="py-4"
        no-gutters
        align="center"
        :class="{ 'px-6': $vuetify.breakpoint.smAndDown, 'px-4': $vuetify.breakpoint.mdAndUp}"
      >
        <v-col sm="12" lg="1" md="1" cols="12" :hidden="$vuetify.breakpoint.smAndDown">
          <v-row>
            <v-btn text class="mr-4" @click="toggleViewList(false)">
              <i class="material-icons">arrow_back</i>
            </v-btn>
          </v-row>
        </v-col>
        <v-col sm="12" lg="10" md="10" cols="12">
          <v-row align="center" dense :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }">
            <v-col sm="12" md="3" lg="3" xs="12">
              <v-row class="mx-0" :class="{'flex-nowrap': $vuetify.breakpoint.smAndDown}">
                <v-btn
                  text
                  class="mr-4"
                  @click="toggleViewList(false)"
                  :hidden="$vuetify.breakpoint.mdAndUp"
                >
                  <i class="material-icons">arrow_back</i>
                </v-btn>
                <v-select
                  dark
                  background-color="pink"
                  :menu-props="{ offsetY: true }"
                  solo
                  flat
                  hide-details
                  v-model="defaultTag"
                  label="Search this list"
                  :items="tags"
                  disabled
                  full-width
                ></v-select>
              </v-row>
            </v-col>
            <v-col
              sm="12"
              md="9"
              lg="9"
              cols="12"
              :class="{ 'mb-4': $vuetify.breakpoint.smAndDown }"
            >
              <v-text-field
                outlined
                @input="handleSearch"
                v-model="search"
                color="pink"
                hide-details
                type="search"
              >
                <i class="material-icons" slot="append">search</i>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        align="center"
        class="mx-0"
        :class="{'px-8': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
      >
        <v-col
          sm="12"
          md="6"
          lg="6"
          cols="12"
          class="px-0"
          :class="{'mb-4 py-0': $vuetify.breakpoint.smAndDown}"
        >
          <h1 :class="{'mb-4 headline font-weight-bold': $vuetify.breakpoint.smAndDown}">{{ title }}</h1>
          <v-row class="mx-0" :hidden="$vuetify.breakpoint.mdAndUp ">
            <v-col class="px-0 py-0" cols="6">
              <v-btn color="grey" outlined fab x-small dark class="mr-4">
                <i class="material-icons">flag</i>
              </v-btn>
              <v-btn color="black" outlined fab x-small dark class="mr-4">
                <i class="material-icons">share</i>
              </v-btn>
            </v-col>
            <v-col class="px-0 py-0" cols="6">
              <v-row class="mx-0" justify="end">
                <v-btn color="pink" outlined dark @click="toggleEditModal(true)" v-if="isAdmin">
                  <i class="material-icons mr-2">edit</i> Edit
                </v-btn>
                <template v-else>
                  <v-btn color="pink" outlined dark @click="toggleEditModal(true)" v-if="isCreator">
                    <i class="material-icons mr-2">edit</i> Edit
                  </v-btn>
                  <template v-else>
                    <v-btn text @click="removeFavorite" v-if="isFavorite">
                      <i class="material-icons mr-2">favorite</i>
                    </v-btn>
                    <v-btn text @click="addFavorite" v-else>
                      <i class="material-icons mr-2">favorite_border</i>
                      <span :hidden="$vuetify.breakpoint.smAndDown">
                        Add to
                        favorites
                      </span>
                    </v-btn>
                  </template>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col sm="4" md="6" lg="6" cols="4" class="px-0" :hidden="$vuetify.breakpoint.smAndDown ">
          <v-row justify="end" class="mx-0">
            <v-btn color="grey" outlined fab x-small dark class="mr-4">
              <i class="material-icons">flag</i>
            </v-btn>
            <v-btn color="black" outlined fab x-small dark class="mr-4">
              <i class="material-icons">share</i>
            </v-btn>
            <v-btn color="pink" outlined dark @click="toggleEditModal(true)" v-if="isAdmin">
              <i class="material-icons mr-2">edit</i> Edit
            </v-btn>
            <template v-else>
              <v-btn color="pink" outlined dark @click="toggleEditModal(true)" v-if="isCreator">
                <i class="material-icons mr-2">edit</i> Edit
              </v-btn>
              <template v-else>
                <v-btn text @click="removeFavorite" v-if="isFavorite">
                  <i class="material-icons mr-2">favorite</i>
                </v-btn>
                <v-btn text @click="addFavorite" v-else>
                  <i class="material-icons mr-2">favorite_border</i>
                  <span :hidden="$vuetify.breakpoint.smAndDown">
                    Add to
                    favorites
                  </span>
                </v-btn>
              </template>
            </template>
          </v-row>
        </v-col>
      </v-row>
      <div
        class="mb-8"
        :class="{'px-8': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
      >
        <span
          class="font-weight-bold grey--text pr-2"
          style="text-transform: capitalize;"
          v-for="(category, index) in categories"
          :key="index"
        >{{ category }}</span>
      </div>
      <p
        :class="{'px-8': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
      >{{ description }}</p>
      <h2
        class="mt-8 mb-4"
        :class="{'px-8 headline font-weight-bold': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
      >Beer List</h2>
      <v-row
        class="mb-12 mx-0"
        no-gutters
        :class="{'px-8': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
      >
        <v-col sm="6" md="8" lg="8" cols="12" :class="{'mb-4':$vuetify.breakpoint.smAndDown}">
          Sort by:
          <span :hidden="$vuetify.breakpoint.mdAndUp">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on" class="pink--text">{{selectedSort}}</v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-btn
                    v-if="newestDescending"
                    text
                    :class="{
                        'pink--text': filterType === 'newest',
                        'grey--text': filterType !== 'newest'
                      }"
                    @click="filterList('newest-descending')"
                  >NEWEST</v-btn>
                  <v-btn
                    v-else
                    text
                    :class="{
                        'pink--text': filterType === 'newest-descending',
                        'grey--text': filterType !== 'newest-descending'
                      }"
                    @click="filterList('newest')"
                  >NEWEST</v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    v-if="mostactiveDescending"
                    text
                    :class="{
                      'pink--text': filterType === 'most active',
                      'grey--text': filterType !== 'most active'
                    }"
                    @click="filterList('most active descending')"
                  >MOST ACTIVE</v-btn>
                  <v-btn
                    v-else
                    text
                    :class="{
                      'pink--text': filterType === 'most active descending',
                      'grey--text': filterType !== 'most active descending'
                    }"
                    @click="filterList('most active')"
                  >MOST ACTIVE</v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    v-if="topratedDescending"
                    text
                    :class="{
                      'pink--text': filterType === 'top rated',
                      'grey--text': filterType !== 'top rated'
                    }"
                    @click="filterList('top rated descending')"
                  >TOP RATED</v-btn>
                  <v-btn
                    v-else
                    text
                    :class="{
                      'pink--text': filterType === 'top rated descending',
                      'grey--text': filterType !== 'top rated descending'
                    }"
                    @click="filterList('top rated')"
                  >TOP RATED</v-btn>
                </v-list-item>
                <v-list-item>
                  <v-btn
                    v-if="lowestratedDescending"
                    text
                    :class="{
                      'pink--text': filterType === 'lowest rated',
                      'grey--text': filterType !== 'lowest rated'
                    }"
                    @click="filterList('lowest rated descending')"
                  >LOWEST RATED</v-btn>
                  <v-btn
                    v-else
                    text
                    :class="{
                      'pink--text': filterType === 'lowest rated descending',
                      'grey--text': filterType !== 'lowest rated descending'
                    }"
                    @click="filterList('lowest rated')"
                  >LOWEST RATED</v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
          <span :hidden="$vuetify.breakpoint.smAndDown">
            <v-btn
              v-if="mostactiveDescending"
              text
              :class="{
              'pink--text': filterType === 'most active',
              'grey--text': filterType !== 'most active'
            }"
              @click="filterList('most active descending')"
            >MOST ACTIVE</v-btn>
            <v-btn
              v-else
              text
              :class="{
              'pink--text': filterType === 'most active descending',
              'grey--text': filterType !== 'most active descending'
            }"
              @click="filterList('most active')"
            >MOST ACTIVE</v-btn>/
            <v-btn
              v-if="topratedDescending"
              text
              :class="{
              'pink--text': filterType === 'top rated',
              'grey--text': filterType !== 'top rated'
            }"
              @click="filterList('top rated descending')"
            >TOP RATED</v-btn>
            <v-btn
              v-else
              text
              :class="{
              'pink--text': filterType === 'top rated descending',
              'grey--text': filterType !== 'top rated descending'
            }"
              @click="filterList('top rated')"
            >TOP RATED</v-btn>/
            <v-btn
              v-if="lowestratedDescending"
              text
              :class="{
              'pink--text': filterType === 'lowest rated',
              'grey--text': filterType !== 'lowest rated'
            }"
              @click="filterList('lowest rated descending')"
            >LOWEST RATED</v-btn>
            <v-btn
              v-else
              text
              :class="{
              'pink--text': filterType === 'lowest rated descending',
              'grey--text': filterType !== 'lowest rated descending'
            }"
              @click="filterList('lowest rated')"
            >LOWEST RATED</v-btn>/
            <v-btn
              v-if="newestDescending"
              text
              :class="{
              'pink--text': filterType === 'newest',
              'grey--text': filterType !== 'newest'
            }"
              @click="filterList('newest-descending')"
            >NEWEST</v-btn>
            <v-btn
              v-else
              text
              :class="{
              'pink--text': filterType === 'newest-descending',
              'grey--text': filterType !== 'newest-descending'
            }"
              @click="filterList('newest')"
            >NEWEST</v-btn>
          </span>
        </v-col>
        <v-col sm="6" md="4" lg="4" cols="12">
          <v-btn text @click="toggleAddModal(true)">
            <i class="material-icons mr-2">add_circle_outline</i> Add item to
            collection
          </v-btn>
        </v-col>
      </v-row>
      <div
        v-if="loading"
        :class="{'px-8':$vuetify.breakpoint.smAndDown, 'px-12': $vuetify.breakpoint.mdAndUp}"
      >Loading...</div>
      <div
        :class="{'px-8':$vuetify.breakpoint.smAndDown, 'px-12': $vuetify.breakpoint.mdAndUp}"
        v-else
      >
        <Add
          v-if="addModal"
          :toggleAddModal="toggleAddModal"
          :addItemToList="addItemToList"
          :isCreator="isCreator"
        />
        <Edit
          v-if="editModal"
          :toggleEditModal="toggleEditModal"
          :brewery="this.brewery"
          :listId="listId"
          :editItemList="editItemList"
        />
        <template v-if="filteredItems.length > 0">
          <template v-if="showMore">
            <div v-for="product in filteredItems" :key="product.id" class="mb-8">
              <ListItem
                :product="product"
                :username="username"
                :userId="userId"
                :profile="false"
                :listId="listId"
                :updateItemsOnVote="updateItemsOnVote"
                :addMention="addMention"
              />
            </div>
          </template>
          <template v-else>
            <div v-for="product in filteredItems.slice(0, 5)" :key="product.id" class="mb-8">
              <ListItem
                :product="product"
                :username="username"
                :userId="userId"
                :profile="false"
                :listId="listId"
                :updateItemsOnVote="updateItemsOnVote"
                :addMention="addMention"
              />
            </div>
          </template>
          <v-row justify="center" v-if="filteredItems.length > 5">
            <v-btn text color="pink" v-if="showMore" @click="showMore = false">Show Less</v-btn>
            <v-btn
              text
              color="pink"
              v-else
              @click="showMore = true"
            >Load More ({{ filteredItems.length }} items)</v-btn>
          </v-row>
        </template>
        <template v-else>No Items found</template>
      </div>
      <template>
        <h2
          class="mt-8 mb-4"
          :class="{'px-8 headline': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
        >Comments</h2>
        <v-row
          justify="space-between"
          class="mx-0"
          :class="{'px-8 flex-column': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}"
        >
          <v-col v-if="username !== ''">
            <v-row align="start" class="flex-no-wrap mx-0">
              <i
                class="material-icons grey--text lighten-1"
                style="font-size: 3.5rem;"
              >account_circle</i>
              <h3
                v-if="isLoggedIn"
                class="mb-0 pt-2 ml-2"
                :class="{'subtitle-2 font-weight-bold': $vuetify.breakpoint.smAndDown}"
              >Commenting as {{ currentUsername }}</h3>
              <p v-else class="mb-0 ml-2">Add a comment</p>
            </v-row>
          </v-col>
          <v-col>
            <v-row justify="end">
              <v-btn color="pink" class="white--text" @click="postComment">Post comment</v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row
          v-if="mentions.length > 0"
          class="mx-0"
          :class="{'px-8 flex-column': $vuetify.breakpoint.smAndDown, 'px-12 align-center':$vuetify.breakpoint.mdAndUp}"
        >
          <v-col cols="auto">
            <p :class="{'mb-0': $vuetify.breakpoint.smAndDown}">Mentions:</p>
          </v-col>
          <v-col cols="auto" :class="{'py-0':$vuetify.breakpoint.smAndDown}">
            <v-chip-group mandatory class="text-capitalize mb-4">
              <v-chip
                v-for="mention in mentions"
                :key="mention.id"
                class="ma-2 white--text"
                close
                @click:close="removeMention(mention.id)"
                color="pink"
              >{{ mention.productTitle }}</v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
        <div :class="{'px-8 ': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}">
          <v-textarea label="Here you can type your thoughts" v-model="commentInput"></v-textarea>
        </div>
        <div :class="{'px-8 ': $vuetify.breakpoint.smAndDown, 'px-12':$vuetify.breakpoint.mdAndUp}">
          <template v-if="showMoreComments">
            <div
              v-for="comment in listComments"
              :key="comment.id"
              class="py-4"
              style="border-top: 1px solid #ccc;"
            >
              <v-row align="start" class="flex-nowrap">
                <i
                  class="material-icons grey--text lighten-1"
                  style="font-size: 3.5rem;"
                >account_circle</i>
                <div class="pt-2 ml-2">
                  <h4 class="mb-4" v-if="comment.mentions.length > 0" style="font-weight: 400">
                    <b>{{ comment.username }}</b> mentioned
                    <span
                      class="mr-2"
                      v-for="mention in comment.mentions"
                      :key="mention.id"
                    >@{{mention.productTitle.toLowerCase().replace(/ +/g, "")}}</span>
                  </h4>
                  <h4 class="mb-4" v-else style="font-weight: 400">
                    <b>{{ comment.username }}</b> Commented
                  </h4>
                  <p>{{comment.commentTxt}}</p>
                </div>
              </v-row>
            </div>
          </template>
          <template v-else>
            <div
              v-for="comment in listComments.slice(0, 5)"
              :key="comment.id"
              class="py-4"
              style="border-top: 1px solid #ccc;"
            >
              <v-row align="start" class="flex-nowrap">
                <i
                  class="material-icons grey--text lighten-1"
                  style="font-size: 3.5rem;"
                >account_circle</i>
                <div class="pt-2 ml-2">
                  <h4 class="mb-4" v-if="comment.mentions.length > 0" style="font-weight: 400">
                    <v-row class="mx-0">
                      <b class="mr-2">{{ comment.username }}</b>
                      <span class="mr-2">mentioned</span>
                      <span
                        class="mr-2"
                        v-for="mention in comment.mentions"
                        :key="mention.id"
                        @click="searchByMention(mention.productTitle)"
                        style="cursor: pointer;"
                      >@{{mention.productTitle.toLowerCase().replace(/ +/g, "")}}</span>
                    </v-row>
                  </h4>
                  <h4 class="mb-4" v-else style="font-weight: 400">
                    <b>{{ comment.username }}</b> Commented
                  </h4>
                  <p>{{comment.commentTxt}}</p>
                </div>
              </v-row>
            </div>
          </template>
          <v-row justify="center" v-if="listComments.length > 5">
            <v-btn
              text
              color="pink"
              v-if="showMoreComments"
              @click="showMoreComments = false"
            >Show Less</v-btn>
            <v-btn
              text
              color="pink"
              v-else
              @click="showMoreComments = true"
            >Show all ({{ listComments.length }} reviews in total)</v-btn>
          </v-row>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/plugins/firebase";
import * as firebase from "firebase/app";
import ListItem from "./ListItem";
import { mapGetters } from "vuex";
import { states } from "@/helpers/states";
import Add from "./viewlist/Add";
import Edit from "./viewlist/Edit";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "ViewList",
  props: ["toggleViewList", "brewery", "favoritePage", "addNoOfComments"],
  components: {
    ListItem,
    Add,
    Edit
  },
  data() {
    return {
      filterType: "newest",
      newestDescending: true,
      mostactiveDescending: false,
      topratedDescending: false,
      lowestratedDescending: false,
      isCreator: false,
      breweryList: {},
      title: "",
      description: "",
      categories: [],
      listId: "",
      username: "",
      userId: "",
      items: [],
      filteredItems: [],
      loading: false,
      showMore: false,
      addModal: false,
      editModal: false,
      search: "",
      selectedSort: "newest",
      defaultTag: this.filterState,
      tags: ["All", ...states],
      isFavorite: false,
      listComments: [],
      commentInput: "",
      mentions: [],
      showMoreComments: false
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/getIsLoggedIn",
      isAdmin: "auth/getAdmin",
      currentUsername: "auth/getUsername",
      collections: "categories/getCollections",
      data: "categories/getData",
      filteredData: "categories/getFilteredData",
      favorites: "categories/getFavorites",
      comments: "categories/getComments"
    })
  },
  async created() {
    this.title = this.brewery.title;
    this.description = this.brewery.description;
    this.categories = this.brewery.categories;
    this.items = this.brewery.items;
    this.filteredItems = this.brewery.items;
    this.username = this.brewery.username;
    this.userId = this.brewery.userId;
    this.listId = this.brewery.id;

    const foundListComments = this.comments.filter(
      comment => comment.listId === this.listId
    );

    foundListComments.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    this.listComments = foundListComments;

    await auth.onAuthStateChanged(async user => {
      if (user) {
        if (user.uid === this.userId) {
          this.isCreator = true;
        } else {
          this.isCreator = false;
          const foundFavorite = this.favorites.filter(favorite => {
            return (
              favorite.listId === this.listId && favorite.userId === user.uid
            );
          });
          if (foundFavorite.length > 0) {
            this.isFavorite = true;
          } else {
            this.isFavorite = false;
          }
        }
      } else {
        this.isCreator = false;
      }
    });
  },
  methods: {
    async addItemToList(item) {
      const newItem = {
        ...item,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
      };

      const existingItemList = await db
        .collection("item-list")
        .doc(this.listId)
        .get();

      const newItemList = {
        title: existingItemList.data().title,
        description: existingItemList.data().description,
        categories: existingItemList.data().categories,
        timestamp: existingItemList.data().timestamp,
        userId: existingItemList.data().userId,
        username: existingItemList.data().username,
        items: [newItem, ...existingItemList.data().items]
      };

      await db
        .collection("item-list")
        .doc(this.listId)
        .set(newItemList);
      this.items = [newItem, ...this.items];
      this.filteredItems = [newItem, ...this.filteredItems];

      this.filteredItems = this.filteredItems.sort(
        (a, b) => b.timestamp.seconds - a.timestamp.seconds
      );
      this.$store.dispatch("categories/addItemToList", {
        id: this.listId,
        ...newItemList
      });
      this.toggleAddModal(false);
    },
    async editItemList({ list, removedProductsIds }) {
      removedProductsIds.forEach(async id => {
        const foundLikes = await db
          .collection("likes")
          .where("productId", "==", id)
          .get();
        foundLikes.forEach(async like => {
          const batch = db.batch();
          batch.delete(like.ref);
          return batch.commit();
        });
        const foundDislikes = await db
          .collection("dislikes")
          .where("productId", "==", id)
          .get();
        foundDislikes.forEach(async dislike => {
          const batch = db.batch();
          batch.delete(dislike.ref);
          return batch.commit();
        });
      });
      await db
        .collection("item-list")
        .doc(list.id)
        .set({
          title: list.title,
          description: list.description,
          userId: this.userId,
          username: this.username,
          timestamp: list.timestamp,
          items: list.items,
          categories: list.categories
        });
      this.title = list.title;
      this.description = list.description;
      this.categories = list.categories;
      this.items = list.items;
      this.filteredItems = list.items;

      this.$store.dispatch("categories/editItemList", {
        id: list.id,
        title: list.title,
        description: list.description,
        timestamp: list.timestamp,
        items: list.items,
        categories: list.categories
      });

      this.toggleEditModal(false);
    },
    toggleAddModal(value) {
      this.addModal = value;
      if (this.addModal === true) {
        document.querySelector(".wrapper").style =
          "overflow-y: hidden; height: 100vh;";
      } else {
        document.querySelector(".wrapper").style =
          "overflow-y: scroll; height: 100%;";
      }
    },
    async toggleEditModal(value) {
      this.editModal = value;
      if (this.editModal === true) {
        document.querySelector(".wrapper").style =
          "overflow-y: hidden; height: 100vh;";
      } else {
        document.querySelector(".wrapper").style =
          "overflow-y: scroll; height: 100%;";
      }
    },
    filterList(type) {
      this.setFilterType(type);
      this.filterItems();
    },
    setFilterType(type) {
      this.selectedSort = type;

      if (type === "newest-descending") {
        this.selectedSort = "newest";
      }
      if (type === "top rated descending") {
        this.selectedSort = "top rated";
      }
      if (type === "lowest rated descending") {
        this.selectedSort = "lowest rated";
      }
      if (type === "most active descending") {
        this.selectedSort = "most active";
      }
      this.filterType = type;
    },
    filterItems() {
      const tempItems = [...this.items];
      if (this.filterType === "newest") {
        this.newestDescending = true;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        this.filteredItems = tempItems;
      }
      if (this.filterType === "newest-descending") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        this.filteredItems = tempItems;
      }
      if (this.filterType === "most active") {
        this.newestDescending = false;
        this.mostactiveDescending = true;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => b.likes + b.dislikes - (a.likes + a.dislikes));
        this.filteredItems = tempItems;
      }
      if (this.filterType === "most active descending") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => a.likes + a.dislikes - (b.likes + b.dislikes));
        this.filteredItems = tempItems;
      }
      if (this.filterType === "top rated") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = true;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes));
        this.filteredItems = tempItems;
      }
      if (this.filterType === "top rated descending") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => a.likes - a.dislikes - (b.likes - b.dislikes));
        this.filteredItems = tempItems;
      }
      if (this.filterType === "lowest rated") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = true;
        tempItems.sort((a, b) => a.likes - a.dislikes - (b.likes - b.dislikes));
        this.filteredItems = tempItems;
      }
      if (this.filterType === "lowest rated descending") {
        this.newestDescending = false;
        this.mostactiveDescending = false;
        this.topratedDescending = false;
        this.lowestratedDescending = false;
        tempItems.sort((a, b) => b.likes - b.dislikes - (a.likes - a.dislikes));
        this.filteredItems = tempItems;
      }
    },
    updateItemsOnVote(product) {
      const tempItems = [...this.items];

      const itemIndex = tempItems.findIndex(item => {
        return item.id === product.id;
      });

      const updatedItem = {
        ...tempItems[itemIndex],
        likes: product.likes,
        dislikes: product.dislikes
      };

      const updatedItems = [
        ...tempItems.slice(0, itemIndex),
        updatedItem,
        ...tempItems.slice(itemIndex + 1)
      ];

      this.items = updatedItems;
    },
    handleSearch() {
      this.filteredItems = this.items.filter(item =>
        item.productTitle.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    toggleFavorite(value) {
      this.isFavorite = value;
    },
    addFavorite() {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const favorite = {
            listId: this.brewery.id,
            userId: user.uid,
            timestamp: firebase.firestore.Timestamp.fromDate(new Date())
          };
          const toggleFavorite = this.toggleFavorite;
          this.$store.dispatch("categories/addFavorite", {
            favorite,
            toggleFavorite,
            favoritePage: this.favoritePage
          });
        } else {
          window.location.pathname = "/login";
        }
      });
    },
    removeFavorite() {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const foundFavorite = this.favorites.find(favorite => {
            return (
              favorite.listId === this.listId && favorite.userId === user.uid
            );
          });
          const toggleFavorite = this.toggleFavorite;
          this.$store.dispatch("categories/removeFavorite", {
            id: foundFavorite.id,
            toggleFavorite,
            favoritePage: this.favoritePage
          });
        }
      });
    },
    postComment() {
      auth.onAuthStateChanged(async user => {
        if (user) {
          if (this.commentInput === "") {
            return;
          } else {
            const newComment = {
              mentions: this.mentions,
              listId: this.listId,
              commentTxt: this.commentInput,
              userId: user.uid,
              username: this.currentUsername,
              timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            };

            this.$store.dispatch("categories/addComment", newComment);

            this.listComments = [
              { id: uuidv4(), ...newComment },
              ...this.listComments
            ];
            if (this.addNoOfComments()) {
              this.addNoOfComments();
            }

            this.commentInput = "";
            this.mentions = [];
          }
        } else {
          window.location.pathname = "/login";
        }
      });
    },
    addMention(productTitle, productId) {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const foundMention = this.mentions.filter(
            mention => mention.productId === productId
          );

          if (foundMention.length > 0) {
            return;
          } else {
            this.mentions = [
              { id: uuidv4(), productTitle, productId },
              ...this.mentions
            ];
          }
        } else {
          window.location.pathname = "/login";
        }
      });
    },
    removeMention(mentionId) {
      this.mentions = this.mentions.filter(mention => mentionId !== mention.id);
    },
    searchByMention(productTitle) {
      this.filteredItems = this.items.filter(item =>
        item.productTitle.toLowerCase().includes(productTitle.toLowerCase())
      );

      this.search = productTitle;
      this.$refs.modal.scrollTop = 0;
    }
  }
};
</script>

<style scoped>
.wrapper {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
}

.modal {
  background: #fff;
  position: relative;
  width: 90%;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .modal {
    width: 100%;
  }
}
</style>
