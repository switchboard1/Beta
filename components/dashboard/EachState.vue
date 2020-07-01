<template>
  <div class="state" :class="{ pink: active }" @click="toggleActive">
    <div
      style="width: 60px; height: 60px; background: #f4f4f4; margin-bottom: 1rem; border-radius: 50%"
    ></div>
    <h1 class="headline font-weight-bold" :class="{ 'white--text': active }">
      {{ state }}
    </h1> 
  </div>
</template>

<script>
export default {
  name: "DashboardEachState",
  props: ["state", "addState", "removeState"],
  data() {
    return {
      active: false
    };
  },
  methods: {
    toggleActive() {
      this.active = !this.active;
      if (this.active) {
        this.addState(this.state);
      } else {
        this.removeState(this.state);
      }
    }
  }
};
</script>

<style scoped>
.state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
}
</style>
