<template>
  <div>
    <v-row>
      <v-col sm="12" lg="8" md="8" cols="12">
        <v-row>
          <div class="img mr-8">
            <span class="pink white--text">${{ item.productPrice }}</span>
          </div>
          <div>
            <h1 class="headline">{{ item.productTitle }}</h1>
            <p class="mb-0">
              <span v-if="nonAuthor">By {{ item.nonAuthorUsername }}</span>
              <span v-else>By {{ username }}</span>
              &#8226;
              <span>
                {{ item.timestamp.toDate().getDate() }} /
                {{ item.timestamp.toDate().getMonth() + 1 }} /
                {{ item.timestamp.toDate().getFullYear() }}
              </span>
            </p>
          </div>
        </v-row>
      </v-col>
      <v-col sm="12" lg="4" md="4" cols="12" v-if="!nonAuthor || isAdmin">
        <v-btn
          v-if="editing"
          color="pink"
          class="white--text mr-4"
          @click="toggleEditing(false)"
        >Cancel</v-btn>
        <v-btn v-else color="pink" class="white--text mr-4" @click="toggleEditing(true)">Edit</v-btn>
        <v-btn outlined color="pink" @click="removeItem(item.id)">Remove</v-btn>
      </v-col>
    </v-row>
    <div v-if="editing">
      <v-row>
        <v-row>
          <v-col sm="12" lg="4" md="4" cols="12">
            <p class="grey--text subtitle-1">Product Title</p>
            <v-text-field
              label="Enter the name of the product"
              solo
              color="pink"
              v-model="productTitle"
            ></v-text-field>
          </v-col>
          <v-col sm="12" lg="8" md="8" cols="12">
            <p class="grey--text subtitle-1">Price</p>
            <v-text-field
              label="$20"
              type="number"
              min="1"
              solo
              color="pink"
              v-model="productPrice"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-row>
      <v-row>
        <v-col cols="12">
          <p class="grey--text subtitle-1">Description</p>
          <v-textarea
            solo
            color="pink"
            label="Description"
            value
            class="mb-4"
            v-model="productDescription"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="end" class="pb-4">
        <v-btn color="pink" class="white--text" @click="sendItem">Save</v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SingleItem",
  data() {
    return {
      editing: false,
      nonAuthor: false,
      productTitle: "",
      productPrice: "",
      productDescription: ""
    };
  },
  mounted() {
    if (this.item.nonAuthorId) {
      this.nonAuthor = true;
    }
  },
  methods: {
    toggleEditing(value) {
      this.editing = value;
      this.productTitle = this.item.productTitle;
      this.productPrice = this.item.productPrice;
      this.productDescription = this.item.productDescription;
    },
    sendItem() {
      if (this.item.nonAuthorId) {
        this.editItem(this.item.id, {
          productTitle: this.productTitle,
          productPrice: this.productPrice,
          productDescription: this.productDescription,
          nonAuthorId: this.item.nonAuthorId,
          nonAuthorUsername: this.item.nonAuthorUsername
        });
      } else {
        this.editItem(this.item.id, {
          productTitle: this.productTitle,
          productPrice: this.productPrice,
          productDescription: this.productDescription
        });
      }
      this.editing = false;
    }
  },
  props: ["item", "removeItem", "editItem"],
  computed: {
    ...mapGetters({
      username: "auth/getUsername",
      isAdmin: "auth/getAdmin"
    })
  }
};
</script>

<style scoped>
.img {
  height: 60px;
  width: 60px;
  background: #f4f4f4;
  position: relative;
}
.img span {
  position: absolute;
  top: -10px;
  left: -10px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
