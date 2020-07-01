<template>
  <div>
    <ViewList
      v-if="viewList"
      :toggleViewList="toggleViewList"
      :brewery="collection"
      :favoritePage="favoritePage"
      :addNoOfComments="addNoOfComments"
    />
    <v-row align="center" class="text--none mx-auto">
      <v-col cols="auto" class="pb-0">
        <div style="width: 72px;"></div>
      </v-col>
      <v-col cols="auto" style="padding-bottom: 0;">
        <h1
          class="title font-weight-bold grey--text text--darken-4"
          style="cursor: pointer;"
          @click="toggleViewList(true)"
        >{{ collection.title }}</h1>
      </v-col>
    </v-row>
    <v-row align="start" class="text--none mx-auto">
      <v-col cols="auto">
        <v-badge color="pink" :content="price" overlap left bordered>
          <v-avatar size="72" tile color="grey lighten-2" />
        </v-badge>
      </v-col>
      <v-col cols="auto">
        <v-chip-group column style="max-width: 320px;">
          <v-chip
            class="white--text"
            v-for="(category, index) in collection.categories.slice(0, 3)"
            :key="index"
            color="pink"
          >{{ category }}</v-chip>
          <v-chip
            v-if="collection.categories.length > 3"
            class="font-weight-bold"
          >+{{ collection.categories.length - 3 }}</v-chip>
        </v-chip-group>
        <template v-if="currentUser">
          <nuxt-link to="/profile" style="text-decoration: none;">
            <v-chip
              color="transparent"
              avatar
              pill
              class="mt-2 grey--text text--darken-2"
              style="cursor: pointer;"
            >
              By {{ collection.username }}
              <v-avatar right>
                <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
              </v-avatar>
            </v-chip>
          </nuxt-link>
        </template>
        <template v-else>
          <nuxt-link :to="'/users/' + collection.userId" style="text-decoration: none;">
            <v-chip
              color="transparent"
              avatar
              pill
              class="mt-2 grey--text text--darken-2"
              style="cursor: pointer;"
            >
              By {{ collection.username }}
              <v-avatar right>
                <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
              </v-avatar>
            </v-chip>
          </nuxt-link>
        </template>
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <v-row class="flex-wrap">
          <template v-if="noOfComments === 0">
            <p>Be the first to comment</p>
          </template> 
          <template v-else>
            <v-avatar
              size="32"
              v-for="i in noOfComments"
              :key="i"
              :class="i === 1 ? '' : 'ml-n3'"
              :style="`z-index: ${noOfComments}`"
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
              <span class="pink--text font-weight-black">
                {{
                noOfComments
                }}
              </span>
              comments
            </span>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ViewList from "../ViewList";
import { auth } from "@/plugins/firebase";
import { mapGetters } from "vuex";

export default {
  name: "Collection",
  props: ["collection", "favoritePage"],
  components: {
    ViewList
  },
  data() {
    return {
      price: "",
      viewList: false,
      currentUser: false,
      noOfComments: 0
    };
  },
  computed: {
    ...mapGetters({
      comments: "categories/getComments"
    })
  },
  async created() {
    let prices = [];

    this.collection.items.forEach(item => {
      prices = [parseInt(item.productPrice), ...prices];
    });
    this.price = `$${Math.max(...prices)}`;

    const foundComments = this.comments.filter(
      comment => comment.listId === this.collection.id
    );

    this.noOfComments = foundComments.length;

    await auth.onAuthStateChanged(async user => {
      if (user) {
        if (user.uid === this.collection.userId) {
          this.currentUser = true;
        }
      }
    });
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
