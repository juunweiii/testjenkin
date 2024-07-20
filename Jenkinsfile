pipeline {
    agent {
        docker {
            image 'composer:latest'
            args '-v $WORKSPACE:/var/jenkins_home/workspace/testjenkin -w /var/jenkins_home/workspace/testjenkin'
        }
    }
    stages {
        stage('Build') {
            steps {
                dir('Lab7a/jenkins-phpunit-test') {
                    sh 'composer install'
                }
            }
        }
        stage('Test') {
            steps {
                dir('Lab7a/jenkins-phpunit-test') {
                    sh './vendor/bin/phpunit tests'
                }
            }
        }
    }
}
