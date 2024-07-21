
pipeline {
agent any
stages {
stage ('Checkout') {
steps {
git branch:'Lab9', url: 'https://github.com/juunweiii/testjenkin.git'
}
}
stage('Code Quality Check via SonarQube') {
steps {
script {
def scannerHome = tool 'SonarQube';
withSonarQubeEnv('SonarQube') {
sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=OWASP -
Dsonar.sources=."
}
}
}
}
}
post {
always {
recordIssues enabledForFailure: true, tool: sonarQube()
}
}
}