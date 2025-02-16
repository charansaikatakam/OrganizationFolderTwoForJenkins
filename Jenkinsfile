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
 //       sonartoken = credentials('sonartoken')
   //     sonarUrl = credentials('sonarUrl')
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

        stage('Sonar Scanner SAST and wait for quality gate'){
            steps{
                withSonarQubeEnv(credentialsId: 'sonartoken', installationName: 'sonarqube-server') {
                    sh '''
                        $SONAR_SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectKey=solar-system-project \
                        -Dsonar.sources=app.js \
                        -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info \
                    '''
                }
                timeout(time: 2, unit: 'MINUTES'){
                    waitForQualityGate abortPipeline: false
                }
            }
        }
    }
    post {
        always {
            script {
                def status = currentBuild.currentResult
                def color = (status == 'SUCCESS') ? 'green' : ((status == 'FAILURE') ? 'red' : 'yellow')
                def message = """
                <html>
                    <body>
                        <h1 style="color:${color};">Build Status: ${status}</h1>
                        <p><strong>Project:</strong> ${env.JOB_NAME}</p>
                        <p><strong>Build Number:</strong> ${env.BUILD_NUMBER}</p>
                        <p><strong>Build URL:</strong> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
                    </body>
                </html>
                """
                emailext subject: "Jenkins Build ${status}: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                         body: message,
                         mimeType: 'text/html',
                         to: 'charansaikatakam@gmail.com'
            }
        }
    }
}

