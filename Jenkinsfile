pipeline {
    agent any

    environment {
        // ===============================
        // Android SDK
        // ===============================
        ANDROID_HOME = '/home/acer/Android/Sdk'
        ANDROID_SDK_ROOT = '/home/acer/Android/Sdk'

        'PATH+ANDROID' = '/home/acer/Android/Sdk/platform-tools:/home/acer/Android/Sdk/cmdline-tools/latest/bin'

        // ===============================
        // App config
        // ===============================
        APP_NAME = 'CWApp'
        REPO_URL = 'https://github.com/XXXDelirious/CWApp-ui'

        // ===============================
        // Gradle (CI-safe)
        // ===============================
        GRADLE_OPTS = '-Dorg.gradle.daemon=false -Dorg.gradle.parallel=true -Dorg.gradle.jvmargs=-Xmx4g,-XX:MaxMetaspaceSize=512m'
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '5'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: REPO_URL]]
                ])

                sh 'git log -1 --pretty=format:"%h - %an, %ar : %s"'
            }
        }

        stage('Verify Environment') {
            steps {
                sh '''
                    set -e

                    echo "Node:"
                    node --version

                    echo "NPM:"
                    npm --version

                    echo "Java:"
                    java -version

                    echo "ANDROID_HOME=$ANDROID_HOME"
                    [ -d "$ANDROID_HOME" ]

                    echo "sdkmanager:"
                    sdkmanager --version

                    echo "adb:"
                    adb version

                    echo "✅ Environment OK"
                '''
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
                sh '''
                    cd android
                    chmod +x gradlew
                    ./gradlew clean
                '''
            }
        }

        stage('Build Debug APK') {
            steps {
                sh '''
                    cd android

                    ./gradlew assembleDebug \
                        --no-daemon \
                        --parallel \
                        --stacktrace

                    APK=app/build/outputs/apk/debug/app-debug.apk
                    [ -f "$APK" ] || exit 1
                '''
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
            echo "📦 Download: ${env.BUILD_URL}artifact/"
        }
        failure {
            echo '❌ BUILD FAILED'
            echo "🔍 Console: ${env.BUILD_URL}console"
        }
        always {
            echo '🏁 Pipeline finished'
        }
    }
}
