pipeline {
    agent {
        docker {
            image 'composer:latest'
            args '-v $WORKSPACE:/var/jenkins_home/workspace/testjenkin -w /var/jenkins_home/workspace/testjenkin/Lab7a/jenkins-phpunit-test'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'composer install'
            }
        }
        stage('Test') {
            steps {
                sh './vendor/bin/phpunit tests'
            }
        }
    }
}
