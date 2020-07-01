<template>
  <v-row align="center" class="text--none">
    <v-col cols="auto">
      <v-badge color="pink" content="$16" overlap left bordered>
        <v-avatar size="72" tile color="grey lighten-2" />
      </v-badge>
    </v-col>
    <v-col cols="auto">
      <h1 class="title font-weight-bold grey--text text--darken-4">
        {{ category.name }}
      </h1>
      <h1 class="subtitle-1 font-weight-black pink--text">
        {{ category.city }} {{ category.state }}
      </h1>
      <v-chip
        color="transparent"
        avatar
        pill
        class="mt-2 grey--text text--darken-2"
      >
        By
        <v-avatar right>
          <img src="https://randomuser.me/api/portraits/lego/8.jpg" />
        </v-avatar>
        <v-chip class="ml-8" color="pink" dark>{{
          category.brewery_type
        }}</v-chip>
      </v-chip>
    </v-col>
    <v-spacer />
    <v-col cols="auto">
      <v-avatar size="32" class="mr-4" color="orange darken-2">
        <v-img
          max-height="28"
          max-width="28"
          src="https://randomuser.me/api/portraits/lego/8.jpg"
          alt="Lego"
        />
      </v-avatar>
      <v-avatar
        size="32"
        v-for="i in 5"
        :key="i"
        :class="i === 1 ? '' : 'ml-n3'"
        :style="`z-index: ${5 - i}`"
        color="orange darken-2"
      >
        <v-img
          max-height="28"
          max-width="28"
          :src="`https://randomuser.me/api/portraits/lego/${i}.jpg`"
          alt="Lego"
        />
      </v-avatar>
      <span class="ml-4 grey--text text--darken-2"
        ><span class="pink--text font-weight-black">+ 12</span> commented</span
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>
