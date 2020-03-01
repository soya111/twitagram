<template>
  <div class="home">
    <ChatBoard />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import ChatBoard from "@/components/ChatBoard.vue";
// import Signup from "@/components/Signup.vue";
// import Signin from "@/components/Signin.vue";
// import Signout from "@/components/Signout.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld
    ChatBoard
    // Signup,
    // Signin,
    // Signout
  }
};
</script>
