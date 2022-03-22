<script>
export default {
  data: function () {
    return {
      isLoggedIn: !!localStorage.jwt,
    };
  },
  watch: {
    $route: function () {
      this.isLoggedIn = !!localStorage.jwt;
    },
  },
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-mdb-toggle="collapse"
        data-mdb-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-bars"></i>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Features</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" v-if="isLoggedIn" to="/equipment-sets">All Equipment Sets</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" v-if="isLoggedIn" to="/equipment-sets/new">Create Equipment Set</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- <div id="nav">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/about">About</router-link>
    |
    <router-link v-if="!isLoggedIn" to="/users/new">Signup</router-link>
    |
    <router-link v-if="!isLoggedIn" to="/users/login">Login</router-link>
    |
    <router-link v-if="isLoggedIn" to="/users/logout">Logout</router-link>
    |
    <router-link v-if="isLoggedIn" to="/users/me">Profile</router-link>
    |
    <router-link v-if="isLoggedIn" to="/equipment-sets">Equipment Sets</router-link>
    |
    <router-link v-if="isLoggedIn" to="/equipment-sets/new">Create Equipment Set</router-link>
    |
    <router-link v-if="isLoggedIn" to="/equipment-sets/compare">Compare Equipment Sets</router-link>
  </div> -->
  <router-view />
</template>

<!-- <style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

</style> -->
<style>
#app {
  width: 100%;
}
</style>
