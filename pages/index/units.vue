<template>
  <div>
    <content-header title="Units"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Food Units</strong>
                <button class="transparent-button material-icons float-right" @click="editModal(false)" data-toggle="modal" data-target="#unitModal">add</button>
              </div>
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
                    <tr v-for="unit in units">
                      <td>{{ unit.id }}</td>
                      <td>{{ unit.name }}</td>
                      <td>
                        <button type="button" @click="editModal(true); selectUnit(unit.id)" data-toggle="modal" data-target="#unitModal" class="btn btn-sm btn-primary"><span class="material-icons">edit</span></button>
                        &nbsp;
                        <button type="button" @click="deleteUnit(unit.id)" class="btn btn-sm btn-danger"><span class="material-icons">delete</span></button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- Modal-->
          <div id="unitModal" tabindex="-1" role="dialog" aria-hidden="true" class="modal fade text-left">
            <div role="document" class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <strong class="modal-title" v-if="!isEditModal">New unit</strong>
                  <strong class="modal-title" v-else>Update unit</strong>
                  <button type="button" @click="closeModal()" class="transparent-button material-icons">close</button>
                </div>
                <div class="modal-body">
                  <p v-if="!isEditModal">Add a new food unit.</p>
                  <p v-else>Update the unit.</p>
                  <form @submit.prevent="submitAction()">
                    <div class="form-group">
                      <label>Name</label>
                      <input v-model="unit.name" type="text" placeholder="Name" class="form-control" required>
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
        units: [],
        unit: {},
        isEditModal: true,
      }
    },
    mounted() {
      this.getUnits()
    },
    methods: {
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

      createUnit() {
        axios.post(process.env.apiUrl + "/units", this.unit)
          .then(unit => {
            this.units.push(unit.data)
            this.closeModal()
            alertHandling.success("Your new unit was created")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      selectUnit(unitId) {
        axios.get(process.env.apiUrl + "/units/" + unitId)
          .then(unit => {
            this.unit = {}
            this.unit = unit.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      updateUnit() {
        axios.put(process.env.apiUrl + "/units/" + this.unit.id, this.unit)
          .then(unit => {
            for (let i = 0; i < this.units.length; i++) {
              if (this.units[i].id === unit.data.id) {
                this.units[i] = unit.data
              }
            }
            this.closeModal()
            alertHandling.success("Your unit was updated")
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      deleteUnit(unitId) {
        let that = this
        alertHandling.confirm("Are you sure you want to delete this unit?", function() {
          axios.delete(process.env.apiUrl + "/units/" + unitId)
            .then(response => {
              for (let i = 0; i < that.units.length; i++) {
                if (that.units[i].id === unitId) {
                  that.units.splice(i, 1)
                  alertHandling.success("Your unit was removed")
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
          this.createUnit()
        }
        else {
          this.updateUnit()
        }
      },

      editModal(isEditModal) {
        this.isEditModal = isEditModal
      },

      closeModal() {
        this.unit = {}
        $('#unitModal').modal('hide');
      }
    }
  }
</script>
