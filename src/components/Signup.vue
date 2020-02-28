<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn class="ma-2" color="primary" dark v-on="on">ユーザー登録</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">ユーザー登録</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="displayName" label="Nickname" required clearable></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="username" label="Email" required clearable></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                  clearable
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">閉じる</v-btn>
          <v-btn color="blue darken-1" text @click="signUp">登録</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signup",
  data: () => ({
    displayName: "",
    username: "",
    password: "",
    dialog: false
  }),
  methods: {
    signUp() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.username, this.password)
        .then(user => {
          alert("Create account: ", user.email);
          this.username = this.password = "";
          this.registerDisplayName(this.displayName);
        })
        .catch(error => {
          alert(error.message);
        });
      this.dialog = false;
    },
    registerDisplayName(Nickname) {
      var user = firebase.auth().currentUser;
      if (user != null) {
        user
          .updateProfile({
            displayName: Nickname
          })
          .then(() => {
            alert("ニックネームが登録出来ました！" + Nickname);
          })
          .catch(error => {
            alert(error.message);
          });
      }
    }
  }
};
</script>