<template>
  <v-footer fixed>
    <v-text-field
      class="mt-1 mb-n5"
      v-model="message"
      :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
      :prepend-icon="icon"
      required
      dense
      outlined
      light
      single-line
      clear-icon="mdi-close-circle"
      clearable
      label="Message"
      type="text"
      @click:append-outer="sendMessage"
      @click:prepend="changeIcon"
      @click:clear="clearMessage"
    ></v-text-field>
  </v-footer>
</template>

<script>
import { db } from "../plugins/firebase";
import firebase from "firebase";

export default {
  name: "CreateForm",
  data: () => ({
    commentRules: [v => !!v || "コメントは必須項目です"],
    // Formダイアログの表示可否
    show: false,
    message: "Hey!",
    marker: true,
    iconIndex: 0,
    icons: [
      "mdi-emoticon",
      "mdi-emoticon-cool",
      "mdi-emoticon-dead",
      "mdi-emoticon-excited",
      "mdi-emoticon-happy",
      "mdi-emoticon-neutral",
      "mdi-emoticon-sad",
      "mdi-emoticon-tongue"
    ]
  }),
  methods: {
    // コメント追加
    addComment() {
      if (this.message == "") return;
      const now = new Date();
      let user = firebase.auth().currentUser;
      // コメントをFirestoreへ登録
      db.collection("comments").add({
        tweeterUid: user.uid,
        content: this.message,
        avatar: user.photoURL,
        likes: 0,
        createdAt: now
      });
    },
    toggleMarker() {
      this.marker = !this.marker;
    },
    sendMessage() {
      this.addComment();
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    }
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    }
  }
};
</script>
