<template>
  <div class="text-center">
    <v-snackbar v-model="alert.isDisplay" top absolute :color="alert.type">{{ alert.message }}</v-snackbar>

    <v-btn class="ma-2" outlined color="teal" @click="signOut">ログアウト</v-btn>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signout",
  data: () => {
    return {
      alert: {
        isDisplay: false,
        type: "",
        message: ""
      }
    };
  },
  methods: {
    signOut() {
      var user = firebase.auth().currentUser;
      if (user != null) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            this.alert = {
              isDisplay: true,
              type: "success",
              message: "ログアウトしました。"
            };
          })
          .catch(error => {
            this.alert = {
              isDisplay: true,
              type: "success",
              message: error.message
            };
          });
      }
    }
  }
};
</script>