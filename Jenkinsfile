pipeline {
    agent any

    tools {
        nodejs 'NodeJS-22-6-0'
    }

     options { 
        disableResume() 
        }

    environment {
        nvdAPIKey = credentials('NVPAPIKEY')
        MONGO_URI = 'mongodb+srv://supercluster.d83jj.mongodb.net/superData'
        SONAR_SCANNER_HOME = tool 'sonarScanner-7-0'
        sonartoken = credentials('sonartoken')
        sonarUrl = credentials('sonarUrl')
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
        
        stage('Unit Tests') {
            steps {
                catchError(message: 'Unit tests failed check the actual Error', stageResult: 'SUCCESS', buildResult: 'UNSTABLE')
                {
                    withCredentials([usernamePassword(credentialsId: 'MongoDBCreds', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                        sh 'npm test'
                    }  
                }
            }
        }

        stage('Code Coverate') {
            steps {
                catchError(message: 'Code coverage failed', stageResult: 'SUCCESS', buildResult: 'UNSTABLE')
                {
                    withCredentials([usernamePassword(credentialsId: 'MongoDBCreds', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                        sh 'npm run coverage'
                    }  
                }
            }
        }

        stage('Sonar Scanner SAST'){
            steps{
                sh '''
                    $SONAR_SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectKey=solar-system-project \
                    -Dsonar.sources=app.js \
                    -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
                    -Dsonar.host.url=$sonarUrl \
                    -Dsonar.token="$sonartoken"
                '''
            }
        }
    }
}

