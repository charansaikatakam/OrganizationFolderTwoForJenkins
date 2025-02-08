pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    environment {
        nvdAPIKey = credentials('NVPAPIKEY')
        DEPENDENCY_CHECK_HOME = tool 'dependency-check-10-0-0'
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
                        sh 'npm install --no-audit'
                        echo "${nvdAPIKey}"
                    }
                }
                stage('Dependecy check using tool') {
                    steps {
                        sh '''
                            ${DEPENDENCY_CHECK_HOME}/bin/dependency-check.sh \
                            --scan . \
                            --format "HTML" \
                            --out dependency-check-report.html \
                            --apiKey "$nvdAPIKey"
                            '''
                }
            }
        }
    }
}
