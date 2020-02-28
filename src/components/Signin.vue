<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="signedOut" class="ma-2" color="green" dark v-on="on">ログイン</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">ログイン</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
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
          <v-btn color="blue darken-1" text @click="signIn">ログイン</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signin",
  data: () => ({
    username: "",
    password: "",
    dialog: false,
    signedOut: !firebase.auth().currentUser
  }),
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(user => {
          alert("Sign in: ", user.email);
          this.username = this.password = "";
          //   this.signedOut = false;
        })
        .catch(error => {
          alert(error.message);
        });
      this.dialog = false;
    }
  }
  //   ,
  //   created() {
  //     firebase.auth().onAuthStateChanged(user => {
  //       this.signedOut = !user;
  //     });
  //   }
};
</script>