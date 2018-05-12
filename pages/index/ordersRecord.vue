<template>
  <div>
    <content-header title="Orders Record"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="block margin-bottom-sm">
              <div class="title">
                <strong>Orders Record</strong>
              </div>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>#id</th>
                      <th>Table</th>
                      <th>Total Price</th>
                      <th>Completion Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="order in orders" :key="order.id">
                      <td>{{ order.id }}</td>
                      <td>{{ order.table.id }}</td>
                      <td>${{ order.total }}</td>
                      <td>{{ order.completedDate }}</td>
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
  import moment from 'moment'
  import ContentHeader from '~/components/ContentHeader.vue'
  const alertHandling = require('~/static/js/alert-handling.js')

  export default {
    components: {
      ContentHeader
    },
    data() {
      return {
        errors: [],
        orders: [],
        order: {},
        isEditModal: true,
      }
    },
    mounted() {
      this.getOrders()
    },
    methods: {
      getOrders() {
        axios.get(process.env.apiUrl + "/orders/complete")
          .then(orders => {
          	orders.data.forEach(order => {
              order.completedDate = moment(order.completedDate).format("MMMM Do YYYY, h:mm:ss a")
            });
            this.orders = orders.data
          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      }
    }
  }
</script>