pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    environment {
        nvdAPIKey = credentials('NVPAPIKEY')
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
        stage('Dependency Check') {
            parallel {
                stage('InstallPackages') {
                    steps {
                        echo "parallel build"
                    }
                }
                stage('Dependecy check using tool') {
                    steps {
                        dependencyCheck additionalArguments: '''--project	\\\'./\\\'
                        --scan \\\'./\\\'
                        --format \\\'ALL\\\'
                        --prettyPrint''', odcInstallation: 'dependency-check-10-0-0', stopBuild: true
                    }
                }
            }
        }
    }
}
