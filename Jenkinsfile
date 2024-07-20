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
                // Ensure the script has executable permissions
                sh 'chmod +x ./jenkins/scripts/test.sh'
                // Execute the script
                sh './jenkins/scripts/test.sh' 
            }
        }
    }
}
