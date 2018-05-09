pipeline {
  agent {
    docker {
      image 'node'
    }
  }
  stages {
    stage('Clone Sources') {
      steps {
        git 'https://github.com/elozada95/Pozomaster-Front.git'
      }
    }

    stage('Display Information') {
      steps {
        sh 'node -v'
        sh 'npm -v'
      }
    }

    stage('Dependencies') {
      steps {
        sh 'npm install'
      }
    }
  }
}
