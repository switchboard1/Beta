<template>
  <div>
    <ViewList
      v-if="viewList"
      :toggleViewList="toggleViewList"
      :brewery="this.collection"
      :favoritePage="favoritePage"
      :addNoOfComments="addNoOfComments"
    />
    <v-row align="center" class="text--none mx-auto">
      <v-col cols="auto" class="pb-0">
        <div style="width: 72px;"></div>
      </v-col>
      <v-col cols="auto" style="padding-bottom: 0;">
        <h1 class="title font-weight-bold grey--text text--darken-4">
          {{ product.productTitle }}
          <i class="font-weight-regular">appears in</i>
          <span @click="toggleViewList(true)" style="cursor: pointer;">{{collection.title}}</span>
        </h1>
      </v-col>
    </v-row>
    <v-row align="start" class="text--none mx-auto">
      <v-col cols="auto">
        <v-badge color="pink" :content="price" overlap left bordered>
          <v-avatar size="72" tile color="grey lighten-2" />
        </v-badge>
      </v-col>
      <v-col cols="auto">
        <template v-if="currentUser">
          <nuxt-link to="/profile" style="text-decoration: none;">
            <v-chip
              color="transparent"
              avatar
              pill
              class="grey--text text--darken-2"
              style="cursor: pointer;"
            >
              By {{ product.username }}
              <v-avatar right>
                <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
              </v-avatar>
            </v-chip>
          </nuxt-link>
        </template>
        <template v-else>
          <template v-if="nonAuthor">
            <nuxt-link to="/profile" style="text-decoration: none;" v-if="currentNonAuthor">
              <v-chip
                color="transparent"
                avatar
                pill
                class="grey--text text--darken-2"
                style="cursor: pointer;"
              >
                <span>By {{ product.nonAuthorUsername }}</span>
                <v-avatar right>
                  <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
                </v-avatar>
              </v-chip>
            </nuxt-link>
            <nuxt-link :to="'/users/' + product.nonAuthorId" style="text-decoration: none;" v-else>
              <v-chip
                color="transparent"
                avatar
                pill
                class="grey--text text--darken-2"
                style="cursor: pointer;"
              >
                <span>By {{ product.nonAuthorUsername }}</span>
                <v-avatar right>
                  <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
                </v-avatar>
              </v-chip>
            </nuxt-link>
          </template>
          <nuxt-link :to="'/users/' + product.userId" style="text-decoration: none;" v-else>
            <v-chip
              color="transparent"
              avatar
              pill
              class="grey--text text--darken-2"
              style="cursor: pointer;"
            >
              <span>By {{ product.username }}</span>
              <v-avatar right>
                <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
              </v-avatar>
            </v-chip>
          </nuxt-link>
        </template>
      </v-col>
      <v-spacer />
      <!-- <v-col cols="auto">
        <v-avatar size="32" class="mr-4" color="orange darken-2">
          <v-img
            max-height="28"
            max-width="28"
            src="https://randomuser.me/api/portraits/lego/8.jpg"
            alt="Lego"
          /> 
        </v-avatar>
        <v-avatar
          size="32"
          v-for="i in 5"
          :key="i"
          :class="i === 1 ? '' : 'ml-n3'"
          :style="`z-index: ${5 - i}`"
          color="orange darken-2"
        >
          <v-img
            max-height="28"
            max-width="28"
            :src="`https://randomuser.me/api/portraits/lego/${i}.jpg`"
            alt="Lego"
          />
        </v-avatar>
        <span class="ml-4 grey--text text--darken-2">
          <span class="pink--text font-weight-black">+ 12</span>
          commented
        </span>
      </v-col>-->
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { auth, db } from "@/plugins/firebase";
import ViewList from "../ViewList";

export default {
  name: "Product",
  components: {
    ViewList
  },
  props: ["product", "favoritePage"],
  data() {
    return {
      price: "",
      currentUser: false,
      nonAuthor: false,
      currentNonAuthor: false,
      collection: {},
      viewList: false
    };
  },
  computed: {
    ...mapGetters({
      collections: "categories/getCollections"
    })
  },
  async mounted() {
    this.price = `$${this.product.productPrice}`;
    await auth.onAuthStateChanged(async user => {
      if (user) {
        if (this.product.nonAuthorUsername) {
          this.nonAuthor = true;
          if (this.product.nonAuthorId === user.uid) {
            this.currentNonAuthor = true;
          }
        } else {
          if (user.uid === this.product.userId) {
            this.currentUser = true;
          }
        }
      } else {
        if (this.product.nonAuthorUsername) {
          this.nonAuthor = true;
        }
      }
    });
    this.collection = this.collections.find(
      collection => collection.id === this.product.collectionId
    );
  },
  methods: {
    toggleViewList(value) {
      this.viewList = value;
      if (this.viewList === true) {
        document.body.style =
          "overflow-y: hidden; height: 100vh; position: fixed; width: 100%;";
      } else {
        document.body.style =
          "overflow-y: scroll; height: auto; position: static;";
      }
    },
    addNoOfComments() {
      this.noOfComments = this.noOfComments + 1;
    }
  }
};
</script>

<style></style>
