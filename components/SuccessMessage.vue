<template>
  <div class="wrapper">
    <div class="modal">
      <h1 class="display-1 mb-4">{{ successMsg }}</h1>
      <p class="grey--text mb-8">Now you can share it on any platform</p>
      <v-row class="mb-8" justify="center">
        <v-btn fab dark small color="light-blue darken-4" class="mr-4">
          <v-icon dark>fab fa-facebook-f</v-icon>
        </v-btn>
        <v-btn fab dark small color="light-blue lighten-1" class="mr-4">
          <v-icon dark>fab fa-twitter</v-icon> 
        </v-btn>
        <v-btn fab dark small color="pink darken-3">
          <v-icon dark>fab fa-instagram</v-icon>
        </v-btn>
      </v-row>
      <v-btn color="pink" large class="white--text" @click="closeModal"
        >Ok</v-btn
      >
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SuccessMessage",
  props: ["toggleCreate"],
  computed: {
    ...mapGetters({
      successMsg: "categories/getSuccessMsg"
    })
  },
  methods: {
    closeModal() {
      this.$store.dispatch("categories/toggleIsSuccess", false);
      this.$store.dispatch("categories/toggleSuccessMsg", "");
      this.toggleCreate(false);
      window.location = "/dashboard";
    }
  }
};
</script>

<style scoped>
.wrapper {
  z-index: 30;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: #fff;
  position: relative;
  width: 80%;
  margin: 0 auto;
  padding: 2rem 4rem;
  text-align: center;
}
</style>
