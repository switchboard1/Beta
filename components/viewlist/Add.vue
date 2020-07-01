<template>
  <div class="wrapper">
    <div class="modal">
      <h1 class="text-center mb-8">Add a product to a collection</h1>
      <v-row>
        <v-col sm="12" lg="2" md="2" cols="12">
          <v-file-input prepend-icon="mdi-camera" solo flat></v-file-input>
        </v-col>
        <v-col sm="12" lg="10" md="10" cols="12">
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
                @keydown="checkNegative"
                solo
                color="pink"
                v-model="productPrice"
              ></v-text-field>
            </v-col>
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
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn color="yellow darken-2" outlined class="mr-4" @click="toggleAddModal(false)">Cancel</v-btn>
        <v-btn color="pink" class="white--text" @click="saveToList">Save</v-btn>
      </v-row>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { mapGetters } from "vuex";
import { auth } from "@/plugins/firebase";

export default {
  name: "Add",
  props: ["toggleAddModal", "addItemToList", "isCreator"],
  data() {
    return {
      productTitle: "",
      productDescription: "",
      productPrice: ""
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/getIsLoggedIn",
      currentUserUsername: "auth/getUsername"
    })
  },
  methods: {
    async saveToList() {
      if (this.isLoggedIn) {
        let newItem = {
          id: uuidv4(),
          likes: 0,
          dislikes: 0,
          productTitle: this.productTitle,
          productDescription: this.productDescription,
          productPrice: this.productPrice
        };

        if (
          this.productTitle === "" ||
          this.productDescription === "" ||
          this.productPrice === ""
        ) {
          return;
        } else {
          if (this.isCreator) {
            this.addItemToList(newItem);
          } else {
            await auth.onAuthStateChanged(async user => {
              if (user) {
                newItem = {
                  ...newItem,
                  nonAuthorId: user.uid,
                  nonAuthorUsername: this.currentUserUsername
                };
                this.addItemToList(newItem);
              }
            });
          }
        }
      } else {
        window.location.pathname = "/login";
      }
    },
    checkNegative(e) {
      if (
        !(
          (e.keyCode > 95 && e.keyCode < 106) ||
          (e.keyCode > 47 && e.keyCode < 58) ||
          e.keyCode == 8 ||
          e.keyCode == 9
        )
      ) {
        e.preventDefault();
      }
    }
  }
};
</script>

<style scoped>
.wrapper {
  z-index: 40;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  padding: 2rem 0;
}

.modal {
  background: #fff;
  position: relative;
  width: 60%;
  margin: 0 auto;
  padding: 4rem;
}

@media (max-width: 960px) {
  .wrapper {
    padding: 0rem;
  }
  .modal {
    width: 100%;
    padding: 2rem;
  }
}
</style>
