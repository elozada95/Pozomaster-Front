<template>
  <div>
    <div class="page-header">
      <div class="container-fluid">
        <h2 class="h5 no-margin-bottom">Categories</h2>
      </div>
    </div>
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
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="category in categories">
                          <td>{{ category.id }}</td>
                          <td>{{ category.name }}</td>
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

  export default {
    data() {
      return {
        errors: [],
        categories: []
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
      }
    }
  }
</script>
