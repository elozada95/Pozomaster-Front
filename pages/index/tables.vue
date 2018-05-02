<template>
  <div>
    <content-header title="Tables"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Tables</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#tableModal">add</button>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="table in tables" :key="table.id">
                      <td>{{ table.id }}</td>
                      <td>{{ table.description }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectTable(table.id)" data-toggle="modal" data-target="#tableModal" class="btn btn-sm btn-primary"><span class="material-icons">edit</span></button>
                        &nbsp;
                        <button type="button" @click="deleteTable(table.id)" class="btn btn-sm btn-danger"><span class="material-icons">delete</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Modal-->
          <div id="tableModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
            <div role="document" class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <strong class="modal-title" v-if="!isEditModal">New table</strong>
                  <strong class="modal-title" v-else>Update table</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new table for the restaurant.</p>
                  <p v-else>Update the table.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Description</label>
                      <input v-model="table.description" type="text" placeholder="Description" class="form-control" required>
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
        tables: [],
        table: {},
        isEditModal: true,
      }
    },
    mounted() {
      this.getTables()
    },
    methods: {
      getTables() {
        axios.get(process.env.apiUrl + "/tables")
          .then(tables => {
            this.tables = tables.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      createTable() {
        axios.post(process.env.apiUrl + "/tables", this.table)
          .then(table => {
            this.tables.push(table.data)
            this.closeModal()
            alertHandling.success("Your new table was created")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectTable(tableId) {
        axios.get(process.env.apiUrl + "/tables/" + tableId)
          .then(table => {
            this.table = {}
            this.table = table.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateTable() {
        axios.put(process.env.apiUrl + "/tables/" + this.table.id, this.table)
          .then(table => {
            for (let i = 0; i < this.tables.length; i++) {
              if (this.tables[i].id === table.data.id) {
                this.tables[i] = table.data
              }
            }
            this.closeModal()
            alertHandling.success("Your table was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteTable(tableId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this table?", function() {
          axios.delete(process.env.apiUrl + "/tables/" + tableId)
            .then(response => {
              for (let i = 0; i < that.tables.length; i++) {
                if (that.tables[i].id === tableId) {
                  that.tables.splice(i, 1)
                  alertHandling.success("Your table was removed")
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
          this.createTable()
        }
        else {
          this.updateTable()
        }
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.table = {}
        $('#tableModal').modal('hide');
      }
    }
  }
</script>
