<template>
  <div class="wrapper">
    <div class="modal px-8 pb-12">
      <v-row class="py-4 px-4">
        <v-col sm="12" lg="6" md="6" cols="12">
          <v-row>
            <v-btn text class="mr-4" @click="toggleEditModal(false)">
              <i class="material-icons">arrow_back</i>
            </v-btn>
            <h1 class="display-1 font-bold">Edit</h1>
          </v-row>
        </v-col>
        <v-col sm="12" lg="6" md="6" cols="12">
          <v-row justify="end">
            <v-btn color="pink" class="white--text" v-if="loading">...</v-btn>
            <v-btn v-else color="pink" class="white--text" @click="saveToList">Save</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <div class="px-4">
        <p class="grey--text subtitle-1">Title*</p>
        <v-text-field label="Title" solo color="pink" v-model="title" :rules="rules.notEmpty"></v-text-field>
        <p class="grey--text subtitle-1">Description*</p>
        <v-textarea
          solo
          color="pink"
          label="Description"
          value
          class="mb-4"
          v-model="description"
          :rules="rules.notEmpty"
        ></v-textarea>
        <p class="grey--text subtitle-1">Category</p>
        <v-chip-group mandatory class="text-capitalize mb-4" column>
          <v-chip
            v-for="(category, index) in categories"
            :key="index"
            @click:close="removeCategory(category)"
            class="ma-2 white--text"
            close
            color="yellow darken-2"
          >{{ category }}</v-chip>
        </v-chip-group>
        <v-row>
          <v-col sm="12" lg="6" md="6" cols="12">
            <v-row>
              <v-autocomplete
                :search-input.sync="categoryInput"
                :items="states"
                :filter="customFilter"
                color="pink"
                item-text="name"
                label="State"
                solo
                class="mr-4"
              ></v-autocomplete>
              <v-btn
                color="pink"
                large
                class="white--text"
                :disabled="!categoryInput"
                @click="addCategory"
              >Add</v-btn>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" lg="2" md="2" cols="12">
            <v-file-input prepend-icon="mdi-camera" solo flat></v-file-input>
          </v-col>
          <v-col sm="12" lg="10" md="10" cols="12">
            <v-row>
              <v-col sm="12" lg="4" md="4" cols="12">
                <p class="grey--text subtitle-1">Product Title</p>
                <v-text-field
                  label="Enter the name of the product"
                  solo
                  color="pink"
                  v-model="productTitle"
                ></v-text-field>
              </v-col>
              <v-col sm="12" lg="8" md="8" cols="12">
                <p class="grey--text subtitle-1">Price</p>
                <v-text-field
                  label="$20"
                  type="number"
                  min="1"
                  @keydown="checkNegative"
                  solo
                  color="pink"
                  v-model="productPrice"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p class="grey--text subtitle-1">Description</p>
                <v-textarea
                  solo
                  color="pink"
                  label="Description"
                  value
                  class="mb-4"
                  v-model="productDescription"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="end" class="pb-8">
          <v-btn color="pink" class="white--text" @click="addItem">
            <span class="display-1">+</span>
          </v-btn>
        </v-row>
        <div v-if="items.length > 0">
          <h1 class="headline mb-8">The Collection</h1>
          <SingleItem
            v-for="(item) in items"
            :key="item.id"
            :item="item"
            :removeItem="removeItem"
            :editItem="editItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import SingleItem from "@/components/SingleItem";
import * as firebase from "firebase/app";
import { db } from "@/plugins/firebase";
import { states } from "@/helpers/states";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "Edit",
  props: ["toggleEditModal", "brewery", "editItemList", "listId"],
  components: {
    SingleItem
  },
  computed: {
    ...mapGetters({
      loading: "list/getLoading"
    })
  },
  data() {
    return {
      id: "",
      disabledCategories: true,
      states: states,
      categoryInput: "",
      categories: [],
      items: [],
      title: "",
      description: "",
      productTitle: "",
      productPrice: "",
      productDescription: "",
      timestamp: {},
      removedProductsIds: [],
      rules: {
        notEmpty: [value => !!value || "Required."]
      }
    };
  },
  async created() {
    const existingItemList = await db
      .collection("item-list")
      .doc(this.listId)
      .get();
    this.id = existingItemList.id;
    this.items = existingItemList.data().items;
    this.title = existingItemList.data().title;
    this.description = existingItemList.data().description;
    this.categories = existingItemList.data().categories;
    this.timestamp = existingItemList.data().timestamp;
  },
  methods: {
    customFilter(item, queryText, itemText) {
      const textOne = item.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    addCategory() {
      if (this.categories.includes(this.categoryInput)) {
        return;
      } else {
        this.categories = [this.categoryInput, ...this.categories];
      }
    },
    removeCategory(categorySent) {
      this.categories = this.categories.filter(
        category => categorySent !== category
      );
    },
    checkNegative(e) {
      if (
        !(
          (e.keyCode > 95 && e.keyCode < 106) ||
          (e.keyCode > 47 && e.keyCode < 58) ||
          e.keyCode == 8 ||
          e.keyCode == 9
        )
      ) {
        e.preventDefault();
      }
    },
    saveToList() {
      if (
        this.title === "" ||
        this.description === "" ||
        this.categories.length === 0 ||
        this.items.length === 0
      ) {
        return;
      } else {
        const productItems = this.items.map(item => {
          if (item.nonAuthorId) {
            return {
              id: item.id,
              likes: item.likes,
              dislikes: item.dislikes,
              productTitle: item.productTitle,
              productDescription: item.productDescription,
              productPrice: item.productPrice,
              nonAuthorId: item.nonAuthorId,
              nonAuthorUsername: item.nonAuthorUsername,
              timestamp: item.timestamp
            };
          } else {
            return {
              id: item.id,
              likes: item.likes,
              dislikes: item.dislikes,
              productTitle: item.productTitle,
              productDescription: item.productDescription,
              productPrice: item.productPrice,
              timestamp: item.timestamp
            };
          }
        });

        const newList = {
          id: this.id,
          title: this.title,
          description: this.description,
          items: productItems,
          categories: this.categories,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date())
        };
        this.editItemList({
          list: newList,
          removedProductsIds: this.removedProductsIds
        });
      }
    },
    addItem() {
      if (
        this.productTitle === "" ||
        this.productPrice === "" ||
        this.productDescription === ""
      ) {
        return;
      } else {
        if (
          this.items.some(
            item =>
              item["productTitle"].toLowerCase() ===
              this.productTitle.toLowerCase()
          )
        ) {
          return;
        } else {
          this.items = [
            {
              id: uuidv4(),
              likes: 0,
              dislikes: 0,
              productTitle: this.productTitle,
              productPrice: this.productPrice,
              productDescription: this.productDescription,
              timestamp: firebase.firestore.Timestamp.fromDate(new Date())
            },
            ...this.items
          ];
          this.productTitle = "";
          this.productPrice = "";
          this.productDescription = "";
        }
      }
    },
    editItem(itemId, updatedItem) {
      if (
        this.items.some(
          item =>
            item["productTitle"].toLowerCase() ===
            updatedItem.productTitle.toLowerCase()
        )
      ) {
        const itemsArray = this.items;

        const existingItem = itemsArray.find(item => itemId === item.id);

        existingItem.productPrice = updatedItem.productPrice;
        existingItem.productDescription = updatedItem.productDescription;
        existingItem.timestamp = firebase.firestore.Timestamp.fromDate(
          new Date()
        );

        if (existingItem.nonAuthorId) {
          existingItem.nonAuthorId = updatedItem.nonAuthorId;
          existingItem.nonAuthorUsername = updatedItem.nonAuthorUsername;
        }

        this.items = itemsArray;
      } else {
        const itemsArray = this.items;

        const existingItem = itemsArray.find(item => itemId === item.id);

        existingItem.productTitle = updatedItem.productTitle;
        existingItem.productPrice = updatedItem.productPrice;
        existingItem.productDescription = updatedItem.productDescription;
        existingItem.timestamp = firebase.firestore.Timestamp.fromDate(
          new Date()
        );

        this.items = itemsArray;
      }
    },
    removeItem(itemId) {
      const removedItem = this.items.filter(item => itemId === item.id)[0];

      this.removedProductsIds = [removedItem.id, ...this.removedProductsIds];

      this.items = this.items.filter(item => itemId !== item.id);
    }
  }
};
</script>

<style scoped>
.wrapper {
  z-index: 40;
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
  width: 80%;
  margin: 0 auto;
}

@media (max-width: 960px) {
  .modal {
    width: 100%;
  }
}
</style>
