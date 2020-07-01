<template>
  <v-app>
    <v-container class="py-12">
      <v-row align="center">
        <v-col cols="4">
          <v-img src="404.svg" />
        </v-col>
        <v-col cols="8">
          <h1 v-if="error.statusCode === 404" class="display-1">
            That link doesn't exist or something broke.
          </h1>

          <h1 v-else>
            {{ otherError }}
          </h1>
          <v-btn
            depressed
            large
            pink
            color="pink"
            dark
            class="mt-8 text-none"
            nuxt
            to="/"
            ><v-icon left>mdi-home</v-icon>Go home</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
