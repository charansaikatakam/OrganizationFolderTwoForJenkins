pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22-6-0'
    }

    environment {
        nvdAPIKey = credentials('NVPAPIKEY')
        // DEPENDENCY_CHECK_HOME = tool 'dependency-check-10-0-0'
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
                        sh 'npm install --audit-level=critical'
                    }
                }
                stage('Dependecy check using tool') {
                    options {
                        timeout(time: 15, unit: 'MINUTES')
                    }
                    steps {
                        dependencyCheck additionalArguments: '''
                            --out  \'./\'
                            --scan \'./\'
                            --format \'ALL\'
                            --nvdApiKey "$nvdAPIKey"
                            --prettyPrint''', odcInstallation: 'dependency-check-10-0-0'
                        
                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-report.html', reportName: 'HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                        // sh '''
                        //     "$DEPENDENCY_CHECK_HOME"/bin/dependency-check.sh \
                        //     --scan . \
                        //     --format "HTML" \
                        //     --out . \
                        //     --nvdApiKey "$nvdAPIKey"
                        //     '''
                    }
                }
            }
        }
    }
}

