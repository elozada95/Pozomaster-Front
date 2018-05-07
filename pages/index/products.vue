<template>
  <div>
    <content-header title="Products"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Products</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#productModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product.id">
                      <td>{{ product.id }}</td>
                      <td>{{ product.name }}</td>
                      <td>{{ product.price }}</td>
                      <td>{{ product.category.name }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectProduct(product.id)" data-toggle="modal" data-target="#productModal" class="transparent-button material-icons">edit</button>
                        &nbsp;
                        <button type="button" @click="deleteProduct(product.id)" class="transparent-button material-icons">delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Modal-->
          <div id="productModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
            <div role="document" class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <strong class="modal-title" v-if="!isEditModal">New Product</strong>
                  <strong class="modal-title" v-else>Update Product</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new product.</p>
                  <p v-else>Update the product.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Name</label>
                      <input v-model="product.name" type="text" placeholder="Name" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label>Price</label>
                      <input type="number" step="0.01" v-model="product.price" placeholder="Price" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label class="form-control-label">Category</label>
                      <select name="categories" class="form-control" v-model="product.categoryId" required>
                        <option disabled value="">Please select one</option>
                        <option v-for="category in categories" :key="category.id" v-bind:value="category.id">{{ category.name }}</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <input v-if="!isEditModal" type="submit" value="Create" class="btn btn-primary">
                      <input v-else type="submit" value="Update" class="btn btn-primary">
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" @click="closeModal()" class="btn btn-secondary">Close</button>
                </div>
              </div>
            </div>
          </div>
          <!-- End Modal Form-->
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  import ContentHeader from '~/components/ContentHeader.vue'
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
          categoryId: ""
        },
        categories: [],
        isEditModal: true,
      }
    },
    mounted() {
      this.getProducts()
      this.getCategories()
    },
    methods: {
      getProducts() {
        axios.get(process.env.apiUrl + "/products")
          .then(products => {
            this.products = products.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      createProduct() {
        axios.post(process.env.apiUrl + "/products", this.product)
          .then(product => {
            product.data.category = {}
            product.data.category.name = ""
            this.categories.forEach(category => {
              if (category.id === product.data.categoryId) {
                product.data.category.name = category.name
              }
            });
            this.products.push(product.data)
            this.closeModal()
            alertHandling.success("Your new product was created")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectProduct(productId) {
        axios.get(process.env.apiUrl + "/products/" + productId)
          .then(product => {
            this.product = {}
            this.product = product.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateProduct() {
        axios.put(process.env.apiUrl + "/products/" + this.product.id, this.product)
          .then(product => {
            for (let i = 0; i < this.products.length; i++) {
              if (this.products[i].id === product.data.id) {
                this.products[i] = product.data
              }
            }
            this.closeModal()
            alertHandling.success("Your product was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteProduct(productId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this product?", function() {
          axios.delete(process.env.apiUrl + "/products/" + productId)
            .then(response => {
              for (let i = 0; i < that.products.length; i++) {
                if (that.products[i].id === productId) {
                  that.products.splice(i, 1)
                  alertHandling.success("Your product was removed")
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

      getCategories() {
        axios.get(process.env.apiUrl + "/categories")
          .then(categories => {
            this.categories = categories.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      submitAction() {
        if (!this.isEditModal) {
          this.createProduct()
        }
        else {
          this.updateProduct()
        }
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.product = {}
        $('#productModal').modal('hide');
      }
    }
  }
</script>
