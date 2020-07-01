<template>
  <div>
    <v-row align="center" class="text--none mx-auto ">
      <v-col cols="auto">
        <v-avatar size="72" tile color="grey lighten-2" />
      </v-col>
      <v-col cols="auto">
        <v-chip
          color="transparent"
          avatar
          pill
          class="grey--text text--darken-2"
        >
          <nuxt-link :to="'/users/' + user.id" style="text-decoration: none;">
            <h1
              class="title font-weight-bold grey--text text--darken-4"
              v-if="user.publicName"
            >
              {{ user.firstname }} {{ user.lastname }}
            </h1>
            <h1 class="title font-weight-bold grey--text text--darken-4" v-else>
              {{ user.username }}
            </h1>
          </nuxt-link>
        </v-chip>
      </v-col>
      <v-spacer />
    </v-row>
  </div>
</template>

<script>
export default {
  name: "User",
  props: ["user"]
};
</script>

<style></style>
