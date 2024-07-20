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
           
                sh "chmod +x -R ${env.WORKSPACE}"
 
                // Execute the script
                sh './jenkins/scripts/test.sh' 
            }
        }
    }
}
