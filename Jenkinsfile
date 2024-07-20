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
                sh 'sudo ./jenkins/scripts/test.sh' 
            }
        }
    }
}
