<template>
  <div>
    <div class="page-header">
      <div class="container-fluid" style="display: inline-block;">
        <h2 class="float-left h5 no-margin-bottom">{{ title }}</h2>
        <button class="h5 transparent-button float-right no-margin-bottom" @click="completeOrder()">Go to pay: ${{ total }}</button>
      </div>
    </div>
    <section>
      <div class="container-fluid">
        <div class="row">
          <button v-for="product in products" :key="product.id" class="col-lg-2 transparent-button" @click="selectProduct(product)" data-toggle="modal" data-target="#productModal">
            <div class="block margin-bottom-sm">
              <div class="title">{{ product.name }}</div>
            </div>
          </button>
        </div>
      </div>
       <!-- Modal-->
      <div id="productModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <strong class="modal-title">Add {{ product.name }} to the Check</strong>
              <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
            </div>
            <form @submit.prevent="closeModal()">
              <div class="modal-body">
                <div class="form-group">
                  <label>Quantity</label>
                  <input v-model="product.quantity" type="number" placeholder="1" min="1" class="form-control" required>
                </div>
                <div>
                  <div class="col-md-6" style="display: inline-block;">
                    <button type="button" @click="decreaseCurrentProduct()" class="transparent-button center-button material-icons">remove_circle_outline</button>
                    <p class="small-text">Remove</p>
                  </div>
                  <div class="col-md-6" style="display: inline-block;">
                    <button type="button" @click="addCurrentProduct()" class="transparent-button center-button material-icons">add_circle_outline</button>
                    <p class="small-text">Add</p>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <div class="col-md-12" style="display: inline-block;">
                  <button type="submit" @click="addProduct()" class="transparent-button center-button material-icons">send</button>
                  <p class="small-text">Send to Check</p>
                </div>
              </div>
            </form>
            <div class="modal-footer">
              <button type="button" @click="closeModal()" class="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      </div>
      <!-- End Modal Form-->
    </section>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price per unit</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Actions</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in productsInCheck" :key="product.key">
                      <td>{{ product.name }}</td>
                      <td>${{ product.price }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>${{ (+(product.quantity * product.price)).toFixed(2) }}</td>
                      <td>
                        <button type="button" @click="selectProduct(product)" class="transparent-button material-icons" data-toggle="modal" data-target="#productModal">remove_circle_outline</button>
                        <button type="button" @click="decreaseProduct(product.id)" class="transparent-button material-icons">add_circle_outline</button>
                      </td>
                      <td>
                        <button type="button" class="transparent-button material-icons">delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        product: {
          name: "",
          quantity: 1
        },
        productsInCheck: [],
        total: 0,
        title: `Order #${this.$route.params.id}`
      }
    },
    mounted() {
      this.getProducts()
      this.getOrder()
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
      },

      getOrder() {
        axios.get(process.env.apiUrl + '/orderProduct/order/' + this.$route.params.id)
          .then(order => {
            order.data.forEach(result => {
              this.addToCheck(result.product, result.quantity)
            })
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectProduct(product) {
        if (product.quantity) {
          this.product.quantity = product.quantity
        }
        this.product.name = product.name
        this.product.productId = product.id
      },

      addProduct() {
        if (this.product.quantity)
        axios.post(process.env.apiUrl + '/orderProduct/' + this.$route.params.id, this.product)
          .then(result => {
            this.addToCheck(result.data.product, result.data.quantity)
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      addToCheck(newProduct, quantity) {
        let price = quantity * parseFloat(newProduct.price)
        this.total = (+(parseFloat(this.total) + price)).toFixed(2)

        let productAlreadyInCheck = false
        this.productsInCheck.forEach(product => {
          if (product.id === newProduct.id) {
            product.quantity = product.quantity + quantity
            productAlreadyInCheck = true
          }
        })

        if (!productAlreadyInCheck) {
          newProduct.quantity = quantity
          this.productsInCheck.push(newProduct)
        }
      },

      completeOrder() {
        axios.put(process.env.apiUrl + '/orders/complete/' + this.$route.params.id)
          .then(result => {
            this.$router.push('/orders')
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      addCurrentProduct() {
        this.product.quantity++;
      },

      decreaseCurrentProduct() {
        if (this.product.quantity > 1) {
          this.product.quantity--;
        }
      },

      closeModal() {
        this.product = {
          name: "",
          quantity: 1
        }
        $('#productModal').modal('hide');
      }
    }
  }
</script>

<style>
.small-text {
  display: block;
  text-align: center;
  font-size: .8em;
}

.center-button {
  height:20px;
  width:100px;
  margin: -20px -50px;
  position:relative;
  top:50%;
  left:50%;
  font-size: 2em;
  margin-top: .3em;
}
</style>
