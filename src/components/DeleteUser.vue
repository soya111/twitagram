<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">アカウント削除</v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">アカウントを削除しますか?</v-card-title>
        <v-card-text
          >このアカウントに関するデータは完全に消去され、元に戻せなくなります。</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false"
            >戻る</v-btn
          >
          <v-btn color="green darken-1" text @click="deleteUser"
            >削除する</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

export default {
  name: "DeleteUser",
  data: () => {
    return { dialog: false };
  },

  methods: {
    deleteUser() {
      let user = firebase.auth().currentUser;
      user
        .delete()
        .then(() => {
          db.collection("usersCollection")
            .doc(user.uid)
            .delete()
            .then(function() {
              alert("Document successfully deleted!");
            })
            .catch(function(error) {
              alert("Error removing document: ", error);
            });
        })
        .catch(error => {
          alert(error);
        });
    }
  }
};
</script>
