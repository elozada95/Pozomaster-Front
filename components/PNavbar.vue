<template>
  <header class="header">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <div class="navbar-header">
          <!-- Navbar Header-->
          <nuxt-link class="navbar-brand" to="/">
            <div class="brand-text brand-big visible text-uppercase">
              <strong class="text-primary">Pozo</strong>
              <strong>Master</strong>
            </div>
            <div class="brand-text brand-sm">
              <strong class="text-primary">P</strong>
              <strong>M</strong>
            </div>
          </nuxt-link>
          <!-- Sidebar Toggle Btn-->
          <button class="sidebar-toggle">
            <i class="fa fa-long-arrow-left"></i>
          </button>
        </div>
        <!-- Log out               -->
        <div class="list-inline-item logout">
          <a id="logout" href="#" class="nav-link">Logout
            <i class="icon-logout"></i>
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
export default {
}
</script>
