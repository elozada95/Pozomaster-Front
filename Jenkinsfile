node {
  def app
  stage('Clone repository') {
    checkout scm
  }

  stage('Build image') {
    sh 'npm install'
    sh 'npm start'
  }
}
