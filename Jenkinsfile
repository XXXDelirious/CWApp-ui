pipeline {
    agent any

    environment {
        // ===============================
        // Android SDK (shared with Jenkins)
        // ===============================
        ANDROID_HOME = '/home/acer/Android/Sdk'
        ANDROID_SDK_ROOT = '/home/acer/Android/Sdk'

        // Append SDK tools to PATH (do NOT override)
        PATH = "/home/acer/Android/Sdk/platform-tools:/home/acer/Android/Sdk/cmdline-tools/latest/bin:${env.PATH}"

        // ===============================
        // App configuration
        // ===============================
        APP_NAME = 'CWApp'
        REPO_URL = 'https://github.com/XXXDelirious/CWApp-ui'

        // ===============================
        // Gradle performance (CI-safe)
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

        // ===============================
        // Checkout
        // ===============================
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'

                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[
                        url: REPO_URL,
                        credentialsId: 'github-credentials'
                    ]]
                ])

                sh 'git log -1 --pretty=format:"%h - %an, %ar : %s"'

                script {
                    def gitCommit = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()
                    currentBuild.description = "Commit: ${gitCommit}"
                }
            }
        }

        // ===============================
        // Verify Environment
        // ===============================
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying build environment...'
                sh '''
                    set -e

                    echo "Node:"
                    node --version

                    echo ""
                    echo "NPM:"
                    npm --version

                    echo ""
                    echo "Java:"
                    java -version

                    echo ""
                    echo "Android SDK:"
                    echo "ANDROID_HOME=$ANDROID_HOME"
                    [ -d "$ANDROID_HOME" ]

                    echo ""
                    echo "sdkmanager:"
                    sdkmanager --version

                    echo ""
                    echo "adb:"
                    adb version

                    echo "✅ Environment verified"
                '''
            }
        }

        // ===============================
        // Firebase / Google Services
        // ===============================
        stage('Setup Google Services') {
            steps {
                echo '🔐 Configuring Firebase (google-services.json)...'
                withCredentials([
                    file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')
                ]) {
                    sh '''
                        mkdir -p android/app
                        cp "$GOOGLE_SERVICES" android/app/google-services.json
                        echo "✅ google-services.json configured"
                    '''
                }
            }
        }

        // ===============================
        // Install JS Dependencies
        // ===============================
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh '''
                    rm -rf node_modules
                    npm install --legacy-peer-deps
                '''
            }
        }

        // ===============================
        // Clean Android Build
        // ===============================
        stage('Clean Build') {
            steps {
                echo '🧹 Cleaning Android build...'
                sh '''
                    cd android
                    chmod +x gradlew
                    ./gradlew clean
                '''
            }
        }

        // ===============================
        // Build Debug APK
        // ===============================
        stage('Build Debug APK') {
            steps {
                echo '🔨 Building Debug APK...'
                sh '''
                    cd android

                    ./gradlew assembleDebug \
                        --no-daemon \
                        --parallel \
                        --build-cache \
                        --stacktrace

                    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

                    echo ""
                    if [ -f "$APK_PATH" ]; then
                        echo "✅ APK built successfully"
                        echo "📦 Location: android/$APK_PATH"
                        echo "📏 Size: $(ls -lh $APK_PATH | awk '{print $5}')"
                    else
                        echo "❌ APK not found!"
                        exit 1
                    fi
                '''
            }
        }

        // ===============================
        // Archive Artifacts
        // ===============================
        stage('Archive APK') {
            steps {
                echo '📦 Archiving APK...'

                archiveArtifacts(
                    artifacts: 'android/app/build/outputs/apk/debug/*.apk',
                    fingerprint: true
                )

                sh '''
                    BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
                    GIT_COMMIT=$(git rev-parse HEAD)
                    GIT_SHORT=$(git rev-parse --short HEAD)
                    GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

                    cat > build-info.txt << EOF
CWApp Build Information
----------------------
Build Number : ${BUILD_NUMBER}
Build Date   : ${BUILD_DATE}
Git Commit   : ${GIT_SHORT} (${GIT_COMMIT})
Git Branch   : ${GIT_BRANCH}
Job Name     : ${JOB_NAME}
Build URL    : ${BUILD_URL}

APK:
android/app/build/outputs/apk/debug/app-debug.apk
EOF
                '''

                archiveArtifacts artifacts: 'build-info.txt'
            }
        }
    }

    post {
        success {
            echo ''
            echo '✅ BUILD SUCCESSFUL'
            echo "📱 Download APK: ${env.BUILD_URL}artifact/"
            echo "⏱️  Duration: ${currentBuild.durationString}"
        }

        failure {
            echo ''
            echo '❌ BUILD FAILED'
            echo "🔍 Console: ${env.BUILD_URL}console"
        }

        always {
            echo '🏁 Pipeline finished'
        }
    }
}
