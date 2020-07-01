<template>
  <div class="wrapper">
    <div class="modal">
      <v-row justify="center" class="flex-column">
        <h1 class="display-1 mb-8 text-center">Pick your States of Interests</h1>
        <v-btn color="pink" class="white--text mb-8" @click="addSelectedState">Close</v-btn>
        <v-row v-for="(state, index) in states" :key="index" class="mb-2">
          <v-checkbox v-model="selectedStates" :label="state" :value="state"></v-checkbox>
        </v-row>
      </v-row>
    </div>
  </div>
</template>
 
<script>
import { states } from "@/helpers/states";

export default {
  name: "SelectState",
  props: ["toggleSelect", "addState", "existingStates"],
  data() {
    return {
      states: states,
      selectedStates: []
    };
  },
  created() {
    this.selectedStates = this.existingStates;
  },
  methods: {
    addSelectedState() {
      this.addState(this.selectedStates);

      this.toggleSelect(false);
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
  padding: 4rem 0;
}

.modal {
  background: #fff;
  position: relative;
  max-width: 350px;
  padding: 2rem 3rem;
  margin: 0 auto;
}
</style>
