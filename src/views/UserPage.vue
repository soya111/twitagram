<template>
  <div>
    <v-btn class="mx-2 d-flex d-sm-none" fab dark fixed small color="transparent" @click="goBack">
      <v-icon dark color="teal lighten-2">mdi-arrow-left</v-icon>
    </v-btn>
    <v-card v-if="this.userData" class="mx-auto" max-width="434" tile>
      <v-img
        height="100%"
        src="https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg"
      >
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pa-0" cols="12">
            <v-avatar class="profile" color="grey" size="164" tile>
              <v-img :src="this.userData.photoURL"></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title">{{userData.displayName}}</v-list-item-title>
                <v-list-item-subtitle>{{ uid }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
    <CommentsList :uid="this.uid" />
  </div>
</template>

<script>
import { db } from "../plugins/firebase";
import CommentsList from "@/components/CommentsList.vue";

// import firebase from "firebase";

export default {
  name: "UserPage",
  components: {
    CommentsList,
  },
  data: () => ({
    userData: null,
    comments: [],
    image: null,
  }),
  props: {
    uid: String,
  },
  // firestore() {
  //   console.log(this.uid);
  // },
  created() {
    this.fetchData();
    // this.storage();
  },
  methods: {
    fetchData() {
      let self = this;
      let userUid = this.$route.params.uid;
      db.collection("usersCollection")
        .doc(userUid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            // console.log(self.avatar);
            // console.log(doc.data());
            self.userData = doc.data();
          } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
          }
        })
        .catch(function (error) {
          alert("Error getting documents: " + error);
        });
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    // storage() {
    //   let storageRef = storage.ref();
    //   let imagesRef = storageRef.child("IMG_0014.JPG");
    //   console.log(imagesRef);
    // }
  },
};
</script>
