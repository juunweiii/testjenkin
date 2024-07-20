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
                script {
                    // Convert line endings using tr for deliver.sh
                    sh 'tr -d "\\r" < ./jenkins/scripts/deliver.sh > ./jenkins/scripts/deliver_unix.sh'
                    // Ensure the new script has executable permissions
                    sh 'chmod +x ./jenkins/scripts/deliver_unix.sh'
                    // Execute the deliver script
                    sh './jenkins/scripts/deliver_unix.sh'
                    
                    // Pause for user confirmation
                    input message: 'Finished using the web site? (Click "Proceed" to continue)'
                    
                    // Convert line endings using tr for kill.sh
                    sh 'tr -d "\\r" < ./jenkins/scripts/kill.sh > ./jenkins/scripts/kill_unix.sh'
                    // Ensure the new script has executable permissions
                    sh 'chmod +x ./jenkins/scripts/kill_unix.sh'
                    // Execute the kill script
                    sh './jenkins/scripts/kill_unix.sh'
                }
            }
        }
    }
}
