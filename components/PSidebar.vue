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
    <span class="heading">Main</span>
    <ul class="list-unstyled">
      <li>
        <a href="#">
          <i class="icon-bill"></i>Orders </a>
      </li>
      <li class="active">
        <a href="#">
          <i class="icon-list-1"></i>Products </a>
      </li>
    </ul>
    <span class="heading">Inventory</span>
    <ul class="list-unstyled">
      <li>
        <a href="#">
          <i class="icon-flask"></i>Ingredients </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      userName: "<user name>",
      role: "<role>"
    }
  }
}
</script>
