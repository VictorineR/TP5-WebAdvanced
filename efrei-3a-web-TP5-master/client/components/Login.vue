<template>
  <div>
    <div class="col">
        <div class="hide-md-lg">
          <p>Or sign in manually:</p>
        </div>
        <input type="text" name="mail" placeholder="Email" v-model="userEmail" required>
        <input type="password" name="password" placeholder="Password" v-model="userPassword" required>
        <input type="submit" value="Login" @click="loginUser(userEmail, userPassword)">
      </div>

      user: {{userEmail}} mdp: {{userPassword}}
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object },
  },
  data() {
    return {
        userEmail: "",
        userPassword: "",
    };
  },
  async mounted() {
  },
  methods: {
      loginUser(userEmail, userPassword) {
      this.$emit("login-user", userEmail, userPassword);
    },
  },
};
</script>