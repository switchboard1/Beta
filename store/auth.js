// @/store/auth.js
import { auth, db } from "@/plugins/firebase";
import * as firebase from "firebase/app";
import Cookies from "js-cookie";

export const state = () => ({
  isLoggedIn: false,
  firstname: "",
  lastname: "",
  username: "",
  admin: false,
  publicName: false,
  states: [],
  following: [],
  loading: false,
  error: "",
  checkingForUser: true
});
export const mutations = {
  setIsLoggedIn(state, value) {
    state.isLoggedIn = value;
  },
  setFirstname(state, value) {
    state.firstname = value;
  },
  setLastname(state, value) {
    state.lastname = value;
  },
  setUsername(state, value) {
    state.username = value;
  },
  setAdmin(state, value) {
    state.admin = value;
  },
  setPublicName(state, value) {
    state.publicName = value;
  },
  setStates(state, value) {
    state.states = value;
  },
  setFollowing(state, value) {
    state.following = value;
  },
  setError(state, message) {
    state.error = message;
  },
  setLoading(state, value) {
    state.loading = value;
  },
  setCheckingForUser(state, value) {
    state.checkingForUser = value;
  }
};
export const actions = {
  async resetPassword({ commit }, { email, toggleSuccess }) {
    try {
      await auth.sendPasswordResetEmail(email);

      toggleSuccess(true);
    } catch (err) {
      toggleSuccess(false);
    }
  },
  checkLogin({ commit }) {
    commit("setCheckingForUser", true);
    auth.onAuthStateChanged(async user => {
      if (user) {
        auth.currentUser.getIdToken(true).then(token => {
          Cookies.set("access_token", token);
        });
        const foundUser = await db
          .collection("users")
          .doc(user.uid)
          .get();

        commit("setFirstname", foundUser.data().firstname);
        commit("setLastname", foundUser.data().lastname);
        commit("setUsername", foundUser.data().username);
        commit("setAdmin", foundUser.data().admin);
        commit("setPublicName", foundUser.data().publicName);
        commit("setStates", foundUser.data().states);
        commit("setFollowing", foundUser.data().following);
        commit("setIsLoggedIn", true);
        commit("setCheckingForUser", false);
      } else {
        Cookies.remove("access_token");
        commit("setUsername", "");
        commit("setCheckingForUser", false);
      }
    });
  },
  async login({ commit }, user) {
    try {
      commit("setLoading", true);
      setTimeout(() => {
        commit("setError", "");
      }, 5000);
      await auth.signInWithEmailAndPassword(user.email, user.password);
      commit("setError", "");
      commit("setLoading", false);

      this.$router.push("/dashboard");
    } catch (err) {
      commit("setLoading", false);
      commit("setError", err.message);
    }
  },
  async logout({ commit }) {
    auth.signOut().then(() => {
      commit("setIsLoggedIn", false);
      window.location.pathname = "/";
    });
  },
  async register({ commit }, user) {
    try {
      commit("setLoading", true);
      setTimeout(() => {
        commit("setError", "");
      }, 5000);

      if (
        user.firstname === "" ||
        user.lastname === "" ||
        user.username === ""
      ) {
        commit("setLoading", false);
        return commit("setError", "Please fill in the form");
      }

      if (
        user.firstname.length > 30 ||
        user.lastname.length > 30 ||
        user.username.length > 30
      ) {
        commit("setLoading", false);
        return commit("setError", "Maximum number of characters reached");
      }

      if (user.rpassword !== user.password) {
        commit("setLoading", false);
        return commit("setError", "Passwords don't match");
      }

      const savedUser = await auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      await db
        .collection("users")
        .doc(savedUser.user.uid)
        .set({
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          states: [],
          following: [],
          admin: false,
          publicName: false
        });

      commit("setError", "");
      commit("setLoading", false);

      this.$router.push("/dashboard");
    } catch (err) {
      commit("setLoading", false);
      commit("setError", err.message);
    }
  },
  async updateUser({ commit }, user) {
    try {
      commit("setLoading", true);
      const currentUser = auth.currentUser;

      const credential = firebase.auth.EmailAuthProvider.credential(
        currentUser.email,
        user.oldpassword
      );

      if (
        user.oldpassword !== "" &&
        user.password !== "" &&
        user.rpassword !== ""
      ) {
        currentUser
          .reauthenticateWithCredential(credential)
          .then(async function() {
            if (user.password !== user.rpassword) {
              commit("setError", "Passwords don't match");
              setTimeout(() => {
                commit("setError", "");
              }, 5000);
              commit("setLoading", false);
              return;
            }

            await currentUser.updatePassword(user.password);

            await db
              .collection("users")
              .doc(user.id)
              .set({
                admin: user.admin,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                states: user.states,
                following: user.following,
                publicName: user.publicName
              });
            window.location.reload(true);
            commit("setLoading", false);
          })
          .catch(function(error) {
            commit("setLoading", false);
            commit("setError", error.message);
            setTimeout(() => {
              commit("setError", "");
            }, 5000);
            return;
          });
        return;
      }

      await db
        .collection("users")
        .doc(user.id)
        .set({
          admin: user.admin,
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          states: user.states,
          following: user.following,
          publicName: user.publicName
        });
      window.location.reload(true);
      commit("setLoading", false);
    } catch (err) {
      console.log(err.message);
    }
  },
  async followUser({ commit }, { userId, updatedFollowing, toggleFollow }) {
    await db
      .collection("users")
      .doc(userId)
      .set(updatedFollowing);
    commit("setFollowing", updatedFollowing.following);
    toggleFollow(true);
  },
  async unFollowUser({ commit }, { userId, updatedFollowing, toggleFollow }) {
    await db
      .collection("users")
      .doc(userId)
      .set(updatedFollowing);
    commit("setFollowing", updatedFollowing.following);
    toggleFollow(false);
  },
  async deactivateAccount() {
    try {
      await auth.onAuthStateChanged(async function(user) {
        if (user) {
          window.location.reload(true);
        } else {
          return;
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  }
};
export const getters = {
  getIsLoggedIn(state) {
    return state.isLoggedIn;
  },
  getFirstname(state) {
    return state.firstname;
  },
  getLastname(state) {
    return state.lastname;
  },
  getUsername(state) {
    return state.username;
  },
  getAdmin(state) {
    return state.admin;
  },
  getPublicName(state) {
    return state.publicName;
  },
  getStates(state) {
    return state.states;
  },
  getFollowing(state) {
    return state.following;
  },
  getError(state) {
    return state.error;
  },
  getLoading(state) {
    return state.loading;
  },
  getCheckingForUser(state) {
    return state.checkingForUser;
  }
};
