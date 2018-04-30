const pkg = require('./package')
const dotenv = require('dotenv').config()

module.exports = {
  mode: 'spa',

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    apiUrl: process.env.API_URL || 'http://localhost:8085/api'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'vendor/bootstrap/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: 'vendor/font-awesome/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: 'css/font.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Muli:300,400,700' },
      { rel: 'stylesheet', href: 'css/style.default.css', id: 'theme-stylesheet' },
      { rel: 'stylesheet', href: 'css/custom.css' }
    ],
    script: [
      { src: 'vendor/jquery/jquery.min.js' },
      { src: 'vendor/popper/umd/popper.min.js' },
      { src: 'vendor/bootstrap/js/bootstrap.min.js' },
      { src: 'vendor/jquery-cookie/jquery.cookie.js' },
      { src: 'vendor/chart/Chart.min.js' },
      { src: 'vendor/jquery-validation/jquery.validate.min.js' },
      { src: 'js/alert-handling.js' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Global CSS
  */
  css: [
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    // 'bootstrap-vue/nuxt'
    'nuxt-material-design-icons'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },

  router: {
    linkActiveClass: 'active'
  }
}
