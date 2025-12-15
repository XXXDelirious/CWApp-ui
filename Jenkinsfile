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
        
        stage('Build Release APK') {
            steps {
                echo '🔨 Building Android Release APK (Standalone)...'
                sh '''
                    cd android
                    chmod +x gradlew
                    
                    # Build release APK - this will be a standalone APK
                    ./gradlew assembleRelease --stacktrace
                    
                    RELEASE_APK="app/build/outputs/apk/release/app-release.apk"
                    
                    if [ -f "$RELEASE_APK" ]; then
                        echo "✅ Release APK built successfully!"
                        echo "APK Location: android/$RELEASE_APK"
                        echo "APK Size: $(ls -lh $RELEASE_APK | awk '{print $5}')"
                    else
                        echo "❌ Release APK not found"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Build Debug APK') {
            steps {
                echo '🔨 Building Android Debug APK...'
                sh '''
                    cd android
                    chmod +x gradlew
                    
                    # Build debug APK
                    ./gradlew assembleDebug --stacktrace
                    
                    DEBUG_APK="app/build/outputs/apk/debug/app-debug.apk"
                    
                    if [ -f "$DEBUG_APK" ]; then
                        echo "✅ Debug APK built successfully!"
                        echo "APK Location: android/$DEBUG_APK"
                        echo "APK Size: $(ls -lh $DEBUG_APK | awk '{print $5}')"
                    else
                        echo "❌ Debug APK not found"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Archive APKs') {
            steps {
                echo '📦 Archiving build artifacts...'
                
                // Archive both debug and release APKs
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.apk', 
                                fingerprint: true
                
                sh '''
                    BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
                    GIT_COMMIT=$(git rev-parse HEAD)
                    GIT_SHORT=$(git rev-parse --short HEAD)
                    GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
                    
                    DEBUG_SIZE=$(ls -lh android/app/build/outputs/apk/debug/app-debug.apk | awk '{print $5}')
                    RELEASE_SIZE=$(ls -lh android/app/build/outputs/apk/release/app-release.apk | awk '{print $5}')
                    
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

📱 APK Artifacts:
─────────────────────────────────────────
🔴 Debug APK (requires Metro):
   Location: android/app/build/outputs/apk/debug/app-debug.apk
   Size: ${DEBUG_SIZE}
   
🟢 Release APK (standalone - RECOMMENDED):
   Location: android/app/build/outputs/apk/release/app-release.apk
   Size: ${RELEASE_SIZE}

Download: ${BUILD_URL}artifact/

Note: Use Release APK for testing without Metro bundler
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
            echo "✅ BUILD SUCCESSFUL!"
            echo "📱 Release APK (standalone): ${BUILD_URL}artifact/android/app/build/outputs/apk/release/app-release.apk"
            echo "🔧 Debug APK (needs Metro): ${BUILD_URL}artifact/android/app/build/outputs/apk/debug/app-debug.apk"
        }
        failure {
            echo "❌ BUILD FAILED! Check console: ${BUILD_URL}console"
        }
    }
}
