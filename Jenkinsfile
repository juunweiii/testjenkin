pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/juunweiii/testjenkin.git'
            }
        }
        stage('Code Quality Check via SonarQube') {
            steps {
                dir('./QA/') {  // Ensure you are in the correct directory
                    script {
                        def scannerHome = tool 'QA';
                        withSonarQubeEnv('QA') {
                            //sh "echo SonarQube Scanner Home: ${scannerHome}"
                            //sh "echo Checking SonarQube Server Connectivity"
                            //sh "curl -v http://172.18.0.4:9000/api/server/version"
                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=QA -Dsonar.sources=."
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            recordIssues enabledForFailure: true, tool: sonarQube(pattern: '**/.scannerwork/report-task.txt')
        }
    }
}
