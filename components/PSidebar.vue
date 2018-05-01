<template>
  <nav id="sidebar">
    <!-- Sidebar Header-->
    <div class="sidebar-header d-flex align-items-center">
      <div class="avatar">
        <img src="img/avatar-6.jpg" alt="..." class="img-fluid rounded-circle">
      </div>
      <div class="title">
        <h1 class="h5">{{ userName }}</h1>
        <p>{{ role }}</p>
      </div>
    </div>
    <!-- Sidebar Navidation Menus-->
    <span class="heading">CRUD</span>
    <ul class="list-unstyled">
      <nuxt-link tag="li" active-class="active" to="/categories">
        <a><i class="icon-list-1"></i>Categories</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/units">
        <a><i class="icon-list-1"></i>Units</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/ingredients">
        <a><i class="icon-list-1"></i>Ingredients</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/products">
        <a><i class="icon-list-1"></i>Products</a>
      </nuxt-link>
    </ul>
  </nav>
</template>

<script>
  export default {
    data() {
      return {
        userName: "<user name>",
        role: "<role>"
      };
    }
  };
</script>
