<template>
  <v-card class="py-8 px-8" style="height: 100%;">
    <div
      style="width: 60px; height: 60px; background: #f4f4f4; margin: 0 auto; margin-bottom: 1rem; border-radius: 50%"
    ></div>
    <h1 class="headline">{{ user.firstname }} {{ user.lastname }}</h1>
    <p class="grey--text">{{user.states[0]}}</p>
    <v-btn
      text
      small
      color="pink"
      v-if="isFollowing"
      @click="removeFromFollowing"
      >Unfollow</v-btn
    >
    <v-btn text small color="pink" v-else @click="addToFollowing">Follow</v-btn>
  </v-card>
</template>

<script>
import { v4 as uuidv4 } from "uuid";

export default {
  name: "EachUser",
  props: ["user", "addFollowing", "removeFollowing", "selectedFollowing"],
  data() {
    return {
      isFollowing: false
    };
  },
  mounted() {
    const foundFollowing = this.selectedFollowing.filter(
      following => following.userFollowed === this.user.id
    );

    if (foundFollowing.length > 0) {
      this.isFollowing = true;
    }
  },
  methods: {
    addToFollowing() {
      const newFollowing = {
        id: uuidv4(),
        userFollowed: this.user.id
      };
      this.addFollowing(newFollowing);
      this.isFollowing = true;
    },
    removeFromFollowing() {
      this.removeFollowing(this.user.id);
      this.isFollowing = false;
    }
  }
};
</script>

<style></style>
