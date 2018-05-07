<template>
  <div>
    <content-header title="Stocks"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Stocks</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#ingredientModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Ingredient</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="stock in stocks" :key="stock.id">
                      <td>{{ stock.id }}</td>
                      <td>{{ stock.ingredient.name }}</td>
                      <td>{{ stock.quantity }}</td>
                      <div v-for="unit in units" :key="unit.id">
                        <div v-if="stock.ingredient.unitId === unit.id">
                          <td>{{ unit.name }}</td>
                        </div>
                      </div>
                      <td>
                        <button type="button" @click="editModal(true); selectStock(stock.id)" data-toggle="modal" data-target="#ingredientModal" class="transparent-button material-icons">edit</button>
                        &nbsp;
                        <button type="button" @click="deleteStock(stock.id)" class="transparent-button material-icons">delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Modal-->
          <div id="ingredientModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
            <div role="document" class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <strong class="modal-title" v-if="!isEditModal">New Stock</strong>
                  <strong class="modal-title" v-else>Update Stock</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new stock.</p>
                  <p v-else>Update the stock.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Quantity</label>
                      <input v-model="stock.quantity" type="text" placeholder="Quantity" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label class="form-control-label">Ingredient</label>
                      <select name="ingredients" class="form-control" v-model="stock.ingredientId" required>
                        <option disabled value="">Please select one</option>
                        <option v-for="ingredient in ingredients" :key="ingredient.id" v-bind:value="ingredient.id">{{ ingredient.name }}</option>
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
        stocks: [],
        stock: {
          ingredientId: ""
        },
        ingredients: [],
        ingredient: {
          unitId: ""
        },
        units: [],
        isEditModal: true,
      }
    },
    mounted() {
      this.getStocks()
      this.getIngredients()
      this.getUnits()
    },
    methods: {
      getStocks() {
        axios.get(process.env.apiUrl + "/stocks")
          .then(stocks => {
            this.stocks = stocks.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      createStock() {
        axios.post(process.env.apiUrl + "/stocks", this.stock)
          .then(stock => {
            stock.data.ingredient = {}
            stock.data.ingredient.name = ""
            this.ingredients.forEach(ingredient => {
              if (ingredient.id === stock.data.ingredientId) {
                stock.data.ingredient.name = ingredient.name
              }
            });
            this.stocks.push(stock.data)
            this.closeModal()
            alertHandling.success("Your new stock was created")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectStock(ingredientId) {
        axios.get(process.env.apiUrl + "/stocks/" + ingredientId)
          .then(stock => {
            this.stock = {}
            this.stock = stock.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateStock() {
        axios.put(process.env.apiUrl + "/stocks/" + this.stock.id, this.stock)
          .then(stock => {
            for (let i = 0; i < this.stocks.length; i++) {
              if (this.stocks[i].id === stock.data.id) {
                this.stocks[i] = stock.data
              }
            }
            this.closeModal()
            alertHandling.success("Your stock was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteStock(ingredientId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this stock?", function() {
          axios.delete(process.env.apiUrl + "/stocks/" + ingredientId)
            .then(response => {
              for (let i = 0; i < that.stocks.length; i++) {
                if (that.stocks[i].id === ingredientId) {
                  that.stocks.splice(i, 1)
                  alertHandling.success("Your stock was removed")
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

      getIngredients() {
        axios.get(process.env.apiUrl + "/ingredients")
          .then(ingredients => {
            this.ingredients = ingredients.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      getUnits() {
        axios.get(process.env.apiUrl + "/units")
          .then(units => {
            this.units = units.data
          })
          .catch(err => {
            alertH.andling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      submitAction() {
        if (!this.isEditModal) {
          this.createStock()
        }
        else {
          this.updateStock()
        }
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.stock = {}
        $('#ingredientModal').modal('hide');
      }
    }
  }
</script>
