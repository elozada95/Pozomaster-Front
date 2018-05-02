<template>
  <div>
    <content-header :title="title"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <button v-for="product in products" :key="product.id" class="col-lg-4 transparent-button">
            <div class="block margin-bottom-sm">
              <div class="title">{{ product.name }}</div>
            </div>
          </button>
        </div>
      </div>
    </section>
    <section>
      <!-- <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>

                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div> -->
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  import ContentHeader from '~/components/ContentHeader'
  const alertHandling = require('~/static/js/alert-handling.js')

  export default {
    components: {
      ContentHeader
    },
    data() {
      return {
        errors: [],
        products: [],
        title: `Order #${this.$route.params.id}`
      }
    },
    mounted() {
      this.getProducts()
    },
    methods: {
      getProducts() {
        axios.get(process.env.apiUrl + '/products')
          .then(result => {
            this.products = result.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      }
    }
  }
</script>

<style>

</style>
