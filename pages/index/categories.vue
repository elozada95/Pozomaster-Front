<template>
  <div>
    <!-- Container Header -->
    <div class="page-header">
      <div class="container-fluid">
        <h2 class="h5 no-margin-bottom">Categories</h2>
      </div>
    </div>
    <!-- End Container Header -->

    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title"><strong>Food Categories</strong></div>
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
                    <tr v-for="category in categories">
                      <td>{{ category.id }}</td>
                      <td>{{ category.name }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectCategory(category.id)" data-toggle="modal" data-target="#categoryModal" class="btn btn-primary">Edit</button>
                        <button type="button" @click="deleteCategory(category.id)" class="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Create Category Modal Form -->
          <div class="col-lg-4">
            <div class="block">
              <div class="title"><strong>Create a new category</strong></div>
              <div class="block-body text-center">
                <button type="button" @click="editModal(false)" data-toggle="modal" data-target="#categoryModal" class="btn btn-primary">New Category</button>
                <!-- Modal-->
                <div id="categoryModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
                  <div role="document" class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <strong class="modal-title" v-if="!isEditModal">New Category</strong>
                        <strong class="modal-title" v-else>Update Category</strong>
                        <button type="button" @click="closeModal()" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>
                      </div>
                      <div class="modal-body">
                        <p v-if="!isEditModal">Add a new food category.</p>
                        <p v-else>Update the category.</p>
                        <form v-if="!isEditModal" @submit.prevent="createCategory()">
                          <div class="form-group">
                            <label>Name</label>
                            <input v-model="category.name" type="text" placeholder="Name" class="form-control" required>
                          </div>
                          <div class="form-group">
                            <input type="submit" value="Create" class="btn btn-primary">
                          </div>
                        </form>
                        <form v-else @submit.prevent="updateCategory()">
                          <div class="form-group">
                            <label>Name</label>
                            <input v-model="category.name" type="text" placeholder="Name" class="form-control" required>
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
              </div>
            </div>
          </div>
          <!-- End Create Category Modal Form-->

        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        errors: [],
        categories: [],
        category: {},
        isEditModal: true,
      }
    },
    mounted() {
      this.getCategories()
    },
    methods: {
      getCategories() {
        axios.get(process.env.apiUrl + "/categories")
          .then(categories => {
            this.categories = categories.data
          })
          .catch(err => {
            this.errors.push(err)
          })
      },

      createCategory() {
        axios.post(process.env.apiUrl + "/categories", this.category)
          .then(category => {
            this.categories.push(category.data)
            this.closeModal()
          })
          .catch(err => {
            this.closeModal()
            this.errors.push(err)
          })
      },

      selectCategory(categoryId) {
        axios.get(process.env.apiUrl + "/categories/" + categoryId)
          .then(category => {
            this.category = {}
            this.category = category.data
          })
          .catch(err => {
            this.errors.push(err)
          })
      },

      updateCategory() {
        axios.put(process.env.apiUrl + "/categories/" + this.category.id, this.category)
          .then(category => {
            for (let i = 0; i < this.categories.length; i++) {
              if (this.categories[i].id === category.data.id) {
                this.categories.splice(i, 1)
              }
            }
            this.categories.push(category.data)
            this.closeModal()
          })
          .catch(err => {
            this.errors.push(err)
          })
      },

      deleteCategory(categoryId) {
        axios.delete(process.env.apiUrl + "/categories/" + categoryId)
          .then(response => {
            for (let i = 0; i < this.categories.length; i++) {
              if (this.categories[i].id === categoryId) {
                this.categories.splice(i, 1)
              }
            }
          })
          .catch(err => {
            this.errors.push(err)
          })
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.category = {}
        $('#categoryModal').modal('hide');
      }
    }
  }
</script>
