// import colors from 'vuetify/es5/util/colors'
import * as firebase from "firebase/app";
import "firebase/firestore";

export default {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s - " + "Beer List",
    title: "Beer List",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /* Generate dynamic user routes */
  generate: {
    fallback: true,
    async routes() {
      const firebaseConfig = {
        apiKey: "AIzaSyASOSn51l6LH2tY6O5Eh4AF42ir5GhNz6s",
        authDomain: "nuxt-firebase-992f7.firebaseapp.com",
        databaseURL: "https://nuxt-firebase-992f7.firebaseio.com",
        projectId: "nuxt-firebase-992f7",
        storageBucket: "nuxt-firebase-992f7.appspot.com",
        messagingSenderId: "416242841255",
        appId: "1:416242841255:web:83d47c29cb150b1dfc8d82"
      };

      let app = null;

      if (!firebase.apps.length) {
        app = firebase.initializeApp(firebaseConfig);
      }

      const db = firebase.firestore();

      const querySnapshot = await db.collection("users").get();

      return querySnapshot.docs.map(doc => {
        return `/users/${doc.id}`;
      });
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/Vuelidate.js",
    "~/plugins/firebase.js",
    { src: "~/plugins/icons.js", ssr: false }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    // Doc: https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv"
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
};
