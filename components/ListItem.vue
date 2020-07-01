<template>
  <div>
    <v-row
      justify="space-between"
      class="pb-8"
      :class="{'px-4': $vuetify.breakpoint.smAndDown, 'px-12': $vuetify.breakpoint.mdAndUp}"
    >
      <div :class="{'w-full': $vuetify.breakpoint.smAndDown}">
        <v-row :class="{'flex-column': $vuetify.breakpoint.smAndDown}">
          <div
            class="mr-8"
            style="height: 60px; 
              width: 60px;
              background: #f4f4f4;
              position: relative;"
          >
            <span
              class="pink white--text d-flex justify-center align-center"
              style="position: absolute;
              top: -10px;
              left: -10px;
              height: 40px; 
              width: 40px;
              border-radius: 50%;"
            >${{ product.productPrice }}</span>
          </div>
          <div>
            <h1
              class="headline"
              style="line-break: anywhere;"
              :hidden="$vuetify.breakpoint.smAndDown"
            >{{ product.productTitle }}</h1>
            <h1
              class="headline"
              style="line-break: anywhere; cursor: pointer;"
              :hidden="$vuetify.breakpoint.mdAndUp"
              @click="toggleDropdown"
            >{{ product.productTitle }}</h1>
            <v-row
              class="mx-0 flex-nowrap"
              :class="{'justify-space-between': $vuetify.breakpoint.smAndDown}"
            >
              <p class="mb-0 caption">
                <template v-if="currentUser">
                  <nuxt-link
                    to="/profile"
                    style="text-decoration: none; color: #000;"
                  >By {{ username }}</nuxt-link>
                </template>
                <template v-else>
                  <template v-if="nonAuthor">
                    <nuxt-link
                      v-if="currentNonAuthor"
                      to="/profile"
                      style="text-decoration: none; color: #000;"
                    >By {{ product.nonAuthorUsername }}</nuxt-link>
                    <nuxt-link
                      v-else
                      :to="'/users/' + product.nonAuthorId"
                      style="text-decoration: none; color: #000;"
                    >By {{ product.nonAuthorUsername }}</nuxt-link>
                  </template>
                  <template v-else>
                    <nuxt-link
                      :to="'/users/' + userId"
                      style="text-decoration: none; color: #000;"
                    >By {{ username }}</nuxt-link>
                  </template>
                </template>
                &#8226;
                <span>
                  {{ product.timestamp.toDate().getDate() }} /
                  {{ product.timestamp.toDate().getMonth() + 1 }} /
                  {{ product.timestamp.toDate().getFullYear() }}
                </span>
              </p>
              <div v-if="!profile" :hidden="$vuetify.breakpoint.mdAndUp">
                <v-btn color="grey" outlined fab x-small dark>
                  <i class="material-icons">flag</i>
                </v-btn>
              </div>
            </v-row>
            <v-row class="mx-0 flex-nowrap align-center my-4" :hidden="$vuetify.breakpoint.mdAndUp"></v-row>
          </div>
        </v-row>
      </div>
      <div v-if="!profile" :hidden="$vuetify.breakpoint.smAndDown">
        <v-btn color="grey" outlined fab x-small dark>
          <i class="material-icons">flag</i>
        </v-btn>
      </div>
      <div v-if="!profile" :hidden="$vuetify.breakpoint.smAndDown">
        <v-btn color="grey lighten-1" fab small dark @click="addToMentions">
          <i class="material-icons">chat_bubble</i>
        </v-btn>
      </div>
      <div v-if="!profile" :class="{'mt-4': $vuetify.breakpoint.smAndDown}">
        <v-row class="mx-0" :class="{'flex-column': $vuetify.breakpoint.mdAndUp}">
          <div class="grey--text mb-4">
            <v-btn v-if="liked" color="pink" class="mr-2" fab x-small dark @click="removeLike">
              <i class="material-icons">thumb_up_alt</i>
            </v-btn>
            <v-btn
              v-else
              color="grey lighten-2"
              class="mr-2 black--text"
              fab
              x-small
              dark
              @click="likeProduct"
            >
              <i class="material-icons">thumb_up_alt</i>
            </v-btn>
            {{ likes }}
          </div>
          <div
            class="grey--text"
            :class="{'ml-4':$vuetify.breakpoint.smAndDown, 'ml-12': $vuetify.breakpoint.mdAndUp}"
          >
            {{ dislikes }}
            <v-btn
              v-if="disliked"
              color="pink"
              class="ml-2"
              fab
              x-small
              dark
              @click="removeDislike"
            >
              <i class="material-icons">thumb_down_alt</i>
            </v-btn>
            <v-btn
              v-else
              color="grey lighten-2"
              class="ml-2 black--text"
              fab
              x-small
              dark
              @click="dislikeProduct"
            >
              <i class="material-icons">thumb_down_alt</i>
            </v-btn>
          </div>
        </v-row>
      </div>
      <div v-if="!profile" class="mt-4" :hidden="$vuetify.breakpoint.mdAndUp">
        <v-btn color="grey lighten-1" fab x-small dark @click="addToMentions">
          <i class="material-icons md-18">chat_bubble</i>
        </v-btn>
      </div>
      <div :class="{'mt-4': $vuetify.breakpoint.smAndDown}">
        <v-btn
          color="grey lighten-2"
          class="ml-2 black--text"
          fab
          text
          large
          dark
          @click="toggleDropdown"
        >
          <i class="material-icons" v-if="dropdown">arrow_drop_up</i>
          <i class="material-icons" v-else>arrow_drop_down</i>
        </v-btn>
      </div>
    </v-row>
    <div v-if="dropdown" class="grey lighten-3 mt-4 py-4 px-8">
      <h3 class="grey--text mb-4">Product Description</h3>
      <p class="grey--text">{{ product.productDescription }}</p>
      <p>
        Price:
        <span class="pink--text headline font-weight-bold">${{ product.productPrice }}</span>
      </p>
    </div>
    <hr />
  </div>
</template>

<script>
import { auth } from "@/plugins/firebase";
import { mapGetters } from "vuex";

export default {
  name: "ListItem",
  props: [
    "product",
    "username",
    "userId",
    "profile",
    "listId",
    "updateItemsOnVote",
    "addMention"
  ],
  computed: {
    ...mapGetters({
      userLikes: "categories/getLikes",
      userDislikes: "categories/getDislikes"
    })
  },
  data() {
    return {
      dropdown: false,
      likes: 0,
      dislikes: 0,
      liked: false,
      disliked: false,
      currentUser: false,
      nonAuthor: false,
      currentNonAuthor: false
    };
  },
  async mounted() {
    const product = { ...this.product };

    this.likes = product.likes;
    this.dislikes = product.dislikes;

    await auth.onAuthStateChanged(user => {
      if (user) {
        if (this.product.nonAuthorUsername) {
          this.nonAuthor = true;
          if (this.product.nonAuthorId === user.uid) {
            this.currentNonAuthor = true;
          }
        } else {
          if (user.uid === this.product.userId) {
            this.currentUser = true;
          }
        }

        const foundLike = this.userLikes.find(like => {
          return (
            like.productId === this.product.id && like.listId === this.listId
          );
        });
        if (foundLike) {
          this.liked = true;
        } else {
          this.liked = false;
        }
        const foundDislike = this.userDislikes.find(dislike => {
          return (
            dislike.productId === this.product.id &&
            dislike.listId === this.listId
          );
        });
        if (foundDislike) {
          this.disliked = true;
        } else {
          this.disliked = false;
        }
      } else {
        if (this.product.nonAuthorUsername) {
          this.nonAuthor = true;
        }
      }
    });
  },
  methods: {
    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },
    setLikes(value) {
      this.likes = value;
    },
    setDislikes(value) {
      this.dislikes = value;
    },
    setLiked(value) {
      this.liked = value;
    },
    setDisliked(value) {
      this.disliked = value;
    },
    async likeProduct() {
      await auth.onAuthStateChanged(user => {
        if (user) {
          this.setLikes(this.likes + 1);
          this.setLiked(true);
          if (this.disliked === true) {
            this.setDislikes(this.dislikes - 1);
            this.setDisliked(false);
            this.updateItemsOnVote({
              id: this.product.id,
              likes: this.likes,
              dislikes: this.dislikes,
              productTitle: this.product.productTitle,
              productDescription: this.product.productDescription,
              productPrice: this.product.productPrice,
              timestamp: this.product.timestamp
            });

            const foundDislike = this.userDislikes.find(dislike => {
              return (
                dislike.productId === this.product.id &&
                dislike.listId === this.listId
              );
            });

            return this.$store.dispatch("categories/likeProduct", {
              listId: this.listId,
              userId: user.uid,
              productId: this.product.id,
              likes: this.likes,
              removeDislike: {
                disliked: true,
                args: {
                  dislikeId: foundDislike.id,
                  dislikes: this.dislikes
                }
              }
            });
          }
          this.updateItemsOnVote({
            id: this.product.id,
            likes: this.likes,
            dislikes: this.dislikes,
            productTitle: this.product.productTitle,
            productDescription: this.product.productDescription,
            productPrice: this.product.productPrice,
            timestamp: this.product.timestamp
          });
          this.$store.dispatch("categories/likeProduct", {
            listId: this.listId,
            userId: user.uid,
            productId: this.product.id,
            likes: this.likes,
            removeDislike: {
              disliked: false,
              args: {}
            }
          });
        } else {
          window.location.pathname = "/login";
        }
      });
    },
    async dislikeProduct() {
      await auth.onAuthStateChanged(user => {
        if (user) {
          this.setDislikes(this.dislikes + 1);
          this.setDisliked(true);
          if (this.liked === true) {
            this.setLikes(this.likes - 1);
            this.setLiked(false);

            this.updateItemsOnVote({
              id: this.product.id,
              likes: this.likes,
              dislikes: this.dislikes,
              productTitle: this.product.productTitle,
              productDescription: this.product.productDescription,
              productPrice: this.product.productPrice,
              timestamp: this.product.timestamp
            });

            const foundLike = this.userLikes.find(like => {
              return (
                like.productId === this.product.id &&
                like.listId === this.listId
              );
            });

            return this.$store.dispatch("categories/dislikeProduct", {
              listId: this.listId,
              userId: user.uid,
              productId: this.product.id,
              dislikes: this.dislikes,
              removeLike: {
                liked: true,
                args: {
                  likeId: foundLike.id,
                  likes: this.likes
                }
              }
            });
          }
          this.updateItemsOnVote({
            id: this.product.id,
            likes: this.likes,
            dislikes: this.dislikes,
            productTitle: this.product.productTitle,
            productDescription: this.product.productDescription,
            productPrice: this.product.productPrice,
            timestamp: this.product.timestamp
          });
          this.$store.dispatch("categories/dislikeProduct", {
            listId: this.listId,
            userId: user.uid,
            productId: this.product.id,
            dislikes: this.dislikes,
            removeLike: {
              liked: false,
              args: {}
            }
          });
        } else {
          window.location.pathname = "/login";
        }
      });
    },
    async removeLike() {
      this.setLikes(this.likes - 1);
      this.setLiked(false);
      this.updateItemsOnVote({
        id: this.product.id,
        likes: this.likes,
        dislikes: this.dislikes,
        productTitle: this.product.productTitle,
        productDescription: this.product.productDescription,
        productPrice: this.product.productPrice,
        timestamp: this.product.timestamp
      });

      await auth.onAuthStateChanged(user => {
        if (user) {
          const foundLike = this.userLikes.find(like => {
            return (
              like.productId === this.product.id && like.listId === this.listId
            );
          });

          this.$store.dispatch("categories/removeLike", {
            likeId: foundLike.id,
            listId: this.listId,
            productId: this.product.id,
            likes: this.likes
          });
        }
      });
    },
    async removeDislike() {
      this.setDislikes(this.dislikes - 1);
      this.setDisliked(false);
      this.updateItemsOnVote({
        id: this.product.id,
        likes: this.likes,
        dislikes: this.dislikes,
        productTitle: this.product.productTitle,
        productDescription: this.product.productDescription,
        productPrice: this.product.productPrice,
        timestamp: this.product.timestamp
      });

      await auth.onAuthStateChanged(user => {
        if (user) {
          const foundDislike = this.userDislikes.find(dislike => {
            return (
              dislike.productId === this.product.id &&
              dislike.listId === this.listId
            );
          });

          this.$store.dispatch("categories/removeDislike", {
            dislikeId: foundDislike.id,
            listId: this.listId,
            productId: this.product.id,
            dislikes: this.dislikes
          });
        }
      });
    },
    addToMentions() {
      this.addMention(this.product.productTitle, this.product.id);
    }
  }
};
</script> 

<style>
.w-full {
  width: 100%;
}
</style>
