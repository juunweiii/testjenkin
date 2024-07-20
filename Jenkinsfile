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
    stage('Checkout SCM') {
      steps {
        git url: 'https://github.com/juunweiii/testjenkin.git', branch: 'main'
      }
    }
    stage('OWASP Dependency-Check') {
      steps {
        dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
      }
    }
  }  
  post {
    success {
      dependencyCheckPublisher pattern: 'dependency-check-report.xml'
    }
  }
}