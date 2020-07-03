<template>
  <v-container fill-height>
    <v-row>
      <v-col cols="6" align-self="center" :class="{ 'd-none': $vuetify.breakpoint.xs }">
        <!-- <v-img src="login.svg" width="280" class="mx-auto" /> -->
        <v-img :src="require('~/static/login.svg')" width="280" class="mx-auto" />
      </v-col>
      <v-col sm="6" md="6" lg="6" xs="12" align-self="center">
        <h1 class="title font-weight-black grey--text text--darken-1">We are glad you are back!</h1>
        <h1
          class="display-2 font-weight-black grey--text text--darken-3 mt-4 mb-2"
        >Login to your account</h1>
        <p class="grey--text text--darken-2">
        </p>
        <v-alert type="error" v-if="error" dismissible>{{ error }}</v-alert>
        <form @submit.prevent="loginUser">
          <v-row class="mt-8">
            <v-col cols="12" class="py-0">
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
            <v-col cols="12" class="py-0 mb-6">
              <label class="caption">
                <v-text-field
                  outlined
                  v-model="user.password"
                  :rules="rules.password"
                  type="password"
                  label="Password"
                  hint="At least 8 characters"
                />
              </label>
              <v-row class="mx-0" justify="end">
                <v-btn text color="pink" @click="toggleForgotPasswordModal(true)">Forgot Password?</v-btn>
                <ForgotPassword
                  v-if="forgotPasswordModal"
                  :toggleForgotPasswordModal="toggleForgotPasswordModal"
                />
              </v-row>
            </v-col>
          </v-row>
          <v-btn v-if="loading" large depressed class="pink">
            <span class="white--text">...</span>
          </v-btn>
          <v-btn type="submit" v-else @click="loginUser" large depressed class="pink">
            <span class="white--text">Login</span>
          </v-btn>
        </form>

        <client-only>
          <p class="mt-4 body-2 grey--text text--darken-3">
            New to Most for your Money? You can sign up
            <!-- <a href="/signup" class="pink--text font-weight-black">here.</a> -->
            <nuxt-link to="/signup" class="pink--text font-weight-black">here</nuxt-link>
          </p>
        </client-only>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required, email, minLength } from "vuelidate/lib/validators";
import { auth, db } from "@/plugins/firebase";
import { getUserFromCookie } from "@/helpers";
import ForgotPassword from "@/components/ForgotPassword.vue";

export default {
  // asyncData({ req, redirect }) {
  //   if (process.server) {
  //     const user = getUserFromCookie(req);
  //     console.log('b', getUserFromCookie(req))
  //     if (user) {
  //       console.log("redirecting server");
  //       redirect("/dashboard");
  //     }
  //   } else {
  //     var user = auth.currentUser;
  //     if (user) {
  //       redirect("/dashboard");
  //     }
  //     //   console.log($nuxt.$router)
  //   }
  // },,
  components: {
    ForgotPassword
  },
  middleware: "auth",
  head() {
    return {
      title: "Login"
    };
  },
  data: () => ({
    forgotPasswordModal: false,
    loginFormHasError: false,
    user: {
      email: "",
      password: ""
    },
    rules: {
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
      ]
    }
  }),
  validations: {
    user: {
      username: { required },
      password: { required }
    }
  },
  computed: {
    ...mapGetters({
      error: "auth/getError",
      loading: "auth/getLoading"
    })
  },
  methods: {
    ...mapActions(["setLoggedUser"]),
    loginUser() {
      this.$store.dispatch("auth/login", this.user);
    },
    toggleForgotPasswordModal(value) {
      this.forgotPasswordModal = value;
    }
  }
};
</script>
