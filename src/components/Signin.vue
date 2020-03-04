<template>
  <v-container fluid>
    <v-row justify="center">
      <v-snackbar v-model="alert.isDisplay" top absolute :color="alert.type">{{ alert.message }}</v-snackbar>
      <v-col cols="12" sm="10" md="8" lg="6">
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
            <v-btn color="blue darken-1" text @click="signIn">ログイン</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Signin",
  data: () => ({
    username: "sample@s.com",
    password: "123456",
    alert: {
      isDisplay: false,
      type: "",
      message: ""
    }
  }),
  methods: {
    signIn() {
      this.alert.isDisplay = false;

      if (!this.username || !this.password) {
        this.alert = {
          isDisplay: true,
          type: "error",
          message: "全て入力してください。"
        };
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(this.username, this.password)
        .then(() => {
          this.alert = {
            isDisplay: true,
            type: "success",
            message: "ログインしました。"
          };
          this.username = this.password = "";
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        })
        .catch(error => {
          this.alert = {
            isDisplay: true,
            type: "error"
          };
          switch (error.message) {
            case "The email address is badly formatted.":
              this.alert.message = "正しいメールアドレスを入力してください。";
              break;
            case "The password is invalid or the user does not have a password.":
            case "There is no user record corresponding to this identifier. The user may have been deleted.":
              this.alert.message =
                "メールアドレスかパスワードが間違っています。";
              break;
            case "The user account has been disabled by an administrator.":
              this.alert.message =
                "このアカウントは管理者によって凍結されました。";
              this.alert.type = "warning";
              break;
            case "A network error (such as timeout, interrupted connection or unreachable host) has occurred.":
              this.alert.message = "ネットワークエラーが発生しました。";
              break;
            case "Too many unsuccessful login attempts. Please try again later.":
              this.alert.message =
                "一定時間内のログイン試行回数が上限に達したため、しばらく時間がたってからもう一度試してください。";
              break;
            default:
              this.alert.message = error.message;
          }
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
