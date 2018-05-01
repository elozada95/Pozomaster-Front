<template>
  <div>
    <content-header title="Ingredients"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Ingredients</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#ingredientModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Name</th>
                      <th>Unit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ingredient in ingredients">
                      <td>{{ ingredient.id }}</td>
                      <td>{{ ingredient.name }}</td>
                      <td>{{ ingredient.unit.name }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectIngredient(ingredient.id)" data-toggle="modal" data-target="#ingredientModal" class="btn btn-sm btn-primary"><span class="material-icons">edit</span></button>
                        &nbsp;
                        <button type="button" @click="deleteIngredient(ingredient.id)" class="btn btn-sm btn-danger"><span class="material-icons">delete</span></button>
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
                  <strong class="modal-title" v-if="!isEditModal">New Ingredient</strong>
                  <strong class="modal-title" v-else>Update Ingredient</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new ingredient.</p>
                  <p v-else>Update the ingredient.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Name</label>
                      <input v-model="ingredient.name" type="text" placeholder="Name" class="form-control" required>
                    </div>
                    <div class="form-group">
                      <label class="form-control-label">Unit</label>
                      <select name="units" class="form-control" v-model="ingredient.unitId" required>
                        <option disabled value="">Please select one</option>
                        <option v-for="unit in units" v-bind:value="unit.id">{{ unit.name }}</option>
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
        ingredients: [],
        ingredient: {
          unitId: ""
        },
        units: [],
        isEditModal: true,
      }
    },
    mounted() {
      this.getIngredients()
      this.getUnits()
    },
    methods: {
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

      createIngredient() {
        axios.post(process.env.apiUrl + "/ingredients", this.ingredient)
          .then(ingredient => {
            ingredient.data.unit = {}
            ingredient.data.unit.name = ""
            this.units.forEach(unit => {
              if (unit.id === ingredient.data.unitId) {
                ingredient.data.unit.name = unit.name
              }
            });
            this.ingredients.push(ingredient.data)
            this.closeModal()
            alertHandling.success("Your new ingredient was created")
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

      updateIngredient() {
        axios.put(process.env.apiUrl + "/ingredients/" + this.ingredient.id, this.ingredient)
          .then(ingredient => {
            for (let i = 0; i < this.ingredients.length; i++) {
              if (this.ingredients[i].id === ingredient.data.id) {
                this.ingredients[i] = ingredient.data
              }
            }
            this.closeModal()
            alertHandling.success("Your ingredient was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteIngredient(ingredientId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this ingredient?", function() {
          axios.delete(process.env.apiUrl + "/ingredients/" + ingredientId)
            .then(response => {
              for (let i = 0; i < that.ingredients.length; i++) {
                if (that.ingredients[i].id === ingredientId) {
                  that.ingredients.splice(i, 1)
                  alertHandling.success("Your ingredient was removed")
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

      getUnits() {
        axios.get(process.env.apiUrl + "/units")
          .then(units => {
            this.units = units.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      submitAction() {
        if (!this.isEditModal) {
          this.createIngredient()
        }
        else {
          this.updateIngredient()
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
