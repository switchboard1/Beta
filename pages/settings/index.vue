<template>
  <div>
    <div v-if="userLoading" class="pt-8 px-12">Loading...</div>
    <v-row class="pt-8" v-else>
      <v-col
        sm="10"
        md="10"
        lg="10"
        cols="12"
        style="border-right: 2px solid #eee; border-left: 2px solid #eee"
      >
        <div class="py-8 px-12">
          <v-row>
            <v-col sm="12" md="6" lg="6" cols="12" class="pr-8">
              <h1 class="headline grey--text mb-8">Personal information</h1>
              <v-row>
                <v-col sm="12" md="6" lg="6" cols="12">
                  <v-text-field
                    outlined
                    v-model="user.firstname"
                    type="text"
                    label="First Name"
                  />
                </v-col>
                <v-col sm="12" md="6" lg="6" cols="12">
                  <v-text-field
                    outlined
                    v-model="user.lastname"
                    type="text"
                    label="Last Name"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
                  <v-text-field
                    outlined
                    type="email"
                    label="Email"
                    disabled
                    v-model="user.email"
                  />
                </v-col>
                <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
                  <v-text-field
                    outlined
                    type="text"
                    label="Your username"
                    disabled
                    v-model="user.username"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12">
              <h1 class="headline grey--text mb-8">Change password</h1>
              <v-alert type="error" v-if="error" dismissible>
                {{ error }}
              </v-alert>
              <v-row>
                <v-col sm="12" md="6" lg="6" cols="12">
                  <v-text-field
                    outlined
                    v-model="user.oldpassword"
                    type="password"
                    label="Current password"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
                  <v-text-field
                    outlined
                    v-model="user.password"
                    type="password"
                    label="Your new password"
                  />
                </v-col>
                <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
                  <v-text-field
                    outlined
                    v-model="user.rpassword"
                    type="password"
                    label="Retype new password"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="6" lg="6" cols="12" class="pr-8">
              <h1 class="headline grey--text mb-8">States of interest</h1>
              <v-row>
                <v-col sm="12" md="12" lg="12" cols="12">
                  <div
                    style="display: grid; grid-gap: 1rem;"
                    :style="
                      $vuetify.breakpoint.smAndUp
                        ? 'grid-template-columns: 1fr 1fr'
                        : ''
                    "
                  >
                    <div v-for="(category, index) in categories" :key="index">
                      <v-autocomplete
                        v-model="categories[index]"
                        :items="filterStates"
                        :filter="customFilter"
                        item-text="name"
                        :label="category"
                        append-icon="close"
                        @click:append="removeCategory(category)"
                        solo
                      ></v-autocomplete>
                    </div>
                    <div>
                      <v-btn
                        style="width: 100%;"
                        outlined
                        x-large
                        color="pink"
                        @click="addCategory"
                        >+ Add interest</v-btn
                      >
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12">
              <h1 class="headline grey--text mb-4">App settings</h1>
              <p class="mb-0">Profile visibility</p>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="[
                      'Public - Everyone can see what I publish',
                      'Private - No one can see what I publish'
                    ]"
                    label="Public - Everyone can see my lists"
                    solo
                  ></v-select>
                </v-col>
              </v-row>
              <p class="mb-0">Notifications</p>
              <v-row class="justify-between">
                <v-col cols="8" class="grey--text"
                  >Notify me when someone interacts with my collection</v-col
                >
                <v-col cols="4">
                  <v-switch class="ma-2" label="ON / OFF"></v-switch>
                </v-col>
              </v-row>
              <v-row class="justify-between">
                <v-col cols="8" class="grey--text"
                  >Send me email updates when there's news on the app</v-col
                >
                <v-col cols="4">
                  <v-switch class="ma-2" label="ON / OFF"></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="6" lg="6" cols="12" class="ml-auto">
              <h1 class="headline grey--text mb-4">Account deactivation</h1>
              <v-btn color="pink" outlined rounded @click="deactivateAccount">
                <i class="material-icons mr-4">warning</i>
                Deactivate account
              </v-btn>
            </v-col>
          </v-row>
          <v-btn v-if="loading" color="pink" class="white--text mt-12" large
            >...</v-btn
          >
          <v-btn
            v-else
            color="pink"
            class="white--text mt-12"
            large
            @click="updateUser"
            >Save changes</v-btn
          >
          <SelectState
            v-if="openSelect"
            :toggleSelect="toggleSelect"
            :addState="addState"
            :existingStates="states"
          />
        </div>
      </v-col>
      <v-col sm="2" md="2" lg="2" :hidden="$vuetify.breakpoint.xsOnly">
        <v-row class="flex-column ml-4" no-gutters align="start">
          <h3 class="grey--text mb-4 px-4">Tools</h3>
          <v-btn to="/dashboard" text class="mb-2">Feed</v-btn>
          <v-btn to="/profile" text class="mb-2">Profile</v-btn>
          <v-btn to="/" text class="mb-2">Drafts</v-btn>
          <v-btn to="/" text class="mb-2">Favorites</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { auth, db } from "@/plugins/firebase";
import { getUserFromCookie } from "@/helpers";
import SelectState from "@/components/settings/SelectState";
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
    SelectState
  },
  data() {
    return {
      userLoading: true,
      openSelect: false,
      categoryInput: "",
      filterStates: states,
      categories: [],
      following: [],
      user: {
        id: "",
        firstname: "",
        lastname: "",
        username: "",
        admin: false,
        publicName: false,
        email: "",
        oldpassword: "",
        password: "",
        rpassword: ""
      }
    };
  },
  computed: {
    ...mapGetters({
      error: "auth/getError",
      loading: "auth/getLoading"
    })
  },
  methods: {
    handleCategory() {
      console.log(this.categoryInput);
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    addCategory() {
      this.categories = [...this.categories, ""];
      this.categories.forEach(item => {
        if (this.filterStates.includes(item)) {
          this.filterStates = states.filter(state => state !== item);
        }
      });
    },
    removeCategory(category) {
      this.categories = this.categories.filter(
        eachCategory => category !== eachCategory
      );
      this.filterStates = [...this.filterStates, category];
      this.filterStates = this.filterStates.sort();
    },
    toggleSelect(value) {
      this.openSelect = value;
      if (this.openSelect === true) {
        document.body.style =
          "overflow-y: hidden; height: 100vh; position: fixed;";
      } else {
        document.body.style =
          "overflow-y: scroll; height: auto; position: static;";
      }
    },
    updateUser() {
      if (this.user.firstname === "" || this.user.lastname === "") {
        return;
      } else {
        const categories = this.categories.filter(
          eachCategory => eachCategory !== ""
        );

        this.$store.dispatch("auth/updateUser", {
          id: this.user.id,
          email: this.user.email,
          oldpassword: this.user.oldpassword,
          password: this.user.password,
          rpassword: this.user.rpassword,
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          username: this.user.username,
          admin: this.user.admin,
          publicName: this.user.publicName,
          states: categories,
          following: this.following
        });
      }
    },
    deactivateAccount() {
      this.$store.dispatch("auth/deactivateAccount");
    }
  },
  async mounted() {
    const state = this;
    const userState = this.user;

    this.userLoading = true;
    await auth.onAuthStateChanged(async function(user) {
      if (user) {
        userState.email = user.email; 
        userState.id = user.uid;

        const userFromDB = await db.collection("users").doc(user.uid);
        const userDoc = await userFromDB.get();

        userState.firstname = userDoc.data().firstname;
        userState.lastname = userDoc.data().lastname;
        userState.username = userDoc.data().username;
        if (userDoc.data().admin !== undefined) {
          userState.admin = userDoc.data().admin;
        }
        if (userDoc.data().publicName !== undefined) {
          userState.publicName = userDoc.data().publicName;
        }

        if (userDoc.data().states) {
          state.categories = userDoc.data().states;
        }
        if (userDoc.data().following) {
          state.following = userDoc.data().following;
        }
        state.userLoading = false;
      } else {
        state.userLoading = false;
        return;
      }
    });
  }
};
</script>

<style></style>
