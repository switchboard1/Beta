// @/store/categories.js

import { auth, db } from "@/plugins/firebase";
import * as firebase from "firebase/app";

export const state = () => ({
  isSuccess: false,
  successMsg: "",
  likes: [],
  dislikes: [],
  dataLoading: true,
  data: [],
  filteredData: [],
  noResult: false,
  collections: [],
  filteredCollections: [],
  products: [],
  filteredProducts: [],
  users: [],
  filteredUsers: [],
  favorites: [],
  noFavorite: false,
  comments: []
});

export const mutations = {
  setIsSuccess(state, value) {
    state.isSuccess = value;
  },
  setSuccessMsg(state, msg) {
    state.successMsg = msg;
  },
  setLikes(state, value) {
    state.likes = value;
  },
  setDislikes(state, value) {
    state.dislikes = value;
  },
  setDataLoading(state, value) {
    state.dataLoading = value;
  },
  setData(state, data) {
    state.data = data;
  },
  setNoResult(state, value) {
    state.noResult = value;
  },
  setFilteredData(state, data) {
    state.filteredData = data;
  },
  setCollections(state, collections) {
    state.collections = collections;
  },
  setFilteredCollections(state, collections) {
    state.filteredCollections = collections;
  },
  setProducts(state, products) {
    state.products = products;
  },
  setFilteredProducts(state, products) {
    state.filteredProducts = products;
  },
  setUsers(state, users) {
    state.users = users;
  },
  setFilteredUsers(state, users) {
    state.filteredUsers = users;
  },
  setFavorites(state, favorites) {
    state.favorites = favorites;
  },
  setNoFavorite(state, value) {
    state.noFavorite = value;
  },
  setComments(state, comments) {
    state.comments = comments;
  }
};

export const actions = {
  async fetchAllData({ commit, dispatch }, favorite) {
    commit("setDataLoading", true);

    let collections = [];
    let products = [];
    let users = [];

    dispatch("fetchComments");

    const collectionSnapshot = await db.collection("item-list").get();
    collectionSnapshot.forEach(collection => {
      collections = [
        {
          id: collection.id,
          categories: collection.data().categories.sort(),
          title: collection.data().title,
          description: collection.data().description,
          userId: collection.data().userId,
          username: collection.data().username,
          items: collection.data().items,
          timestamp: collection.data().timestamp
        },
        ...collections
      ];

      collection.data().items.forEach(product => {
        products = [
          {
            ...product,
            username: collection.data().username,
            userId: collection.data().userId,
            collectionId: collection.id
          },
          ...products
        ];
      });
    });

    await auth.onAuthStateChanged(async user => {
      const userSnapshot = await db.collection("users").get();
      if (user) {
        userSnapshot.forEach(eachUser => {
          if (eachUser.id === user.uid) {
            return;
          } else {
            users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
          }
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        if (favorite === true) {
          dispatch("fetchFavorites", { userId: user.uid, favoritePage: false });
        }
        dispatch("fetchLikes", user.uid);
        dispatch("fetchDislikes", user.uid);
        commit("setDataLoading", false);
      } else {
        userSnapshot.forEach(eachUser => {
          users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        commit("setDataLoading", false);
      }
    });
  },
  async fetchActivity({ commit, dispatch, rootState }, favorite) {
    commit("setDataLoading", true);

    let collections = [];
    let products = [];
    let users = [];

    dispatch("fetchComments");

    const collectionSnapshot = await db.collection("item-list").get();
    collectionSnapshot.forEach(collection => {
      collections = [
        {
          id: collection.id,
          categories: collection.data().categories.sort(),
          title: collection.data().title,
          description: collection.data().description,
          userId: collection.data().userId,
          username: collection.data().username,
          items: collection.data().items,
          timestamp: collection.data().timestamp
        },
        ...collections
      ];

      collection.data().items.forEach(product => {
        products = [
          {
            ...product,
            username: collection.data().username,
            userId: collection.data().userId,
            collectionId: collection.id
          },
          ...products
        ];
      });
    });

    await auth.onAuthStateChanged(async user => {
      const userSnapshot = await db.collection("users").get();
      if (user) {
        userSnapshot.forEach(eachUser => {
          if (eachUser.id === user.uid) {
            return;
          } else {
            users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
          }
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        let filteredData = [];
        if (rootState.auth.following.length > 0) {
          rootState.auth.following.forEach(eachFollowing => {
            const followedUsersData = [...collections, ...products].filter(
              eachData => eachData.userId === eachFollowing.userFollowed
            );
            filteredData = [...followedUsersData, ...filteredData];
          });

          const userCollections = [...collections].filter(
            collection => collection.userId === user.uid
          );
          const userProducts = [...products].filter(
            product => product.userId === user.uid
          );
          filteredData = [...userCollections, ...userProducts, ...filteredData];
        } else {
          filteredData = [...collections, ...products];
        }
        filteredData = filteredData.sort(
          (a, b) => b.timestamp.seconds - a.timestamp.seconds
        );
        if (favorite === true) {
          dispatch("fetchFavorites", { userId: user.uid, favoritePage: false });
        }
        dispatch("fetchLikes", user.uid);
        dispatch("fetchDislikes", user.uid);
        commit("setFilteredData", filteredData);
        commit("setDataLoading", false);
      } else {
        userSnapshot.forEach(eachUser => {
          users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        const filteredData = [...collections, ...products].sort(
          (a, b) => b.timestamp.seconds - a.timestamp.seconds
        );
        commit("setFilteredData", filteredData);
        commit("setDataLoading", false);
      }
    });
  },
  filterByStateAndSearch({ commit, state }, { search, tag }) {
    let filteredData = [];
    let collections = [];
    let products = [];
    let users = [];

    if (tag === "All") {
      filteredData = [...state.data];
      filteredData = filteredData.filter(item => {
        if (item.title) {
          return item.title.toLowerCase().includes(search.toLowerCase());
        } else if (item.productTitle) {
          return item.productTitle.toLowerCase().includes(search.toLowerCase());
        } else if (item.firstname) {
          const fullname = `${item.firstname} ${item.lastname}`;

          return (
            item.firstname.toLowerCase().includes(search.toLowerCase()) ||
            item.lastname.toLowerCase().includes(search.toLowerCase()) ||
            fullname.toLowerCase().includes(search.toLowerCase()) ||
            item.username.toLowerCase().includes(search.toLowerCase())
          );
        }
      });
      collections = filteredData.filter(data => {
        if (data.title) {
          return data;
        }
      });
      products = filteredData.filter(data => {
        if (data.productTitle) {
          return data;
        }
      });
      users = filteredData.filter(data => {
        if (data.firstname) {
          return data;
        }
      });
    } else {
      filteredData = state.data.filter(item => {
        if (item.categories && item.categories.includes(tag)) {
          return item.title.toLowerCase().includes(search.toLowerCase());
        } else if (item.states && item.states.includes(tag)) {
          const fullname = `${item.firstname} ${item.lastname}`;
          return (
            item.firstname.toLowerCase().includes(search.toLowerCase()) ||
            item.lastname.toLowerCase().includes(search.toLowerCase()) ||
            fullname.toLowerCase().includes(search.toLowerCase())
          );
        } else {
          return;
        }
      });
      collections = filteredData.filter(data => {
        if (data.title) {
          return data;
        }
      });
      products = filteredData.filter(data => {
        if (data.productTitle) {
          return data;
        }
      });
      users = filteredData.filter(data => {
        if (data.firstname) {
          return data;
        }
      });
    }
    if (filteredData.length === 0) {
      commit("setNoResult", true);
    } else {
      commit("setNoResult", false);
    }
    commit("setFilteredData", filteredData);
    commit("setFilteredCollections", collections);
    commit("setFilteredProducts", products);
    commit("setFilteredUsers", users);
  },
  async addList({ commit, state }, { list, toggleLoading }) {
    await auth.onAuthStateChanged(async function(user) {
      toggleLoading(true);
      if (user) {
        const userFromDB = await db.collection("users").doc(user.uid);
        const userDoc = await userFromDB.get();

        const newList = {
          ...list,
          userId: user.uid,
          username: userDoc.data().username,
          timestamp: firebase.firestore.Timestamp.fromDate(new Date())
        };

        const addedList = await db.collection("item-list").add(newList);

        commit("setCollections", [
          { id: addedList.id, ...newList },
          ...state.collections
        ]);
        commit("setData", [{ id: addedList.id, ...newList }, ...state.data]);
        toggleLoading(false);
        commit("setIsSuccess", true);
        commit("setSuccessMsg", "Your review was successfully posted");
      } else {
        return;
      }
    });
  },
  toggleIsSuccess({ commit }, value) {
    commit("setIsSuccess", value);
  },
  toggleSuccessMsg({ commit }, value) {
    commit("setSuccessMsg", value);
  },
  editItemList({ commit, state }, list) {
    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === list.id;
    });

    const updatedCollection = {
      ...collections[collectionIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === list.id;
    });

    const updatedData = {
      ...data[dataIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === list.id;
    });

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);
  },
  addItemToList({ commit, state }, list) {
    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === list.id;
    });

    const updatedCollection = {
      ...collections[collectionIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === list.id;
    });

    const updatedData = {
      ...data[dataIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === list.id;
    });

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      title: list.title,
      description: list.description,
      timestamp: list.timestamp,
      items: list.items,
      categories: list.categories
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);
  },
  filterSort({ commit, state }, type) {
    commit("setNoResult", false);
    let filteredData = [];
    if (type === "all") {
      filteredData = [
        ...state.filteredCollections,
        ...state.filteredProducts,
        ...state.filteredUsers
      ];
    } else if (type === "collections") {
      filteredData = [...state.filteredCollections];
    } else if (type === "products") {
      filteredData = [...state.filteredProducts];
    } else if (type === "users") {
      filteredData = [...state.filteredUsers];
    } else if (type === "categories") {
      filteredData = [...state.filteredCollections];
      let categories = [];

      filteredData.forEach(data => {
        categories = [...data.categories, ...categories];
      });

      categories = categories.sort();

      filteredData = filteredData.sort(function(a, b) {
        return categories.indexOf(a) - categories.indexOf(b);
      });
    }
    if (filteredData.length === 0) {
      commit("setNoResult", true);
    } else {
      commit("setNoResult", false);
    }
    commit("setFilteredData", filteredData);
  },
  async fetchAllFavorites({ commit, dispatch }, favorite) {
    commit("setDataLoading", true);

    let collections = [];
    let products = [];
    let users = [];

    const collectionSnapshot = await db.collection("item-list").get();
    collectionSnapshot.forEach(collection => {
      collections = [
        {
          id: collection.id,
          categories: collection.data().categories.sort(),
          title: collection.data().title,
          description: collection.data().description,
          userId: collection.data().userId,
          username: collection.data().username,
          items: collection.data().items,
          timestamp: collection.data().timestamp
        },
        ...collections
      ];

      collection.data().items.forEach(product => {
        products = [
          {
            ...product,
            username: collection.data().username,
            userId: collection.data().userId,
            collectionId: collection.id
          },
          ...products
        ];
      });
    });

    await auth.onAuthStateChanged(async user => {
      const userSnapshot = await db.collection("users").get();
      if (user) {
        userSnapshot.forEach(eachUser => {
          if (eachUser.id === user.uid) {
            return;
          } else {
            users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
          }
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        if (favorite === true) {
          dispatch("fetchFavorites", {
            userId: user.uid,
            favoritePage: true
          });
        }
        dispatch("fetchLikes", user.uid);
        dispatch("fetchDislikes", user.uid);
        commit("setDataLoading", false);
      } else {
        userSnapshot.forEach(eachUser => {
          users = [{ id: eachUser.id, ...eachUser.data() }, ...users];
        });
        commit("setCollections", collections);
        commit("setProducts", products);
        commit("setUsers", users);
        commit("setData", [...collections, ...products, ...users]);
        commit("setDataLoading", false);
      }
    });
  },
  async fetchFavorites({ commit, state }, { userId, favoritePage }) {
    let favorites = [];
    const foundFavorites = await db.collection("favorites").get();

    foundFavorites.forEach(favorite => {
      const newFavorite = {
        id: favorite.id,
        ...favorite.data()
      };
      favorites = [newFavorite, ...favorites];
    });

    favorites = favorites.filter(favorite => {
      return favorite.userId === userId;
    });

    favorites.sort((a, b) => {
      return a.timestamp.seconds - b.timestamp.seconds;
    });

    let filteredData = [];

    favorites.forEach(favorite => {
      [...state.collections].forEach(collection => {
        if (favorite.listId === collection.id) {
          filteredData = [collection, ...filteredData];
        }
      });
    });

    commit("setFavorites", favorites);
    if (favoritePage === true) {
      if (filteredData.length === 0) {
        commit("setNoFavorite", true);
      } else {
        commit("setNoFavorite", false);
      }
      commit("setFilteredData", filteredData);
    }
  },
  async addFavorite(
    { commit, state },
    { favorite, toggleFavorite, favoritePage }
  ) {
    const docRef = await db.collection("favorites").add(favorite);

    const favorites = [
      {
        id: docRef.id,
        ...favorite
      },
      ...state.favorites
    ];

    favorites.sort((a, b) => {
      return a.timestamp.seconds - b.timestamp.seconds;
    });

    let filteredData = [];

    favorites.forEach(favorite => {
      [...state.collections].forEach(collection => {
        if (favorite.listId === collection.id) {
          filteredData = [collection, ...filteredData];
        }
      });
    });

    commit("setFavorites", favorites);
    if (favoritePage === true) {
      commit("setNoFavorite", false);
      commit("setFilteredData", filteredData);
    }
    toggleFavorite(true);
  },
  async removeFavorite(
    { commit, state },
    { id, toggleFavorite, favoritePage }
  ) {
    await db
      .collection("favorites")
      .doc(id)
      .delete();

    const favorites = [...state.favorites].filter(favorite => {
      return favorite.id !== id;
    });

    favorites.sort((a, b) => {
      return a.timestamp.seconds - b.timestamp.seconds;
    });

    let filteredData = [];

    favorites.forEach(favorite => {
      [...state.collections].forEach(collection => {
        if (favorite.listId === collection.id) {
          filteredData = [collection, ...filteredData];
        }
      });
    });

    commit("setFavorites", favorites);
    if (favoritePage === true) {
      if (filteredData.length === 0) {
        commit("setNoFavorite", true);
      } else {
        commit("setNoFavorite", false);
      }
      commit("setFilteredData", filteredData);
    }
    toggleFavorite(false);
  },
  filterFavorites({ commit, state }, filterType) {
    let favorites = [...state.favorites];

    let filteredData = [];

    commit("setNoResult", false);
    if (filterType === "newest") {
      favorites = favorites.sort((a, b) => {
        return a.timestamp.seconds - b.timestamp.seconds;
      });
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });
      return commit("setFilteredData", filteredData);
    }
    if (filterType === "newest-descending") {
      favorites = favorites.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
      });
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });
      return commit("setFilteredData", filteredData);
    }
    if (filterType === "created") {
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });
      filteredData = filteredData.sort((a, b) => {
        return b.timestamp.seconds - a.timestamp.seconds;
      });
      return commit("setFilteredData", filteredData);
    }
    if (filterType === "created-descending") {
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });
      filteredData = filteredData.sort((a, b) => {
        return a.timestamp.seconds - b.timestamp.seconds;
      });
      return commit("setFilteredData", filteredData);
    }
    if (filterType === "category") {
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });

      filteredData.sort((a, b) => {
        if (b.categories[0] > a.categories[0]) {
          return -1;
        }
      });
      return commit("setFilteredData", filteredData);
    }
    if (filterType === "category-descending") {
      favorites.forEach(favorite => {
        [...state.collections].forEach(collection => {
          if (favorite.listId === collection.id) {
            filteredData = [collection, ...filteredData];
          }
        });
      });

      filteredData.sort((a, b) => {
        if (b.categories[0] < a.categories[0]) {
          return 1;
        }
      });
      return commit("setFilteredData", filteredData);
    }
  },
  async fetchLikes({ commit }, userId) {
    let likes = [];

    const foundLikes = await db.collection("likes").get();

    foundLikes.forEach(like => {
      const newLike = {
        id: like.id,
        ...like.data()
      };
      likes = [newLike, ...likes];
    });

    likes = likes.filter(like => {
      return like.userId === userId;
    });

    commit("setLikes", likes);
  },
  async fetchDislikes({ commit }, userId) {
    let dislikes = [];

    const foundDislikes = await db.collection("dislikes").get();

    foundDislikes.forEach(dislike => {
      const newDislike = {
        id: dislike.id,
        ...dislike.data()
      };
      dislikes = [newDislike, ...dislikes];
    });

    dislikes = dislikes.filter(dislike => {
      return dislike.userId === userId;
    });

    commit("setDislikes", dislikes);
  },
  async removeLike({ commit, state }, { likeId, listId, productId, likes }) {
    await db
      .collection("likes")
      .doc(likeId)
      .delete();

    commit(
      "setLikes",
      [...state.likes].filter(like => {
        return like.id !== likeId;
      })
    );

    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === listId;
    });

    const collectionItemIndex = collections[collectionIndex].items.findIndex(
      item => {
        return item.id === productId;
      }
    );

    const updatedCollectionItem = {
      ...collections[collectionIndex].items[collectionItemIndex],
      likes: likes
    };

    const updatedCollection = {
      ...collections[collectionIndex],
      items: [
        ...collections[collectionIndex].items.slice(0, collectionItemIndex),
        updatedCollectionItem,
        ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
      ]
    };

    await db
      .collection("item-list")
      .doc(listId)
      .set(
        {
          items: [
            ...collections[collectionIndex].items.slice(0, collectionItemIndex),
            updatedCollectionItem,
            ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
          ]
        },
        { merge: true }
      );

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === listId;
    });

    const dataItemIndex = data[dataIndex].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedDataItem = {
      ...data[dataIndex].items[dataItemIndex],
      likes: likes
    };

    const updatedData = {
      ...data[dataIndex],
      items: [
        ...data[dataIndex].items.slice(0, dataItemIndex),
        updatedDataItem,
        ...data[dataIndex].items.slice(dataItemIndex + 1)
      ]
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === listId;
    });

    const filtereDataItemIndex = filteredData[
      filteredDataIndex
    ].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedFilteredDataItem = {
      ...filteredData[filteredDataIndex].items[filtereDataItemIndex],
      likes: likes
    };

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      items: [
        ...filteredData[filteredDataIndex].items.slice(0, filtereDataItemIndex),
        updatedFilteredDataItem,
        ...filteredData[filteredDataIndex].items.slice(filtereDataItemIndex + 1)
      ]
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);
  },
  async removeDislike(
    { commit, state },
    { dislikeId, listId, productId, dislikes }
  ) {
    await db
      .collection("dislikes")
      .doc(dislikeId)
      .delete();

    commit(
      "setDislikes",
      [...state.dislikes].filter(dislike => {
        return dislike.id !== dislikeId;
      })
    );

    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === listId;
    });

    const collectionItemIndex = collections[collectionIndex].items.findIndex(
      item => {
        return item.id === productId;
      }
    );

    const updatedCollectionItem = {
      ...collections[collectionIndex].items[collectionItemIndex],
      dislikes: dislikes
    };

    const updatedCollection = {
      ...collections[collectionIndex],
      items: [
        ...collections[collectionIndex].items.slice(0, collectionItemIndex),
        updatedCollectionItem,
        ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
      ]
    };

    await db
      .collection("item-list")
      .doc(listId)
      .set(
        {
          items: [
            ...collections[collectionIndex].items.slice(0, collectionItemIndex),
            updatedCollectionItem,
            ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
          ]
        },
        { merge: true }
      );

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === listId;
    });

    const dataItemIndex = data[dataIndex].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedDataItem = {
      ...data[dataIndex].items[dataItemIndex],
      dislikes: dislikes
    };

    const updatedData = {
      ...data[dataIndex],
      items: [
        ...data[dataIndex].items.slice(0, dataItemIndex),
        updatedDataItem,
        ...data[dataIndex].items.slice(dataItemIndex + 1)
      ]
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === listId;
    });

    const filtereDataItemIndex = filteredData[
      filteredDataIndex
    ].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedFilteredDataItem = {
      ...filteredData[filteredDataIndex].items[filtereDataItemIndex],
      dislikes: dislikes
    };

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      items: [
        ...filteredData[filteredDataIndex].items.slice(0, filtereDataItemIndex),
        updatedFilteredDataItem,
        ...filteredData[filteredDataIndex].items.slice(filtereDataItemIndex + 1)
      ]
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);
  },
  async dislikeProduct(
    { commit, state, dispatch },
    { listId, userId, productId, dislikes, removeLike }
  ) {
    const addedDislike = await db.collection("dislikes").add({
      listId,
      productId,
      userId,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    });

    commit("setDislikes", [
      {
        id: addedDislike.id,
        listId,
        productId,
        userId,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
      },
      ...state.dislikes
    ]);

    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === listId;
    });

    const collectionItemIndex = collections[collectionIndex].items.findIndex(
      item => {
        return item.id === productId;
      }
    );

    const updatedCollectionItem = {
      ...collections[collectionIndex].items[collectionItemIndex],
      dislikes: dislikes
    };

    const updatedCollection = {
      ...collections[collectionIndex],
      items: [
        ...collections[collectionIndex].items.slice(0, collectionItemIndex),
        updatedCollectionItem,
        ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
      ]
    };

    await db
      .collection("item-list")
      .doc(listId)
      .set(
        {
          items: [
            ...collections[collectionIndex].items.slice(0, collectionItemIndex),
            updatedCollectionItem,
            ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
          ]
        },
        { merge: true }
      );

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === listId;
    });

    const dataItemIndex = data[dataIndex].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedDataItem = {
      ...data[dataIndex].items[dataItemIndex],
      dislikes: dislikes
    };

    const updatedData = {
      ...data[dataIndex],
      items: [
        ...data[dataIndex].items.slice(0, dataItemIndex),
        updatedDataItem,
        ...data[dataIndex].items.slice(dataItemIndex + 1)
      ]
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === listId;
    });

    const filtereDataItemIndex = filteredData[
      filteredDataIndex
    ].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedFilteredDataItem = {
      ...filteredData[filteredDataIndex].items[filtereDataItemIndex],
      dislikes: dislikes
    };

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      items: [
        ...filteredData[filteredDataIndex].items.slice(0, filtereDataItemIndex),
        updatedFilteredDataItem,
        ...filteredData[filteredDataIndex].items.slice(filtereDataItemIndex + 1)
      ]
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);

    if (removeLike.liked === true) {
      dispatch("removeLike", {
        likeId: removeLike.args.likeId,
        listId,
        productId,
        likes: removeLike.args.likes
      });
    }
  },
  async likeProduct(
    { commit, state, dispatch },
    { listId, userId, productId, likes, removeDislike }
  ) {
    const addedLike = await db.collection("likes").add({
      listId,
      productId,
      userId,
      timestamp: firebase.firestore.Timestamp.fromDate(new Date())
    });

    commit("setLikes", [
      {
        id: addedLike.id,
        listId,
        productId,
        userId,
        timestamp: firebase.firestore.Timestamp.fromDate(new Date())
      },
      ...state.likes
    ]);

    let collections = [...state.collections];

    const collectionIndex = collections.findIndex(collection => {
      return collection.id === listId;
    });

    const collectionItemIndex = collections[collectionIndex].items.findIndex(
      item => {
        return item.id === productId;
      }
    );

    const updatedCollectionItem = {
      ...collections[collectionIndex].items[collectionItemIndex],
      likes: likes
    };

    const updatedCollection = {
      ...collections[collectionIndex],
      items: [
        ...collections[collectionIndex].items.slice(0, collectionItemIndex),
        updatedCollectionItem,
        ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
      ]
    };

    await db
      .collection("item-list")
      .doc(listId)
      .set(
        {
          items: [
            ...collections[collectionIndex].items.slice(0, collectionItemIndex),
            updatedCollectionItem,
            ...collections[collectionIndex].items.slice(collectionItemIndex + 1)
          ]
        },
        { merge: true }
      );

    const updatedCollections = [
      ...collections.slice(0, collectionIndex),
      updatedCollection,
      ...collections.slice(collectionIndex + 1)
    ];

    commit("setCollections", updatedCollections);

    let data = [...state.data];

    const dataIndex = data.findIndex(eachData => {
      return eachData.id === listId;
    });

    const dataItemIndex = data[dataIndex].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedDataItem = {
      ...data[dataIndex].items[dataItemIndex],
      likes: likes
    };

    const updatedData = {
      ...data[dataIndex],
      items: [
        ...data[dataIndex].items.slice(0, dataItemIndex),
        updatedDataItem,
        ...data[dataIndex].items.slice(dataItemIndex + 1)
      ]
    };

    const updatedAllData = [
      ...data.slice(0, dataIndex),
      updatedData,
      ...data.slice(dataIndex + 1)
    ];

    commit("setData", updatedAllData);

    let filteredData = [...state.filteredData];

    const filteredDataIndex = filteredData.findIndex(eachData => {
      return eachData.id === listId;
    });

    const filtereDataItemIndex = filteredData[
      filteredDataIndex
    ].items.findIndex(item => {
      return item.id === productId;
    });

    const updatedFilteredDataItem = {
      ...filteredData[filteredDataIndex].items[filtereDataItemIndex],
      likes: likes
    };

    const updatedFilteredData = {
      ...filteredData[filteredDataIndex],
      items: [
        ...filteredData[filteredDataIndex].items.slice(0, filtereDataItemIndex),
        updatedFilteredDataItem,
        ...filteredData[filteredDataIndex].items.slice(filtereDataItemIndex + 1)
      ]
    };

    const updatedAllFilteredData = [
      ...filteredData.slice(0, filteredDataIndex),
      updatedFilteredData,
      ...filteredData.slice(filteredDataIndex + 1)
    ];

    commit("setFilteredData", updatedAllFilteredData);

    if (removeDislike.disliked === true) {
      dispatch("removeDislike", {
        dislikeId: removeDislike.args.dislikeId,
        listId,
        productId,
        dislikes: removeDislike.args.dislikes
      });
    }
  },
  async fetchComments({ commit }) {
    let comments = [];

    const commentsSnapshot = await db.collection("comments").get();

    commentsSnapshot.forEach(comment => {
      comments = [{ id: comment.id, ...comment.data() }, ...comments];
    });

    commit("setComments", comments);
  },
  async addComment({ commit, state }, newComment) {
    const commentRef = await db.collection("comments").add(newComment);

    commit("setComments", [
      { id: commentRef.id, ...newComment },
      ...state.comments
    ]);
  }
};

export const getters = {
  getIsSuccess(state) {
    return state.isSuccess;
  },
  getSuccessMsg(state) {
    return state.successMsg;
  },
  getLikes(state) {
    return state.likes;
  },
  getDislikes(state) {
    return state.dislikes;
  },
  getDataLoading(state) {
    return state.dataLoading;
  },
  getNoResult(state) {
    return state.noResult;
  },
  getData(state) {
    return state.data;
  },
  getFilteredData(state) {
    return state.filteredData;
  },
  getCollections(state) {
    return state.collections;
  },
  getProducts(state) {
    return state.products;
  },
  getUsers(state) {
    return state.users;
  },
  getFavorites(state) {
    return state.favorites;
  },
  getNoFavorite(state) {
    return state.noFavorite;
  },
  getComments(state) {
    return state.comments;
  }
};
