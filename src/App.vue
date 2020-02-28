<template>
  <v-app>
    <v-container>
      <Signup />
      <Signin />
      <Signout />
      <ChatBoard />
      <ChatForm />
    </v-container>
  </v-app>
</template>

<script>
import ChatBoard from "./components/ChatBoard";
import ChatForm from "./components/Form";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Signout from "./components/Signout";

export default {
  name: "App",

  components: {
    ChatBoard,
    ChatForm,
    Signup,
    Signin,
    Signout
  }
};
</script>
