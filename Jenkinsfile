pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    stages {
        stage('ChcekEnvVariables') {
            steps {
                echo "Branch Name is ${env.BRANCH_NAME}"
                echo "Build Number is ${env.BUILD_NUMBER} and Git commit is ${env.GIT_COMMIT}"
            }
        }
        stage('CheckNodeVersion') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
    }
}
