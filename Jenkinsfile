pipeline {
    agent any

    environment {
        ANDROID_HOME = '/home/acer/Android/Sdk'
        ANDROID_SDK_ROOT = '/home/acer/Android/Sdk'

        APP_NAME = 'CWApp'
        REPO_URL = 'https://github.com/XXXDelirious/CWApp-ui'

        GRADLE_OPTS = '-Dorg.gradle.daemon=false'
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Environment') {
            steps {
                withEnv([
                    "PATH=${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin:${env.PATH}"
                ]) {
                    sh '''
                        set -e
                        echo "Node:"
                        node --version
                        echo "Java:"
                        java -version
                        echo "sdkmanager:"
                        sdkmanager --version
                        echo "adb:"
                        adb version
                        echo "✅ Environment OK"
                    '''
                }
            }
        }

        stage('Setup Google Services') {
            steps {
                withCredentials([
                    file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')
                ]) {
                    sh '''
                        mkdir -p android/app
                        cp "$GOOGLE_SERVICES" android/app/google-services.json
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    rm -rf node_modules
                    npm install --legacy-peer-deps
                '''
            }
        }

        stage('Clean Build') {
            steps {
                withEnv([
                    "PATH=${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin:${env.PATH}"
                ]) {
                    sh '''
                        cd android
                        chmod +x gradlew
                        ./gradlew clean
                    '''
                }
            }
        }

        stage('Build Debug APK') {
            steps {
                withEnv([
                    "PATH=${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/cmdline-tools/latest/bin:${env.PATH}"
                ]) {
                    sh '''
                        cd android
                        ./gradlew assembleDebug --no-daemon --stacktrace
                        test -f app/build/outputs/apk/debug/app-debug.apk
                    '''
                }
            }
        }

        stage('Archive APK') {
            steps {
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/debug/*.apk', fingerprint: true
            }
        }
    }

    post {
        success {
            echo '✅ BUILD SUCCESS'
            echo "📦 ${env.BUILD_URL}artifact/"
        }
        failure {
            echo '❌ BUILD FAILED'
            echo "🔍 ${env.BUILD_URL}console"
        }
    }
}
