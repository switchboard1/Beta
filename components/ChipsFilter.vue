<template>
  <div> 
    <v-expand-transition>
      <v-responsive v-if="!kick">
        <v-container
          :class="{ 'py-6': $vuetify.breakpoint.smAndDown, 'py-12': !$vuetify.breakpoint.smAndDown }"
        >
          <v-row justify="center">
            <v-col cols="auto" class="text-center">
              <h1
                class="display-2 font-weight-bold grey--text text--darken-4"
                :class="{'display-1 mb-2': $vuetify.breakpoint.smAndDown}"
              >Welcome to Beer List! Wow</h1>
              <h1 class="title font-weight-light">Discover new drinks and new places near you.</h1>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-expand-transition>
    <v-row align="center" dense :class="{'flex-column': $vuetify.breakpoint.xsOnly}">
      <v-col sm="3" md="3" lg="3" xs="12">
        <v-select
          dark
          background-color="pink"
          :menu-props="{ offsetY: true }"
          solo
          flat
          @change="handleStatusFilter"
          hide-details
          label="Category"
          :items="tags"
          full-width
        ></v-select>
      </v-col>
      <v-col sm="9" md="9" lg="9" xs="12" :class="{'mb-4': $vuetify.breakpoint.xsOnly}">
        <!-- <v-text-field
          outlined
          @input="handleSearch"
          v-model="search"
          @click="kick = true"
          hide-details
          type="search"
        />-->
        <v-text-field
          outlined
          @input="handleSearch"
          v-model="search"
          color="pink"
          hide-details
          type="search"
        />
      </v-col>
    </v-row>
    <v-fade-transition>
      <v-row justify="center" v-if="!kick">
        <v-col cols="auto">
          <span class="grey--text text--darken-1">
            You can search for
            <strong class="ml-3">brew</strong>
            <strong class="mx-3">company</strong>
            <strong>Jackson</strong>
          </span>
        </v-col>
      </v-row>
    </v-fade-transition>
    <v-fade-transition>
      <v-chip-group
        mandatory
        v-if="kick"
        v-model="tag"
        column="true"
        active-class="pink--text"
        class="text-capitalize"
      >
        <v-chip v-for="tag in tags" :key="tag" @click="handleStatusFilter(tag)">{{ tag }}</v-chip>
      </v-chip-group>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from '~/helpers/index'
export default {
  data: () => ({
    orderOpen: false,
    orderChanged: false,
    tag: 'all',
    kick: false,
    search: '',
    tags: [
      'all',
      'micro',
      'regional',
      'brewpub',
      'large',
      'planning',
      'bar',
      'contract',
      'proprietor'
    ]
  }),
  computed: {
    /* search() {
      return this.$store.state.leads.filter.search
    }, */
    ...mapGetters({
      filteredCategories: 'categories/getFilteredCategories'
    }),
    filteredTags() {
      const unique = [
        ...new Set(this.filteredCategories.map((item) => item.brewery_type))
      ]
      return unique
    },
    status() {
      return this.$store.state.categories.filter.status
    },
    order() {
      return this.$store.state.categories.filter.order
    },
    orderText() {
      switch (this.order) {
        case 'companyName':
          return 'Company Name'
        case 'jobTitle':
          return 'Job Title'
        case 'status':
          return 'Status'
        default:
          return 'Created Date'
      }
    }
  },
  methods: {
    handleStatusFilter(status) {
      console.log('statusfilter', status)
      this.$store.dispatch('categories/filterStatus', status)
    },
    handleSearch: debounce(function(e) {
      console.log('handlesearch', this.search)
      if (this.search.length > 1) {
        this.kick = true
        this.$store.dispatch('categories/filterSearch', this.search)
      }
    }, 200),
    handleFilterOrder(orderBy) {
      this.orderOpen = false
      this.orderChanged = true
      this.$store.dispatch('categories/filterOrder', orderBy)
    },
    closeOrderDropDown(e) {
      this.orderOpen = false
    }
  }
}
</script>

<style></style>
