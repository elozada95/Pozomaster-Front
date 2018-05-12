<template>
  <div>
    <content-header :title="product.name"></content-header>
    <section>
      <!-- Modal-->
      <div id="ingredientModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <strong class="modal-title" v-if="!isEditModal">Add ingredient to {{ product.name }}</strong>
              <strong class="modal-title" v-else>Update ingredient</strong>
              <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
            </div>
            <div class="modal-body">
              <p v-if="!isEditModal">Add a new ingredient to {{ product.name }}.</p>
              <p v-else>Update the ingredient.</p>
              <form @submit.prevent="submitAction()">
                <div class="form-group">
                  <label class="form-control-label">Ingredient</label>
                  <select name="ingredients" class="form-control" v-model="ingredient.ingredientId" required>
                    <option disabled value="">Please select one</option>
                    <option v-for="ingredient in ingredients" :key="ingredient.id" v-bind:value="ingredient.id">{{ ingredient.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Quantity</label>
                  <input v-model="ingredient.quantity" type="number" placeholder="Quantity" class="form-control" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                  <input v-if="!isEditModal" type="submit" value="Add" class="btn btn-primary">
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
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Ingredients for {{ product.name }}</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#ingredientModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Quantity</th>
                      <th>Edit</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="relation in ingredientProduct" :key="relation.id">
                      <td>{{ relation.ingredient.name }}</td>
                      <td>{{ relation.quantity }}</td>
                      <td>
                        <button type="button" @click="selectIngredient(relation, true)" class="transparent-button material-icons" data-toggle="modal" data-target="#ingredientModal">edit</button>
                      </td>
                      <td>
                        <button type="button" @click="deleteIngredientFromProduct(relation.ingredient.id, relation.id)" class="transparent-button material-icons">delete</button>
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
  import ContentHeader from '~/components/ContentHeader'
  import axios from 'axios'
  const alertHandling = require('~/static/js/alert-handling.js')

  export default {
    components: {
      ContentHeader
    },
    data() {
      return {
        errors: [],
        product: {

        },
        ingredientProduct: {

        },
        isEditModal: false,
        ingredient: {
          ingredientId: "",
          quantity: 1
        },
        ingredients: []
      }
    },
    mounted() {
      this.getProduct()
      this.getIngredientsFromProduct()
      this.getIngredients()
    },
    methods: {
      getProduct() {
        axios.get(process.env.apiUrl + '/products/' + this.$route.params.id)
          .then(product => {
            this.product = product.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      getIngredients() {
        axios.get(process.env.apiUrl + '/ingredients')
          .then(ingredients => {
            this.ingredients = ingredients.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      getIngredientsFromProduct() {
        axios.get(process.env.apiUrl + '/ingredientProduct/product/' + this.$route.params.id)
          .then(result => {
            this.ingredientProduct = result.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      addIngredientToProduct() {
        console.log(this.ingredient)
        axios.post(process.env.apiUrl + '/ingredientProduct/product/' + this.$route.params.id, this.ingredient)
          .then(result => {
            this.ingredientProduct.push(result.data)
            this.closeModal()
            alertHandling.success("Your ingredient was added to the product")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectIngredient(relation, isEditModal) {
        this.editModal(isEditModal)
        this.ingredient = relation.ingredient
        this.ingredient.ingredientId = relation.ingredient.id
        this.ingredient.quantity = relation.quantity
      },

      updateIngredientFromProduct() {
        axios.put(process.env.apiUrl + "/ingredientProduct/product/" + this.$route.params.id, this.ingredient)
          .then(result => {
            for (let i = 0; i < this.ingredientProduct.length; i++) {
              if (this.ingredientProduct[i].id === result.data.id) {
                this.ingredientProduct[i] = result.data
              }
            }
            this.closeModal()
            alertHandling.success("Your ingredient was updated from the product")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteIngredientFromProduct(ingredientId, relationId) {
        let that = this
        alertHandling.confirm(`Are you sure you want to delete this ingredient from ${that.product.name}?`, function() {
          axios.delete(process.env.apiUrl + "/ingredientProduct/product/" + that.$route.params.id + "/ingredient/" + ingredientId)
            .then(response => {
              for (let i = 0; i < that.ingredientProduct.length; i++) {
                if (that.ingredientProduct[i].id === relationId) {
                  that.ingredientProduct.splice(i, 1)
                  alertHandling.success(`Your ingredient was removed from ${that.product.name}`)
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

      submitAction() {
        if (!this.isEditModal) {
          this.addIngredientToProduct()
        }
        else {
          this.updateIngredientFromProduct()
        }
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.ingredient = {}
        $('#ingredientModal').modal('hide');
      }
    }
  }
</script>
