<script>
export default {
  data: function () {
    return {
      message: "Welcome to Vue.js!",
      isLoggedIn: !!localStorage.jwt,
    };
  },
  created: function () {
    if (this.isLoggedIn) {
      this.$router.push("/equipment-sets");
    } else {
      this.$router.push("/users/login");
    }
  },
  watch: {
    $route: function () {
      this.isLoggedIn = !!localStorage.jwt;
    },
  },
  methods: {},
};
</script>

<template>
  <div class="home">
    <h1>{{ message }}</h1>
  </div>
</template>
