<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-list v-if="comments" class transition="fade-transition">
          <template v-for="(comment) in comments">
            <Comment :key="comment.id" :comment="comment" />
          </template>
          <v-btn loading color="transparent" depressed block height="100"></v-btn>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import Vue from "vue";
import { db } from "../plugins/firebase";
import Comment from "@/components/Comment.vue";
export default {
  name: "ChatBoard",
  components: {
    Comment
  },
  data: () => ({
    comments: [],
    currentUser: null,
    avatar: "",
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    },
    messages: true,
    dialog: false,
    newDisplayName: ""
  }),
  firestore() {
    // let collection = db.collection("comments");
    let comments = db.collection("comments").orderBy("createdAt", "desc");
    // console.log(collection);
    return {
      // firestoreのcommentsコレクションを参照
      // comments: db.collection("comments").orderBy("likes")
      comments: comments
      // collection: collection
    };
  },
  methods: {
    fetchData() {
      let self = this;
      let userUid = this.$route.params.uid;
      db.collection("usersCollection")
        .doc(userUid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            // console.log(self.avatar);
            // console.log(doc.data());
            self.userData = doc.data();
          } else {
            // doc.data() will be undefined in this case
            alert("No such document!");
          }
        })
        .catch(function(error) {
          alert("Error getting documents: " + error);
        });
    }
  }
};
</script>
