node {
  def app
  stage('Clone repository') {
    checkout scm
  }

  stage('Build image') {
    docker.image('juanfg/nuxt').inside {
      sh 'npm install'
    }
  }
}
