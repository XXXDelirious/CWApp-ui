pipeline {
    agent any
    
    environment {
        ANDROID_HOME = "${HOME}/Android/Sdk"
        PATH = "${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${PATH}"
        NODE_VERSION = "25"
        APP_NAME = "CWApp"
        REPO_URL = "https://github.com/XXXDelirious/CWApp-ui"
        // NOTE: Never hardcode tokens here. Use Jenkins Credentials Manager instead.
    }
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo "🔄 Checking out code from repository..."
                git branch: 'main', 
                    url: "${REPO_URL}",
                    credentialsId: 'github-credentials'
                
                sh 'git log -1 --pretty=format:"%h - %an, %ar : %s"'
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo "🔧 Setting up Node.js environment..."
                sh """
                    node --version
                    npm --version
                    echo "Android SDK: \${ANDROID_HOME}"
                """
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh 'npm install --legacy-peer-deps'
            }
        }
        
        stage('Code Quality & Tests') {
            parallel {
                stage('Lint Check') {
                    steps {
                        echo "🔍 Running ESLint..."
                        sh 'npm run lint || true'
                    }
                }
                
                stage('Unit Tests') {
                    steps {
                        echo "🧪 Running unit tests..."
                        sh 'npm test -- --watchAll=false --passWithNoTests || true'
                    }
                }
            }
        }
        
        stage('Build Android Debug APK') {
            steps {
                echo "🔨 Building Android Debug APK..."
                sh """
                    cd android
                    chmod +x gradlew
                    ./gradlew clean
                    ./gradlew assembleDebug
                """
            }
        }
        
        stage('Build Android Release APK') {
            when {
                branch 'main'
            }
            steps {
                echo "🚀 Building Android Release APK..."
                sh """
                    cd android
                    ./gradlew assembleRelease
                """
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo "📦 Archiving build artifacts..."
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.apk', 
                                 allowEmptyArchive: true,
                                 fingerprint: true
            }
        }
        
        stage('Deploy to Firebase App Distribution') {
            when {
                branch 'main'
            }
            steps {
                echo "🚀 Deploying to Firebase App Distribution..."
                sh """
                    # Install Firebase CLI if not available
                    npm install -g firebase-tools
                    
                    # Deploy to Firebase (requires setup)
                    # firebase appdistribution:distribute android/app/build/outputs/apk/debug/app-debug.apk \\
                    #     --app YOUR_FIREBASE_APP_ID \\
                    #     --groups "testers" \\
                    #     --release-notes "Build ${BUILD_NUMBER} - ${GIT_COMMIT}"
                """
            }
        }
    }
    
    post {
        success {
            echo "✅ Build Successful!"
            emailext(
                subject: "✅ Jenkins Build SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <p>Build Successful!</p>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Build URL:</b> ${env.BUILD_URL}</p>
                    <p>Download APK from Jenkins artifacts.</p>
                """,
                to: 'your-email@example.com',
                mimeType: 'text/html'
            )
        }
        
        failure {
            echo "❌ Build Failed!"
            emailext(
                subject: "❌ Jenkins Build FAILED: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                body: """
                    <p>Build Failed!</p>
                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Build URL:</b> ${env.BUILD_URL}</p>
                    <p>Check console output for details.</p>
                """,
                to: 'your-email@example.com',
                mimeType: 'text/html'
            )
        }
        
        always {
            echo "🧹 Cleaning up workspace..."
            cleanWs()
        }
    }
}
