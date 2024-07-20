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
           
                // Convert line endings using tr
                sh 'tr -d "\\r" < ./jenkins/scripts/test.sh > ./jenkins/scripts/test_unix.sh'
                // Ensure the new script has executable permissions
                sh 'chmod +x ./jenkins/scripts/test_unix.sh'
                // Execute the new script
                sh './jenkins/scripts/test_unix.sh' 
                
            }
        }
        stage('Deliver') { 
            steps {
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh './jenkins/scripts/kill.sh' 
            }
        }
    }
}
