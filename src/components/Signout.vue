<template>
  <div class="text-center">
    <v-btn class="ma-2" outlined color="indigo" @click="signOut">ログアウト</v-btn>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signout",
  data: () => {
    return {};
  },
  methods: {
    signOut() {
      var user = firebase.auth().currentUser;
      if (user != null) {
        firebase
          .auth()
          .signOut()
          .then(() => {
            alert("ログアウトしました。");
          })
          .catch(error => {
            alert(error.message);
          });
      }
    }
  }
};
</script>