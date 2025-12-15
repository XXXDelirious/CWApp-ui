pipeline {
    agent any
    
    environment {
        // Android SDK paths
        ANDROID_HOME = "${HOME}/Android/Sdk"
        ANDROID_SDK_ROOT = "${HOME}/Android/Sdk"
        PATH = "${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/tools:${ANDROID_HOME}/tools/bin:${PATH}"
        
        // App configuration
        APP_NAME = 'CWApp'
        REPO_URL = 'https://github.com/XXXDelirious/CWApp-ui'
        
        // Gradle options for performance
        GRADLE_OPTS = '-Dorg.gradle.daemon=false -Dorg.gradle.parallel=true -Dorg.gradle.jvmargs="-Xmx4g -XX:MaxMetaspaceSize=512m"'
    }
    
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
    }
    
    stages {
        stage('Checkout') {
            steps {
                script {
                    echo "🔄 Checking out code from repository..."
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: 'github-credentials'
                        ]]
                    ])
                    
                    sh 'git log -1 --pretty=format:"%h - %an, %ar : %s"'
                    
                    def gitCommit = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    currentBuild.description = "Commit: ${gitCommit}"
                }
            }
        }
        
        stage('Verify Environment') {
            steps {
                echo "🔍 Verifying build environment..."
                sh '''
                    echo "==================================="
                    echo "Node version:"
                    node --version || { echo "❌ Node.js not found!"; exit 1; }
                    
                    echo ""
                    echo "NPM version:"
                    npm --version || { echo "❌ NPM not found!"; exit 1; }
                    
                    echo ""
                    echo "Java version:"
                    java -version || { echo "❌ Java not found!"; exit 1; }
                    
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
                echo "🔐 Setting up Firebase configuration..."
                script {
                    withCredentials([file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')]) {
                        sh '''
                            mkdir -p android/app
                            cp $GOOGLE_SERVICES android/app/google-services.json
                            echo "✅ google-services.json configured"
                        '''
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm dependencies..."
                sh '''
                    echo "Cleaning previous installations..."
                    rm -rf node_modules package-lock.json
                    
                    echo "Installing dependencies..."
                    npm install --legacy-peer-deps
                    
                    echo "✅ Dependencies installed successfully"
                '''
            }
        }
        
        stage('Clean Build') {
            steps {
                echo "🧹 Cleaning Android build artifacts..."
                sh '''
                    cd android
                    chmod +x gradlew
                    ./gradlew clean
                    echo "✅ Clean completed"
                '''
            }
        }
        
        stage('Build Debug APK') {
            steps {
                echo "🔨 Building Android Debug APK..."
                sh '''
                    cd android
                    ./gradlew assembleDebug --stacktrace
                    
                    echo ""
                    echo "==================================="
                    DEBUG_APK="app/build/outputs/apk/debug/app-debug.apk"
                    if [ -f "$DEBUG_APK" ]; then
                        echo "✅ Debug APK built successfully!"
                        echo "APK Location: android/$DEBUG_APK"
                        echo "APK Size: $(ls -lh $DEBUG_APK | awk '{print $5}')"
                        echo "==================================="
                    else
                        echo "❌ Debug APK not found!"
                        exit 1
                    fi
                '''
            }
        }
        
        stage('Archive APK') {
            steps {
                echo "📦 Archiving build artifacts..."
                script {
                    archiveArtifacts artifacts: 'android/app/build/outputs/apk/debug/*.apk', 
                                     allowEmptyArchive: false,
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
                    
                    archiveArtifacts artifacts: 'build-info.txt', allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo ""
                echo "╔════════════════════════════════════════╗"
                echo "║       ✅ BUILD SUCCESSFUL! ✅          ║"
                echo "╚════════════════════════════════════════╝"
                echo ""
                echo "📱 APK ready for download!"
                echo "🔗 Download from: ${env.BUILD_URL}artifact/"
                echo ""
                
                def buildDuration = currentBuild.durationString.replace(' and counting', '')
                echo "⏱️  Build completed in ${buildDuration}"
            }
        }
        
        failure {
            script {
                echo ""
                echo "╔════════════════════════════════════════╗"
                echo "║         ❌ BUILD FAILED! ❌            ║"
                echo "╚════════════════════════════════════════╝"
                echo ""
                echo "📋 Check console output for errors"
                echo "🔗 Console: ${env.BUILD_URL}console"
                echo ""
            }
        }
        
        always {
            script {
                echo "🧹 Cleaning up..."
                echo "🏁 Pipeline execution completed"
            }
        }
    }
}
