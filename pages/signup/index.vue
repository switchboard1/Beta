<template>
  <v-container fill-height>
    <v-row>
      <v-col
        cols="6"
        align-self="center"
        :class="{ 'd-none': $vuetify.breakpoint.xs }"
      >
        <!-- <v-img src="list.svg" width="450" class="mx-auto" /> -->
        <v-img
          :src="require('~/static/list.svg')"
          width="450"
          class="mx-auto"
        />
      </v-col>
      <v-col sm="6" md="6" lg="6" cols="12" align-self="center">
        <h1 class="title font-weight-black grey--text text--darken-1">
          You are going to love this!
        </h1>
        <h1
          class="display-2 font-weight-black grey--text text--darken-3 mt-4 mb-2"
        >
          Create a new account
        </h1>
        <p class="grey--text text--darken-2">
        </p>
        <v-alert type="error" v-if="error" dismissible>{{ error }}</v-alert>
        <form @submit.prevent="registerUser">
          <v-row class="mt-8">
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <v-text-field
                outlined
                v-model="user.firstname"
                :rules="rules.name"
                type="text"
                label="Your First Name"
              />
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <v-text-field
                outlined
                v-model="user.lastname"
                :rules="rules.name"
                type="text"
                label="Your Last Name"
              />
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <v-text-field
                outlined
                v-model="user.username"
                :rules="rules.name"
                type="text"
                label="Username"
              />
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <label class="caption">
                <v-text-field
                  outlined
                  v-model="user.email"
                  :rules="rules.email"
                  type="email"
                  label="Email"
                  hint="Must be a valid email"
                />
              </label>
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <v-text-field
                outlined
                v-model="user.password"
                :rules="rules.password"
                type="password"
                label="Password"
                hint="At least 8 characters"
              />
            </v-col>
            <v-col sm="12" md="6" lg="6" cols="12" class="py-0">
              <v-text-field
                outlined
                v-model="user.rpassword"
                :rules="rules.repeatPassword"
                type="password"
                label="Repeat Password"
                hint="At least 8 characters"
              />
            </v-col>
          </v-row>
          <v-checkbox
            color="pink"
            v-model="checkbox"
            label="I agree with the terms and conditions"
          />
          <v-btn v-if="loading" large depressed class="pink">
            <span class="white--text">...</span>
          </v-btn>
          <v-btn
            type="submit"
            v-else
            :disabled="!checkbox"
            large
            depressed
            class="pink"
            @click="registerUser"
          >
            <span class="white--text">Sign Up</span>
          </v-btn>
        </form>

        <p class="mt-4 body-2 grey--text text--darken-3">
          Already have an account? You can log in&nbsp;
          <!-- <a href="/login" class="pink--text font-weight-black">here.</a> -->
          <nuxt-link to="/login" class="pink--text font-weight-black"
            >here</nuxt-link
          >
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { auth } from "@/plugins/firebase.js";
import { mapGetters } from "vuex";
import { getUserFromCookie } from "@/helpers";

export default {
  asyncData({ req, redirect }) {
    if (process.server) {
      const user = getUserFromCookie(req);
      //   console.log('b', getUserFromCookie(req))
      if (user) {
        redirect("/dashboard");
      }
    } else {
      var user = auth.currentUser;
      if (user) {
        redirect("/dashboard");
      }
      //   console.log($nuxt.$router)
    }
  },
  head() {
    return {
      title: "Signup"
    };
  },
  computed: {
    ...mapGetters({
      error: "auth/getError",
      loading: "auth/getLoading"
    })
  },
  data: () => ({
    checkbox: false,
    user: {
      firstname: "",
      lastname: "",
      username: "",
      email: "",
      password: "",
      rpassword: ""
    },
    rules: {
      name: [
        value => !!value || "Required.",
        value => (value || "").length <= 20 || "Max 30 characters"
      ],
      username: [
        value => !!value || "Required.",
        value => (value || "").length <= 20 || "Max 30 characters"
      ],
      email: [
        value => !!value || "Required.",
        value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        }
      ],
      password: [
        value => !!value || "Required.",
        value => (value || "").length >= 8 || "Not 8 or more characters"
      ],
      repeatPassword: [
        value => !!value || "Required.",
        value => (value || "").length >= 8 || "Not 8 or more characters"
      ]
    }
  }),
  methods: {
    registerUser() {
      this.$store.dispatch("auth/register", this.user);
    }
  }
};
</script>
