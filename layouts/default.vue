<template>
  <v-app>
    <v-app-bar app flat color="white" light style="z-index: 20;">
      <v-container>
        <v-row align="center" justify="space-between" style="width: 100%">
          <v-col cols="auto">
            <v-row align="center">
              <v-avatar size="36" color="grey lighten-1">
                <span class="font-weight-bold grey--text text--darken-4">B</span>
              </v-avatar>
              <span class="ml-4">Beer List</span>
            </v-row>
          </v-col>
          <v-col cols="auto" style="padding: 0;">
            <button
              class="hamburger hamburger--squeeze"
              type="button"
              :class="{ 'is-active': isOpenSidebar }"
              @click="toggleNavBtn"
              v-show="$vuetify.breakpoint.xsOnly"
            >
              <span class="hamburger-box">
                <span class="hamburger-inner"></span>
              </span>
            </button>
            <template v-if="checkingForUser"></template>
            <template v-else>
              <v-row v-if="isLoggedIn" align="center" v-show="$vuetify.breakpoint.smAndUp">
              <v-btn
                large
                dark
                class="text-none mr-3"
                depressed
                color="pink"
                @click="toggleCreate(true)"
              >Create</v-btn>

              <v-btn fab dark small class="text-none mr-3" depressed color="yellow darken-2">
                <i class="material-icons">notifications</i>
              </v-btn>
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    dark
                    small
                    class="text-none mr-3"
                    depressed
                    color="yellow darken-2"
                    v-on="on"
                  >
                    <i class="material-icons">person</i>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item class="pr-12">
                    <v-list-item-title>
                      <nuxt-link
                        to="/dashboard"
                        class="black--text"
                        style="text-decoration: none;"
                      >Dashboard</nuxt-link>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="pr-12">
                    <v-list-item-title>Help</v-list-item-title>
                  </v-list-item>
                  <v-list-item class="pr-12">
                    <v-list-item-title>
                      <nuxt-link
                        to="/settings"
                        class="black--text"
                        style="text-decoration: none;"
                      >Settings</nuxt-link>
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="pr-12">
                    <v-list-item-title>Invite Friend</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>
                      <v-btn class="px-0" large text @click="logOutUser">Logout</v-btn>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu> 
            </v-row>
            <v-row v-else align="center" v-show="$vuetify.breakpoint.smAndUp">
              <v-btn large text class="text-none mr-3" color="grey darken-2" to="/">Home</v-btn>
              <v-btn large outlined class="text-none mr-3" color="pink" to="/login">Login</v-btn>
              <v-btn large dark to="/signup" class="text-none" depressed color="pink">Sign Up</v-btn>
            </v-row>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <div
      class="sidebar"
      :class="{ 'sidebar-open': isOpenSidebar }"
      v-show="$vuetify.breakpoint.xsOnly"
    >
      <div v-if="isLoggedIn" class="content">
        <v-btn
          large
          dark
          class="text-none mb-3"
          depressed
          color="pink"
          @click="toggleCreate(true)"
        >Create</v-btn>
        <v-btn fab dark small class="text-none mb-3" depressed color="yellow darken-2">
          <i class="material-icons">notifications</i>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              class="text-none mb-3"
              depressed
              color="yellow darken-2"
              v-on="on"
            >
              <i class="material-icons">person</i>
            </v-btn>
          </template>
          <v-list>
            <v-list-item class="pr-12">
              <v-list-item-title>
                <nuxt-link
                  to="/dashboard"
                  class="black--text"
                  style="text-decoration: none;"
                >Dashboard</nuxt-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pr-12">
              <v-list-item-title>Help</v-list-item-title>
            </v-list-item>
            <v-list-item class="pr-12">
              <v-list-item-title>
                <nuxt-link
                  to="/settings"
                  class="black--text"
                  style="text-decoration: none;"
                >Settings</nuxt-link>
              </v-list-item-title>
            </v-list-item>
            <v-list-item class="pr-12">
              <v-list-item-title>Invite Friend</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn class="px-0" large text @click="logOutUser">Logout</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-row class="flex-column mt-8" no-gutters align="center">
          <h3 class="grey--text mb-4 px-4">Tools</h3>
          <v-btn to="/dashboard" text :class="{'pink--text': $route.path === '/dashboard'}">Feed</v-btn>
          <v-btn to="/profile" text :class="{'pink--text': $route.path === '/profile'}">Profile</v-btn>
          <v-btn to="/" text class="mb-2">Drafts</v-btn>
          <v-btn
            to="/favorites"
            text
            class="mb-2"
            :class="{'pink--text': $route.path === '/favorites'}"
          >Favorites</v-btn>
        </v-row>
      </div>
      <div v-else class="content">
        <v-btn
          large
          text
          class="text-none"
          color="grey darken-2"
          to="/"
          @click="toggleNavBtn"
        >Home</v-btn>
        <v-btn
          large
          outlined
          class="text-none my-8"
          color="pink"
          to="/login"
          @click="toggleNavBtn"
        >Login</v-btn>
        <v-btn
          large
          dark
          to="/signup"
          class="text-none"
          depressed
          color="pink"
          @click="toggleNavBtn"
        >Sign Up</v-btn>
      </div>
    </div>
    <div v-if="isSuccess">
      <SuccessMessage :toggleCreate="toggleCreate" />
    </div>
    <div v-else>
      <CreateItem v-if="isOpenCreate" :toggleCreate="toggleCreate" />
    </div>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import "material-design-icons-iconfont/dist/material-design-icons.css";
import { mapGetters } from "vuex";
import CreateItem from "@/components/CreateItem";
import SuccessMessage from "@/components/SuccessMessage";

export default {
  mounted() {
    this.$store.dispatch("auth/checkLogin");
  },
  components: {
    CreateItem,
    SuccessMessage
  },
  data() {
    return {
      isOpenCreate: false,
      isOpenSidebar: false
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/getIsLoggedIn",
      isSuccess: "categories/getIsSuccess",
      checkingForUser: "auth/getCheckingForUser"
    })
  },
  methods: {
    logOutUser() {
      this.$store.dispatch("auth/logout");
    },
    toggleNavBtn() {
      this.isOpenSidebar = !this.isOpenSidebar;
    },
    toggleCreate(value) {
      this.isOpenCreate = value;
      if (this.isOpenCreate === true) {
        document.body.style =
          "overflow-y: hidden; height: 100vh; position: fixed; width: 100%;";
      } else {
        document.body.style =
          "overflow-y: scroll; height: auto; position: static;";
      }
    }
  }
};
</script>

<style>
.sidebar {
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0);
  width: 100%;
  z-index: 10;
  transition: background 0.5s;
  pointer-events: none;
}
.sidebar .content {
  background: #fff;
  height: 100%;
  width: 45%;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 5rem;
  transition: transform 0.5s;
  transform: translateX(200%);
}

.sidebar-open {
  background: rgba(0, 0, 0, 0.5);
  pointer-events: all;
}

.sidebar-open .content {
  transform: translateX(0);
}

.hamburger {
  padding: 1.5rem 0;
  display: inline-block;
  cursor: pointer;
  transition-property: opacity, filter;
  transition-duration: 0.15s;
  transition-timing-function: linear;
  font: inherit;
  color: inherit;
  text-transform: none;
  background-color: transparent;
  border: 0;
  margin: 0;
  overflow: visible;
}
.hamburger:focus {
  outline: none;
}
.hamburger:hover {
  opacity: 0.7;
}
.hamburger.is-active:hover {
  opacity: 0.7;
}
.hamburger.is-active .hamburger-inner,
.hamburger.is-active .hamburger-inner::before,
.hamburger.is-active .hamburger-inner::after {
  background-color: #000;
}

.hamburger-box {
  width: 40px;
  height: 24px;
  display: inline-block;
  position: relative;
}

.hamburger-inner {
  display: block;
  top: 50%;
  margin-top: -2px;
}
.hamburger-inner,
.hamburger-inner::before,
.hamburger-inner::after {
  width: 40px;
  height: 4px;
  background-color: #000;
  border-radius: 4px;
  position: absolute;
  transition-property: transform;
  transition-duration: 0.15s;
  transition-timing-function: ease;
}
.hamburger-inner::before,
.hamburger-inner::after {
  content: "";
  display: block;
}
.hamburger-inner::before {
  top: -10px;
}
.hamburger-inner::after {
  bottom: -10px;
}
.hamburger--squeeze .hamburger-inner {
  transition-duration: 0.075s;
  transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
}
.hamburger--squeeze .hamburger-inner::before {
  transition: top 0.075s 0.12s ease, opacity 0.075s ease;
}
.hamburger--squeeze .hamburger-inner::after {
  transition: bottom 0.075s 0.12s ease,
    transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
}

.hamburger--squeeze.is-active .hamburger-inner {
  transform: rotate(45deg);
  transition-delay: 0.12s;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
.hamburger--squeeze.is-active .hamburger-inner::before {
  top: 0;
  opacity: 0;
  transition: top 0.075s ease, opacity 0.075s 0.12s ease;
}
.hamburger--squeeze.is-active .hamburger-inner::after {
  bottom: 0;
  transform: rotate(-90deg);
  transition: bottom 0.075s ease,
    transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
}
</style>
