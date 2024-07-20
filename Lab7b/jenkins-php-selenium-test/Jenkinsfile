pipeline {
	agent none
	stages {
		stage('Integration UI Test') {
			parallel {
				// stage('Deploy') {
				// 	agent any
				// 	steps {
                //         // Convert line endings using tr
                //         sh 'tr -d "\\r" < ./jenkins/scripts/deploy.sh > ./jenkins/scripts/deploy_unix.sh'
                //         // Ensure the new script has executable permissions
                //         sh 'chmod +x ./jenkins/scripts/deploy_unix.sh'
                //         // Execute the new script
                //         sh './jenkins/scripts/deploy_unix.sh' 
				// 		input message: 'Finished using the web site? (Click "Proceed" to continue)'
				// 		// Convert line endings using tr
                //         sh 'tr -d "\\r" < ./jenkins/scripts/kill.sh > ./jenkins/scripts/kill_unix.sh'
                //         // Ensure the new script has executable permissions
                //         sh 'chmod +x ./jenkins/scripts/kill_unix.sh'
                //         // Execute the new script
                //         sh './jenkins/scripts/kill_unix.sh' 
				// 	}
				// }
				stage('Headless Browser Test') {
					agent {
						docker {
							image 'maven:3-alpine' 
							args '-v /root/.m2:/root/.m2' 
						}
					}
					steps {
						sh 'mvn -B -DskipTests clean package'
						sh 'mvn test'
					}
					post {
						always {
							junit 'target/surefire-reports/*.xml'
						}
					}
				}
			}
		}
	}
}