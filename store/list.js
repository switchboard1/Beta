import { auth, db } from "@/plugins/firebase";
import * as firebase from "firebase/app";

export const state = () => ({
  lists: [],
  isSuccess: false,
  successMsg: "",
  loading: false
});
export const mutations = {
  setLists(state, list) {
    state.lists = [list, ...state.lists];
  },
  setIsSuccess(state, value) {
    state.isSuccess = value;
  },
  setSuccessMsg(state, msg) {
    state.successMsg = msg;
  },
  setLoading(state, value) {
    state.loading = value;
  }
};
export const actions = {
  async addList({ commit }, list) {
    await auth.onAuthStateChanged(async function(user) {
      commit("setLoading", true);
      if (user) {
        const userFromDB = await db.collection("users").doc(user.uid);
        const userDoc = await userFromDB.get();

        const newList = {
          ...list,
          userId: user.uid,
          username: userDoc.data().username,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date())
        };

        await db.collection("item-list").add(newList);

        commit("setLists", newList);
        commit("setLoading", false);
        commit("setIsSuccess", true);
        commit("setSuccessMsg", "Your review was successfully posted");
      } else {
        return;
      }
    });
  },
  toggleIsSuccess({ commit }, value) {
    commit("setIsSuccess", value);
  },
  toggleSuccessMsg({ commit }, value) {
    commit("setSuccessMsg", "");
  }
};
export const getters = {
  getLists(state) {
    return state.lists;
  },
  getIsSuccess(state) {
    return state.isSuccess;
  },
  getSuccessMsg(state) {
    return state.successMsg;
  },
  getLoading(state) {
    return state.loading;
  }
};
