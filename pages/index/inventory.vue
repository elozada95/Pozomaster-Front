<template>
  <div>
    <content-header title="Inventory"></content-header>
      <section>
      <!-- Modal-->
      <div id="ingredientModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
        <div role="document" class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <strong class="modal-title">Update Inventory of {{ ingredient.name }}</strong>
              <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
            </div>
            <div class="modal-body">
              <p>Update the ingredient.</p>
              <form @submit.prevent="updateIngredientInventory()">
                <div class="form-group">
                  <label>Quantity</label>
                  <input v-model="ingredient.quantity" type="number" step="0.01" min="0" placeholder="Quantity" class="form-control" required>
                </div>
                <div class="form-group">
                  <input type="submit" value="Update" class="btn btn-primary">
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
                <strong>Inventory of Ingredients</strong>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ingredient in ingredients" :key="ingredient.id">
                      <td>{{ ingredient.id }}</td>
                      <td>{{ ingredient.name }}</td>
                      <td>{{ ingredient.quantity }}</td>
                      <td>{{ ingredient.unit.name }}</td>
                      <td>
                        <button type="button" @click="selectIngredient(ingredient.id)" data-toggle="modal" data-target="#ingredientModal" class="transparent-button material-icons">edit</button>
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
  import ContentHeader from '~/components/ContentHeader.vue'
  const alertHandling = require('~/static/js/alert-handling.js')

  export default {
    components: {
      ContentHeader
    },
    data() {
      return {
        ingredients: [],
        ingredient: {},
        errors: []
      }
    },
    mounted() {
      this.getIngredients();
    },
    methods: {
      getIngredients() {
        axios.get(process.env.apiUrl + '/ingredients/')
          .then(ingredients => {
            this.ingredients = ingredients.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectIngredient(ingredientId) {
        axios.get(process.env.apiUrl + "/ingredients/" + ingredientId)
          .then(ingredient => {
            this.ingredient = {}
            this.ingredient = ingredient.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateIngredientInventory() {
        axios.put(process.env.apiUrl + "/ingredients/" + this.ingredient.id, this.ingredient)
          .then(ingredient => {
            for (let i = 0; i < this.ingredients.length; i++) {
              if (this.ingredients[i].id === ingredient.data.id) {
                this.ingredients[i] = ingredient.data
              }
            }
            this.closeModal()
            alertHandling.success("Your inventory was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      closeModal() {
        this.ingredient = {}
        $('#ingredientModal').modal('hide');
      }
    }
  }
</script>
