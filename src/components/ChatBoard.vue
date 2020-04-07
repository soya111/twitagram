<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-list v-if="comments" class transition="fade-transition">
          <template v-for="(comment, index) in comments">
            <v-card
              class="mx-auto mb-2 chatboard-comment"
              :key="index"
              color="teal accent-4"
              dark
              max-width="400"
            >
              <v-card-title class="px-0 py-2">
                <v-list-item>
                  <CommentHeader :uid="comment.tweeterUid" />

                  <v-spacer></v-spacer>

                  <v-menu bottom left transition="scroll-x-transition">
                    <template v-slot:activator="{ on }">
                      <v-btn dark icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list class="py-0">
                      <v-list-item disabled click="deleteComment(comment.id)">
                        <v-list-item-title class="subtile-1">削除</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </v-card-title>

              <v-card-text class="subtitle-1 font-weight-bold mx-2 my-0 py-0">{{comment.content}}</v-card-text>

              <v-card-actions>
                <v-list-item class="grow">
                  <v-list-item-content>
                    <v-list-item-title
                      class="caption text-no-wrap"
                    >{{ comment.createdAt.toDate().toLocaleString() }}</v-list-item-title>
                  </v-list-item-content>

                  <v-row align="center" justify="end">
                    <v-icon class="mr-1" @click="likeComment(comment.id)">mdi-heart</v-icon>
                    <span class="subheading mr-2">{{ comment.likes }}</span>
                  </v-row>
                </v-list-item>
              </v-card-actions>
            </v-card>
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
import firebase from "firebase";
import CommentHeader from "@/components/CommentHeader.vue";
export default {
  name: "ChatBoard",
  components: {
    CommentHeader
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
    deleteComment(id) {
      // if (!confirm("コメントを削除してよろしいですか？")) {
      //   return;
      // }
      db.collection("comments")
        .doc(id)
        .delete();
    },
    likeComment(id) {
      db.collection("comments")
        .doc(id)
        .update({
          likes: firebase.firestore.FieldValue.increment(1)
        });
    },
    returnAvatar(uid) {
      // let avatar;
      db.collection("usersCollection")
        .doc(uid)
        .onSnapshot(doc => {
          // console.log("Current data: ", doc.data());
          console.log(doc.data().photoURL);
          return doc.data().photoURL;
        });
      //   .get()
      //   .then(function(doc) {
      //     if (doc.exists) {
      //       console.log(doc.data().photoURL, "11111111111111");
      //       avatar = doc.data().photoURL;
      //       return doc.data().photoURL;
      //     } else {
      //       // doc.data() will be undefined in this case
      //       alert("No such document!");
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log("Error getting documents: ", error);
      //   });
      // console.log("2222");
      // return avatar;
    },
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
  },
  computed: {}
};
</script>
