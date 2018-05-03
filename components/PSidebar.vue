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
    <span class="heading">ORDER</span>
    <ul class="list-unstyled">
      <nuxt-link tag="li" active-class="active" to="/orders">
        <a><i class="material-icons">room_service</i>Orders</a>
      </nuxt-link>
    </ul>
    <span class="heading">MANAGE</span>
    <ul class="list-unstyled">
      <nuxt-link tag="li" active-class="active" to="/categories">
        <a><i class="material-icons">list</i>Categories</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/units">
        <a><i class="material-icons">straighten</i>Units</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/tables">
        <a><i class="material-icons">dashboard</i>Tables</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/ingredients">
        <a><i class="material-icons">kitchen</i>Ingredients</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/products">
        <a><i class="material-icons">local_drink</i>Products</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/stocks">
        <a><i class="material-icons">pie_chart_outlined</i>Stocks</a>
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
