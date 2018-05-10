<template>
  <nav id="sidebar">
    <!-- Sidebar Header-->
    <div class="sidebar-header d-flex align-items-center">
      <div class="avatar">
        <img src="data:image/png;base64,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" alt="..." class="img-fluid rounded-circle">
      </div>
      <div class="title">
        <h1 class="h5">Administrator</h1>
        <p>Admin</p>
      </div>
    </div>
    <!-- Sidebar Navidation Menus-->
    <span class="heading">SALES</span>
    <ul class="list-unstyled">
      <nuxt-link tag="li" active-class="active" to="/orders">
        <a><i class="material-icons">room_service</i>Orders</a>
      </nuxt-link>
    </ul>
    <span class="heading">PURCHASES</span>
    <ul class="list-unstyled">
      <nuxt-link tag="li" active-class="active" to="/stocks">
        <a><i class="material-icons">shopping_cart</i>Purchases</a>
      </nuxt-link>
      <nuxt-link tag="li" active-class="active" to="/inventory">
        <a><i class="material-icons">pie_chart_outlined</i>Inventory</a>
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
