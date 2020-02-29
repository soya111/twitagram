<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <v-app>
      <v-container>
        <!-- <Signup /> -->
        <ChatBoard />
        <ChatForm />
      </v-container>
    </v-app>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import ChatBoard from "@/components/ChatBoard.vue";
import ChatForm from "@/components/Form.vue";
// import Signup from "@/components/Signup.vue";
// import Signin from "@/components/Signin.vue";
// import Signout from "@/components/Signout.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
    ChatBoard,
    ChatForm
    // Signup,
    // Signin,
    // Signout
  }
};
</script>
