<template>
  <div>
    <content-header title="Categories"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Food Categories</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#categoryModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="category in categories" :key="category.id">
                      <td>{{ category.id }}</td>
                      <td>{{ category.name }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectCategory(category.id)" data-toggle="modal" data-target="#categoryModal" class="transparent-button material-icons">edit</button>
                      </td>
                      <td>
                        <button type="button" @click="deleteCategory(category.id)" class="transparent-button material-icons">delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Modal-->
          <div id="categoryModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
            <div role="document" class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <strong class="modal-title" v-if="!isEditModal">New Category</strong>
                  <strong class="modal-title" v-else>Update Category</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new food category.</p>
                  <p v-else>Update the category.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Name</label>
                      <input v-model="category.name" type="text" placeholder="Name" class="form-control" required>
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
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      createCategory() {
        axios.post(process.env.apiUrl + "/categories", this.category)
          .then(category => {
            this.categories.push(category.data)
            this.closeModal()
            alertHandling.success("Your new category was created")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
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
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateCategory() {
        axios.put(process.env.apiUrl + "/categories/" + this.category.id, this.category)
          .then(category => {
            for (let i = 0; i < this.categories.length; i++) {
              if (this.categories[i].id === category.data.id) {
                this.categories[i] = category.data
              }
            }
            this.closeModal()
            alertHandling.success("Your category was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteCategory(categoryId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this category?", function() {
          axios.delete(process.env.apiUrl + "/categories/" + categoryId)
            .then(response => {
              for (let i = 0; i < that.categories.length; i++) {
                if (that.categories[i].id === categoryId) {
                  that.categories.splice(i, 1)
                  alertHandling.success("Your category was removed")
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
          this.createCategory()
        }
        else {
          this.updateCategory()
        }
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
