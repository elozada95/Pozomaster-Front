<template>
  <div>
    <content-header title="Orders"></content-header>
    <section>
      <div class="container-fluid">
        <div class="row">
          <button v-for="table in tables" :key="table.id" @click="goToOrder(table)" class="col-lg-4 transparent-button">
            <div v-if="table.orders.length" class="block margin-bottom-sm card-table card-table-red">
              <div class="title">Table {{ table.id }}</div>
              <div class="description">Occupied</div>
              <i class="icon material-icons">layers_clear</i>
            </div>
            <div v-else class="block margin-bottom-sm card-table card-table-green">
              <div class="title">Table {{ table.id }}</div>
              <div class="description">Available</div>
              <i class="icon material-icons">layers</i>
            </div>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  import ContentHeader from '~/components/ContentHeader'
  const alertHandling = require('~/static/js/alert-handling.js')

  export default {
    components: {
      ContentHeader
    },
    data() {
      return {
        errors: [],
        tables: [],
        ok: true
      }
    },
    mounted() {
      this.getTables()
    },
    methods: {
      getTables() {
        axios.get(process.env.apiUrl + "/tables")
          .then(tables => {
            tables.data.forEach(table => {
              table.currentOrder = null
              if (table.orders.lenght) {
                if (!table.orders[0].completedDate) {
                  table.currentOrder = table.orders[0].id
                }
              }
            });
            this.tables = tables.data

          })
          .catch(err => {
            alertHandling.error(err.response.data.message)
            this.errors.push(err)
          })
      },

      goToOrder(table) {
        let that = this
        if (table.orders.length) {
          this.$router.push('/orders/' + table.orders[0].id)
        }
        else {
          alertHandling.confirm(`Do you want to create a new order for table ${table.id}?`, function() {
            let newOrder = {
              'tableId': table.id
            }
            axios.post(process.env.apiUrl + "/orders", newOrder)
              .then(order => {
                console.log(order.data.id)
                that.$router.push('/orders/' + order.data.id)
              })
              .catch(err => {
                alertHandling.error(err.response.data.message)
                that.errors.push(err)
              })
          })
        }
      }
    }
  }
</script>
