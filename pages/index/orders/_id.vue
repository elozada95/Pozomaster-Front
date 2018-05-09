<template>
  <div>
    <div class="page-header">
      <div class="container-fluid" style="display: inline-block;">
        <h2 class="float-left h5 no-margin-bottom">{{ title }}</h2>
        <button class="h5 transparent-button float-right no-margin-bottom" data-toggle="modal" data-target="#orderModal">Go to pay: ${{ total }}</button>
      </div>
    </div>
    <!-- Modal for complete check -->
      <div id="orderModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <strong class="modal-title">Total to pay: ${{ total }}</strong>
              <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
            </div>
            <form @submit.prevent="closeModal()">
              <div class="modal-body">
                <div class="form-group">
                  <label>Amount received:</label>
                  <input v-model="amountReceived" type="number" placeholder="$0.0" class="form-control" min="0" required>
                </div>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>Change:</label>
                  <input type="number" placeholder="$0.0" min="0" :value="amountReceived - total" class="form-control" disabled>
                </div>
              </div>
              <div class="modal-footer">
                <div class="col-md-12" style="display: inline-block;">
                  <button type="submit" @click="completeOrder()" class="transparent-button center-button material-icons">check</button>
                  <p class="small-text">Complete Order</p>
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
    <section>
      <div class="container-fluid">
        <div class="row">
          <button v-for="product in products" :key="product.id" class="col-lg-2 transparent-button" @click="selectProduct(product, false)" data-toggle="modal" data-target="#productModal">
            <div class="block margin-bottom-sm">
              <div class="title">{{ product.name }}</div>
            </div>
          </button>
        </div>
      </div>
       <!-- Modal for alter the products in check-->
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
                  <button type="submit" v-if="!isUpdate" @click="addProduct()" class="transparent-button center-button material-icons">send</button>
                  <button type="submit" v-else @click="updateProduct()" class="transparent-button center-button material-icons">send</button>
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
                      <th>Edit</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in productsInCheck" :key="product.id">
                      <td>{{ product.name }}</td>
                      <td>${{ product.price }}</td>
                      <td>{{ product.quantity }}</td>
                      <td>${{ (+(product.quantity * product.price)).toFixed(2) }}</td>
                      <td>
                        <button type="button" @click="selectProduct(product, true)" class="transparent-button material-icons" data-toggle="modal" data-target="#productModal">edit</button>
                      </td>
                      <td>
                        <button type="button" @click="deleteProduct(product.id)" class="transparent-button material-icons">delete</button>
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
  import { ENGINE_METHOD_DIGESTS } from 'constants';
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
        title: `Order #${this.$route.params.id}`,
        isUpdate: false,
        amountReceived: ""
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

      selectProduct(product, isUpdatingProduct) {
        this.isUpdate = isUpdatingProduct
        if (product.quantity) {
          this.product.quantity = product.quantity
        }
        this.product.name = product.name
        this.product.productId = product.id
      },

      addProduct() {
        axios.post(process.env.apiUrl + '/orderProduct/order/' + this.$route.params.id, this.product)
          .then(result => {
            this.addToCheck(result.data.product, result.data.quantity)
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateProduct() {
        axios.put(process.env.apiUrl + '/orderProduct/order/' + this.$route.params.id, this.product)
          .then(result => {
            this.addToCheck(result.data.product, result.data.quantity)
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteProduct(productId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this product in the check?", function() {
          axios.delete(process.env.apiUrl + '/orderProduct/order/' + that.$route.params.id + '/product/' + productId)
            .then(response => {
              for (let i = 0; i < that.productsInCheck.length; i++) {
                if (that.productsInCheck[i].id === productId) {
                  that.productsInCheck.splice(i, 1)
                  alertHandling.success("Your product was removed from the check")
                  break;
                }
              }
            })
            .catch(err => {
              alertHandling.error(err.response.data.message)
              that.errors.push(err)
            })
        })
      },

      addToCheck(newProduct, quantity) {
        let productAlreadyInCheck = false
        newProduct.quantity = quantity
        this.productsInCheck.forEach(product => {
          if (product.id === newProduct.id) {
            let substractToTotal = (parseFloat(product.quantity) * parseFloat(product.price))
            this.total = (+(parseFloat(this.total) - substractToTotal)).toFixed(2)
            console.log(substractToTotal)
            product.quantity = newProduct.quantity
            productAlreadyInCheck = true
          }
        })

        if (!productAlreadyInCheck) {
          this.productsInCheck.push(newProduct)
        }

        let price = parseFloat(newProduct.quantity) * parseFloat(newProduct.price)
        this.total = (+(parseFloat(this.total) + price)).toFixed(2)
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
        $('#productModal').modal('hide');
        $('#orderModal').modal('hide');
        this.product = {
          name: "",
          quantity: 1
        }
        this.amountReceived = 0
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
