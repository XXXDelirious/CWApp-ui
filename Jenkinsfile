pipeline {
    agent any
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }
    
    environment {
        ANDROID_HOME = '/var/lib/jenkins/Android/Sdk'
        ANDROID_SDK_ROOT = '/var/lib/jenkins/Android/Sdk'
        PATH = "$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    env.GIT_COMMIT_MSG = sh(
                        script: "git log -1 --pretty=format:'%h - %an, %ar : %s'",
                        returnStdout: true
                    ).trim()
                    echo "${env.GIT_COMMIT_MSG}"
                }
            }
        }
        
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying build environment...'
                sh '''
                    echo "==================================="
                    echo "Node version:"
                    node --version
                    echo ""
                    echo "NPM version:"
                    npm --version
                    echo ""
                    echo "Java version:"
                    java -version
                    echo ""
                    echo "Android SDK:"
                    if [ ! -d "$ANDROID_HOME" ]; then
                        echo "❌ Android SDK not found at $ANDROID_HOME"
                        exit 1
                    fi
                    echo "✅ Android SDK: $ANDROID_HOME"
                    echo "==================================="
                '''
            }
        }
        
        stage('Setup Google Services') {
            steps {
                echo '🔐 Setting up Firebase configuration...'
                withCredentials([file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')]) {
                    sh '''
                        mkdir -p android/app
                        cp $GOOGLE_SERVICES android/app/google-services.json
                        echo "✅ google-services.json configured"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh '''
                    rm -rf node_modules package-lock.json
                    npm install --legacy-peer-deps
                    echo "✅ Dependencies installed successfully"
                '''
            }
        }
        
        stage('Build Debug APK') {
            steps {
                echo '🔨 Building Android Debug APK...'
                sh '''
                    cd android
                    chmod +x gradlew
                    
                    # Build directly - Gradle handles incremental builds
                    ./gradlew assembleDebug --stacktrace
                    
                    DEBUG_APK="app/build/outputs/apk/debug/app-debug.apk"
                    
                    if [ -f "$DEBUG_APK" ]; then
                        echo "✅ Debug APK built successfully!"
                        echo "APK Location: android/$DEBUG_APK"
                        echo "APK Size: $(ls -lh $DEBUG_APK | awk '{print $5}')"
                    else
                        echo "❌ APK not found at expected location"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Archive APK') {
            steps {
                echo '📦 Archiving build artifacts...'
                
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/debug/*.apk', 
                                fingerprint: true
                
                sh '''
                    BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
                    GIT_COMMIT=$(git rev-parse HEAD)
                    GIT_SHORT=$(git rev-parse --short HEAD)
                    GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
                    
                    cat > build-info.txt << EOF
╔════════════════════════════════════════╗
║        CWApp Build Information         ║
╚════════════════════════════════════════╝

Build Number:    ${BUILD_NUMBER}
Build Date:      ${BUILD_DATE}
Git Commit:      ${GIT_SHORT} (${GIT_COMMIT})
Git Branch:      ${GIT_BRANCH}
Jenkins Job:     ${JOB_NAME}
Build URL:       ${BUILD_URL}

APK Location: android/app/build/outputs/apk/debug/app-debug.apk

Download: ${BUILD_URL}artifact/

EOF
                    cat build-info.txt
                '''
                
                archiveArtifacts artifacts: 'build-info.txt', fingerprint: true
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline execution completed'
        }
        success {
            echo "✅ BUILD SUCCESSFUL! APK ready for download: ${BUILD_URL}artifact/"
        }
        failure {
            echo "❌ BUILD FAILED! Check console: ${BUILD_URL}console"
        }
    }
}
