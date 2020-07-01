<template>
  <v-container style="overflow-x: hidden;">
    <div v-if="!dataLoading">
      <CategoryFilter :dashboard="true" />
      <div v-if="success">
        <div v-if="loading">Loading...</div>
        <v-row v-else justify="center">
          <v-col
            sm="10"
            md="10"
            lg="10"
            cols="12"
            style="border-right: 2px solid #eee; border-left: 2px solid #eee"
          >
            <div class="mt-4 mx-auto" style="width: 90%">
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
          <v-col
            sm="2"
            md="2"
            lg="2"
            cols="12"
            :hidden="$vuetify.breakpoint.xsOnly"
            v-if="isLoggedIn"
          >
            <v-row class="flex-column ml-4" no-gutters align="start">
              <h3 class="grey--text mb-4 px-4">Tools</h3>
              <v-btn to="/dashboard" text class="mb-2 pink--text">Feed</v-btn>
              <v-btn to="/profile" text class="mb-2">Profile</v-btn>
              <v-btn to="/" text class="mb-2">Drafts</v-btn>
              <v-btn to="/favorites" text class="mb-2">Favorites</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <v-row class="mt-4" v-else>
        <v-stepper v-model="e1" style="width: 80%; margin: 0 auto; box-shadow: none;">
          <v-stepper-items>
            <v-stepper-content step="1">
              <v-row align="center" justify="center" class="flex-column text-center">
                <h1
                  class="display-2 font-weight-bold grey--text text--darken-4 px-4 mb-4"
                  :class="{ 'display-1 mb-2': $vuetify.breakpoint.smAndDown }"
                >Welcome to Beer List!</h1>
                <h1 class="title font-weight-light px-4">
                  You can find the breweries you want to follow and they will
                  appear on your feed.
                </h1>
                <v-btn color="pink" class="white--text mt-8" @click="e1 = 2">Next</v-btn>
              </v-row>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-row align="center" justify="center" class="flex-column text-center">
                <h1
                  class="display-1 font-weight-bold grey--text text--darken-4 px-4 mb-4"
                  :class="{ 'mb-2': $vuetify.breakpoint.smAndDown }"
                >Select the states you want to view.</h1>
                <State :states="states" :addState="addState" :removeState="removeState" />
                <v-row justify="space-between" style="width: 50%">
                  <v-btn
                    color="yellow darken-2"
                    outlined
                    class="white--text mt-8"
                    @click="e1 = 1"
                  >Back</v-btn>
                  <v-btn
                    color="pink"
                    class="white--text mt-8"
                    @click="e1 = 3"
                    v-if="selectedStates.length > 0"
                  >Next</v-btn>
                  <v-btn color="pink" class="white--text mt-8" v-else>Next</v-btn>
                </v-row>
              </v-row>
            </v-stepper-content>
            <v-stepper-content step="3">
              <v-row align="center" justify="center" class="flex-column text-center">
                <h1
                  class="display-1 font-weight-bold grey--text text--darken-4 px-4 mb-4"
                  :class="{ 'mb-2': $vuetify.breakpoint.smAndDown }"
                >Most popular brewery in your selected states</h1>
                <v-row style="width: 100%; padding: 1rem;" justify="center">
                  <template v-if="users.length > 3">
                    <v-col
                      v-for="user in users.slice(0, 2)"
                      :key="user.id"
                      style="max-width: 220px;"
                    >
                      <EachUser
                        :user="user"
                        :addFollowing="addFollowing"
                        :removeFollowing="removeFollowing"
                        :selectedFollowing="selectedFollowing"
                      />
                    </v-col>
                    <v-col style="max-width: 220px;">
                      <v-row align-content="center" justify="center" style="height: 100%;">
                        <v-icon class="material-design" style="font-size: 3rem;" color="pink">add</v-icon>
                      </v-row>
                    </v-col>
                  </template>
                  <template v-else>
                    <v-col
                      v-for="user in users.slice(0, 2)"
                      :key="user.id"
                      style="max-width: 220px;"
                    >
                      <EachUser
                        :user="user"
                        :addFollowing="addFollowing"
                        :removeFollowing="removeFollowing"
                        :selectedFollowing="selectedFollowing"
                      />
                    </v-col>
                  </template>
                </v-row>

                <v-row justify="space-between" style="width: 50%">
                  <v-btn
                    v-if="loading"
                    color="yellow darken-2"
                    outlined
                    class="white--text mt-8"
                  >Back</v-btn>
                  <v-btn
                    v-else
                    color="yellow darken-2"
                    outlined
                    class="white--text mt-8"
                    @click="e1 = 2"
                  >Back</v-btn>
                  <v-btn color="pink" class="white--text mt-8" v-if="loading">...</v-btn>
                  <v-btn color="pink" class="white--text mt-8" @click="finishForm" v-else>Finish</v-btn>
                </v-row>
              </v-row>
            </v-stepper-content>
          </v-stepper-items>
          <v-stepper-header style="max-width: 180px; box-shadow: none; margin: 0 auto;">
            <v-stepper-step :complete="e1 > 1" step="1" color="pink"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2" color="pink"></v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3" color="pink"></v-stepper-step>
          </v-stepper-header>
        </v-stepper>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, email, minLength } from "vuelidate/lib/validators";
import { auth, db } from "@/plugins/firebase";
import { getUserFromCookie } from "@/helpers";
import State from "@/components/dashboard/State";
import EachUser from "@/components/dashboard/EachUser";
import Collection from "@/components/filter_items/Collection";
import Product from "@/components/filter_items/Product";
import User from "@/components/filter_items/User";
import CategoryFilter from "@/components/CategoryFilter";
import NoitemCard from "@/components/NoitemCard";
import { states } from "@/helpers/states";

export default {
  // asyncData({ req, redirect }) {
  //   if (process.server) {
  //     const user = getUserFromCookie(req);
  //     //   console.log('b', getUserFromCookie(req))
  //     if (!user) {
  //       console.log("redirecting server");
  //       redirect("/login");
  //     }
  //   } else {
  //     var user = auth.currentUser;
  //     if (!user) {
  //       redirect("/login");
  //     }
  //     //   console.log($nuxt.$router)
  //   }
  // },
  components: {
    State,
    EachUser,
    Collection,
    Product,
    User,
    NoitemCard,
    CategoryFilter
  },
  head() {
    return {
      title: "dashboard"
    };
  },
  data() {
    return {
      loading: false,
      success: true,
      states: states,
      selectedFollowing: [],
      selectedStates: [],
      e1: 1,
      defaultTag: "All",
      tags: ["All", ...states]
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/getIsLoggedIn",
      publicName: "auth/getPublicName",
      dataLoading: "categories/getDataLoading",
      noResult: "categories/getNoResult",
      filteredData: "categories/getFilteredData",
      users: "categories/getUsers"
    })
  },
  created() {
    this.checkUserList();
    this.$store.dispatch("categories/fetchActivity", true);
  },
  methods: {
    async checkUserList() {
      this.loading = true;
      await auth.onAuthStateChanged(async user => {
        if (user) {
          const currentUser = await db.collection("users").doc(user.uid);
          const userDoc = await currentUser.get();
          this.selectedFollowing = userDoc.data().following;
          this.selectedStates = userDoc.data().states;

          if (userDoc.data().states.length > 0) {
            this.success = true;
            this.loading = false;
          } else {
            this.success = false;
            this.loading = false;
          }
        } else {
          this.success = true;
          this.loading = false;
        }
      });
    },
    addState(stateReturned) {
      this.selectedStates = [stateReturned, ...this.selectedStates];
    },
    removeState(stateReturned) {
      this.selectedStates = this.selectedStates.filter(
        state => state !== stateReturned
      );
    },
    addFollowing(followingReturned) {
      this.selectedFollowing = [followingReturned, ...this.selectedFollowing];
    },
    removeFollowing(userFollowed) {
      this.selectedFollowing = this.selectedFollowing.filter(
        following => following.userFollowed !== userFollowed
      );
    },
    async finishForm() {
      this.loading = true;
      await auth.onAuthStateChanged(async user => {
        if (user) {
          if (
            this.selectedStates.length > 0 &&
            this.selectedFollowing.length > 0
          ) {
            const currentUser = await db.collection("users").doc(user.uid);
            const userDoc = await currentUser.get();

            await currentUser.set({
              admin: userDoc.data().admin,
              firstname: userDoc.data().firstname,
              lastname: userDoc.data().lastname,
              username: userDoc.data().username,
              states: this.selectedStates,
              following: this.selectedFollowing,
              publicName: this.publicName
            });
            window.location.pathname = "/dashboard";
            this.loading = false;
          } else {
            this.loading = false;
          }
        }
      });
    }
  }
};
</script>
<style scoped></style>
