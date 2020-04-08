<template>
  <div class="mt-2">
    <template v-for="(comment, index) in comments">
      <Comment :key="index" :comment="comment" />
    </template>
  </div>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

import Comment from "@/components/Comment.vue";

export default {
  name: "CommentsList",
  components: {
    Comment
  },
  props: ["uid"],
  data: () => ({ comments: [], avatar: null }),
  firestore() {
    let self = this;
    let comments = db
      .collection("comments")
      .where("tweeterUid", "==", this.uid);
    let avatar;
    db.collection("usersCollection")
      .doc(this.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          // console.log(self.avatar);
          //   console.log(doc.data().photoURL);
          avatar = doc.data().photoURL;
          self.avatar = doc.data().photoURL;
          // self.userData = doc.data();
        } else {
          // doc.data() will be undefined in this case
          alert("No such document!");
        }
      });
    return {
      // firestoreのcommentsコレクションを参照
      // comments: db.collection("comments").orderBy("likes")
      comments: comments,
      avatar: avatar
    };
  },
  methods: {
    deleteComment(id) {
      //   console.log(id);
      if (!confirm("コメントを削除してよろしいですか？")) {
        return;
      }
      db.collection("comments")
        .doc(id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error deleting document: ", error);
        });
    },
    likeComment(id) {
      db.collection("comments")
        .doc(id)
        .update({
          likes: firebase.firestore.FieldValue.increment(1)
        });
    }
  }
};
</script>