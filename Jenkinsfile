// pipeline {
// 	agent any
// 	stages {
// 		stage('Checkout SCM') {
// 			steps {
// 				git url: 'https://github.com/juunweiii/testjenkin.git', branch: 'main'
// 			}
// 		}

// 		stage('OWASP DependencyCheck') {
// 			steps {
// 				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
// 			}
// 		}
// 	}	
// 	post {
// 		success {
// 			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
// 		}
// 	}
// }

pipeline {
  agent any
  stages {
    //   stage('Build') {
    //       steps {
    //           nodejs('nodejs'){
    //                 sh 'npm install'
    //           }
    //       }
    //   }
        // stage('Test') {
        //     steps {
        //         sh './jenkins/scripts/test.sh'
        //     }
        // }
        // stage('Deliver') { 
        //     steps {
        //         sh './jenkins/scripts/deliver.sh' 
        //         input message: 'Finished using the web site? (Click "Proceed" to continue)' 
        //         sh './jenkins/scripts/kill.sh' 
        //     }
        // }
        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                script {
                    //withCredentials([string(credentialsId: 'NVD-API-KEY', variable: 'NVD_API_KEY')]) {
                        dependencyCheck additionalArguments: """
                            -o './'
                            -s'./'
                            -f 'XML'
                            --prettyPrint
                            --nvdApiKey \${NVD_API_KEY}
                        """, odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                    //}
                  archiveArtifacts artifacts: 'dependency-check-report.xml', allowEmptyArchive: false
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }
        }
    }
}