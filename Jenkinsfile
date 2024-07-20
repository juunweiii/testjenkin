pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') { 
            steps {
                // Execute the script
                sh './jenkins/scripts/test.sh' 
            }
        }
    }
}
