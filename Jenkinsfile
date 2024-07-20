pipeline {
    agent any
    stages {
        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }
        stage('Build') {
            agent {
                docker {
                    image 'composer:latest'
                    args '-v $WORKSPACE:/var/jenkins_home/workspace/testjenkin'
                }
            }
            steps {
                dir('Lab7a/jenkins-phpunit-test') {
                    sh 'composer install'
                }
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'composer:latest'
                    args '-v $WORKSPACE:/var/jenkins_home/workspace/testjenkin'
                }
            }
            steps {
                dir('Lab7a/jenkins-phpunit-test') {
                    sh './vendor/bin/phpunit --log-junit logs/unitreport.xml -c tests/phpunit.xml tests'
                }
            }
        }
    }
    post {
        always {
            junit testResults: 'Lab7a/jenkins-phpunit-test/logs/unitreport.xml'
        }
    }
}
