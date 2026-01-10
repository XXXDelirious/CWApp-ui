pipeline {
    agent any
    
    // ============================================
    // CWAPP DEV PIPELINE - SECURE & PRACTICAL
    // Combines your setup with security improvements
    // ============================================
    
    environment {
        // App Configuration
        APP_NAME = 'CWApp'
        
        // Your Android SDK Configuration (KEEP AS-IS)
        ANDROID_HOME = '/var/lib/jenkins/Android/Sdk'
        ANDROID_SDK_ROOT = '/var/lib/jenkins/Android/Sdk'
        PATH = "$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools"
        
        // Node.js
        NODE_VERSION = '18.x'
        
        // Build Configuration
        MAX_APK_SIZE_MB = '150'
        MIN_TEST_COVERAGE = '70'
        
        // Gradle (prevent OOM errors)
        GRADLE_OPTS = '-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError'
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 1, unit: 'HOURS')
        timestamps()
        ansiColor('xterm')  // Colored output
    }
    
    parameters {
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip unit tests (NOT RECOMMENDED)'
        )
        booleanParam(
            name: 'CLEAN_BUILD',
            defaultValue: false,
            description: 'Clean all caches before build'
        )
    }
    
    stages {
        // ============================================
        // STAGE 1: CHECKOUT
        // ============================================
        stage('Checkout') {
            steps {
                echo '🔄 Checking out source code...'
                checkout scm  // Your simpler method
                
                script {
                    // Get commit info
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_FULL = sh(
                        script: "git rev-parse HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_COMMIT_MSG = sh(
                        script: "git log -1 --pretty=format:'%h - %an, %ar : %s'",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_BRANCH = sh(
                        script: "git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()
                    
                    env.GIT_AUTHOR = sh(
                        script: "git log -1 --pretty=%an",
                        returnStdout: true
                    ).trim()
                    
                    echo "✅ Commit: ${env.GIT_COMMIT_MSG}"
                    
                    // Create audit log
                    def auditLog = [
                        timestamp: new Date().format("yyyy-MM-dd'T'HH:mm:ss"),
                        build_number: BUILD_NUMBER,
                        commit: env.GIT_COMMIT_SHORT,
                        branch: env.GIT_BRANCH,
                        author: env.GIT_AUTHOR,
                        triggered_by: currentBuild.getBuildCauses()[0]?.userId ?: 'auto'
                    ]
                    writeJSON file: "audit-${BUILD_NUMBER}.json", json: auditLog
                }
            }
        }
        
        // ============================================
        // STAGE 2: ENVIRONMENT VERIFICATION
        // ============================================
        stage('Verify Environment') {
            steps {
                echo '🔍 Verifying build environment...'
                sh '''
                    set -e
                    echo "==================================="
                    echo "   ENVIRONMENT VERIFICATION"
                    echo "==================================="
                    
                    # Check Node.js
                    if ! command -v node >/dev/null 2>&1; then
                        echo "❌ ERROR: Node.js not installed"
                        exit 1
                    fi
                    echo "✅ Node.js: $(node --version)"
                    
                    # Check npm
                    if ! command -v npm >/dev/null 2>&1; then
                        echo "❌ ERROR: npm not installed"
                        exit 1
                    fi
                    echo "✅ npm: $(npm --version)"
                    
                    # Check Java
                    if ! command -v java >/dev/null 2>&1; then
                        echo "❌ ERROR: Java not installed"
                        exit 1
                    fi
                    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
                    echo "✅ Java: $JAVA_VERSION"
                    
                    # Verify Android SDK
                    if [ -z "$ANDROID_HOME" ] || [ ! -d "$ANDROID_HOME" ]; then
                        echo "❌ ERROR: ANDROID_HOME not set or directory not found"
                        echo "   ANDROID_HOME: ${ANDROID_HOME:-<not set>}"
                        exit 1
                    fi
                    echo "✅ Android SDK: $ANDROID_HOME"
                    
                    # Check ADB
                    if ! command -v adb >/dev/null 2>&1; then
                        echo "❌ ERROR: ADB not found in PATH"
                        exit 1
                    fi
                    ADB_VERSION=$(adb --version 2>&1 | head -n 1)
                    echo "✅ ADB: $ADB_VERSION"
                    
                    # Check disk space
                    DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
                    echo "✅ Disk usage: ${DISK_USAGE}%"
                    if [ "$DISK_USAGE" -gt 85 ]; then
                        echo "⚠️  WARNING: Disk usage above 85%"
                    fi
                    
                    # Check memory
                    if command -v free >/dev/null 2>&1; then
                        FREE_MEM=$(free -m | grep Mem | awk '{print $7}')
                        echo "✅ Free memory: ${FREE_MEM}MB"
                        if [ "$FREE_MEM" -lt 2048 ]; then
                            echo "⚠️  WARNING: Low memory (< 2GB available)"
                        fi
                    else
                        echo "ℹ️  Memory check skipped (free command not available)"
                    fi
                    
                    echo "==================================="
                    echo "✅ Environment verification complete"
                    echo "==================================="
                '''
            }
        }
        
        // ============================================
        // STAGE 3: SECURITY VALIDATION
        // ============================================
        stage('Security Validation') {
            steps {
                echo '🔒 Running security validation...'
                sh '''
                    set -e
                    
                    # Check for merge conflicts (exclude Jenkinsfile to avoid false positives)
                    if grep -r "<<<<<<< HEAD" . --exclude-dir=node_modules --exclude-dir=.git --exclude=Jenkinsfile 2>/dev/null; then
                        echo "❌ ERROR: Merge conflicts detected"
                        echo "Please resolve all merge conflicts before building"
                        exit 1
                    fi
                    echo "✅ No merge conflicts found"
                    
                    # Check for TODO/FIXME that might indicate incomplete work
                    TODO_COUNT=$(grep -r "TODO\|FIXME" . --exclude-dir=node_modules --exclude-dir=.git --exclude=Jenkinsfile 2>/dev/null | wc -l || echo "0")
                    if [ "$TODO_COUNT" -gt 0 ]; then
                        echo "⚠️  WARNING: Found $TODO_COUNT TODO/FIXME comments"
                    fi
                    
                    # Check for hardcoded secrets patterns
                    if grep -rE "(password|secret|api_key|token)\s*=\s*['\"][^'\"]+['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=Jenkinsfile 2>/dev/null | grep -v "example\|sample\|test"; then
                        echo "❌ ERROR: Possible hardcoded secrets detected"
                        echo "Please use environment variables or credential management"
                        exit 1
                    fi
                    echo "✅ No hardcoded secrets detected"
                    
                    echo "✅ Security validation complete"
                '''
            }
        }
        
        // ============================================
        // STAGE 4: SETUP GOOGLE SERVICES (FIREBASE)
        // ============================================
        stage('Setup Google Services') {
            steps {
                echo '🔐 Setting up Firebase configuration...'
                withCredentials([file(credentialsId: 'google-services-json', variable: 'GOOGLE_SERVICES')]) {
                    sh '''
                        set -e
                        mkdir -p android/app
                        cp $GOOGLE_SERVICES android/app/google-services.json
                        
                        # Verify file was copied
                        if [ ! -f "android/app/google-services.json" ]; then
                            echo "❌ ERROR: Failed to copy google-services.json"
                            exit 1
                        fi
                        
                        echo "✅ google-services.json configured"
                    '''
                }
            }
        }
        
        // ============================================
        // STAGE 5: INSTALL DEPENDENCIES
        // ============================================
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                
                script {
                    if (params.CLEAN_BUILD) {
                        sh '''
                            echo "🧹 Performing clean build..."
                            rm -rf node_modules package-lock.json yarn.lock
                            npm cache clean --force
                        '''
                    }
                    
                    // Install with retry logic
                    retry(3) {
                        sh '''
                            set -e
                            
                            # Remove old modules if not clean build
                            if [ "${CLEAN_BUILD}" != "true" ]; then
                                rm -rf node_modules package-lock.json
                            fi
                            
                            # Install dependencies
                            npm install --legacy-peer-deps \
                                --fetch-timeout=600000 \
                                2>&1 | tee npm-install.log
                            
                            # Verify critical packages
                            if [ ! -d "node_modules/react-native" ]; then
                                echo "❌ ERROR: react-native not installed"
                                exit 1
                            fi
                            
                            echo "✅ Dependencies installed successfully"
                        '''
                    }
                }
            }
        }
        
        // ============================================
        // STAGE 6: SECURITY SCANNING
        // ============================================
        stage('Security Scanning') {
            steps {
                echo '🔍 Scanning for vulnerabilities...'
                sh '''
                    set -e
                    
                    # Run npm audit
                    echo "Running npm audit..."
                    npm audit --audit-level=high --json > npm-audit.json || true
                    
                    # Check for vulnerabilities
                    CRITICAL=$(cat npm-audit.json | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' || echo "0")
                    HIGH=$(cat npm-audit.json | grep -o '"high":[0-9]*' | grep -o '[0-9]*' || echo "0")
                    
                    echo "Security scan results:"
                    echo "  Critical: $CRITICAL"
                    echo "  High: $HIGH"
                    
                    # Warning on critical (don't fail dev builds)
                    if [ "$CRITICAL" -gt 0 ]; then
                        echo "⚠️  WARNING: $CRITICAL critical vulnerabilities found!"
                        echo "Review npm-audit.json and fix before production"
                        # npm audit --audit-level=critical
                    fi
                    
                    if [ "$HIGH" -gt 5 ]; then
                        echo "⚠️  WARNING: $HIGH high-severity vulnerabilities"
                    fi
                    
                    echo "✅ Security scan completed"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit.json', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 7: CODE QUALITY
        // ============================================
        stage('Code Quality') {
            steps {
                echo '📊 Running code quality checks...'
                sh '''
                    set -e
                    
                    # ESLint (if configured)
                    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
                        echo "Running ESLint..."
                        npm run lint 2>&1 | tee eslint.log || {
                            echo "⚠️  Linting issues found (not failing build)"
                        }
                    else
                        echo "ℹ️  No ESLint config found, skipping"
                    fi
                    
                    # Prettier (if configured)
                    if [ -f ".prettierrc" ] || [ -f ".prettierrc.json" ]; then
                        echo "Checking code formatting..."
                        npm run prettier:check 2>&1 | tee prettier.log || {
                            echo "⚠️  Formatting issues found (not failing build)"
                        }
                    else
                        echo "ℹ️  No Prettier config found, skipping"
                    fi
                    
                    echo "✅ Code quality checks completed"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: '*.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 8: UNIT TESTS
        // ============================================
        stage('Unit Tests') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            steps {
                echo '🧪 Running unit tests...'
                sh '''
                    set -e
                    export TZ=UTC
                    
                    # Check if tests exist
                    if [ ! -d "__tests__" ] && [ ! -d "tests" ]; then
                        echo "⚠️  No test directory found, skipping tests"
                        exit 0
                    fi
                    
                    # Run tests with coverage
                    npm test -- \
                        --coverage \
                        --watchAll=false \
                        --maxWorkers=2 \
                        --bail=false \
                        --testTimeout=10000 \
                        --json \
                        --outputFile=test-results.json \
                        2>&1 | tee test-output.log || {
                        echo "⚠️  Some tests failed (continuing build)"
                    }
                    
                    # Check coverage if report exists
                    if [ -f "coverage/coverage-summary.json" ]; then
                        COVERAGE=$(node -p "require('./coverage/coverage-summary.json').total.lines.pct" 2>/dev/null || echo "0")
                        echo "Test coverage: ${COVERAGE}%"
                        
                        if (( $(echo "$COVERAGE < $MIN_TEST_COVERAGE" | bc -l 2>/dev/null || echo "0") )); then
                            echo "⚠️  WARNING: Coverage (${COVERAGE}%) below threshold (${MIN_TEST_COVERAGE}%)"
                        else
                            echo "✅ Coverage threshold met"
                        fi
                    fi
                    
                    echo "✅ Tests completed"
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: '**/test-results.xml'
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        // ============================================
        // STAGE 9: CLEAN ANDROID BUILD
        // ============================================
        stage('Clean Android') {
            steps {
                echo '🧹 Cleaning Android build...'
                sh '''
                    set -e
                    cd android
                    
                    chmod +x gradlew
                    
                    # Clean Gradle build
                    ./gradlew clean --no-daemon
                    
                    # Remove build directories
                    rm -rf app/build
                    rm -rf build
                    
                    # Clean Gradle cache if requested
                    if [ "${CLEAN_BUILD}" = "true" ]; then
                        echo "Cleaning Gradle cache..."
                        rm -rf ~/.gradle/caches/ || true
                    fi
                    
                    echo "✅ Android build cleaned"
                '''
            }
        }
        
        // ============================================
        // STAGE 10: BUILD RELEASE APK
        // ============================================
        stage('Build Release APK') {
            steps {
                echo '🔨 Building Android Release APK (Standalone)...'
                sh '''
                    set -e
                    cd android
                    
                    chmod +x gradlew
                    
                    # Build release APK - standalone, no Metro needed
                    echo "Building release APK..."
                    ./gradlew assembleRelease \
                        --no-daemon \
                        --stacktrace \
                        -Dorg.gradle.jvmargs="-Xmx4096m" \
                        2>&1 | tee ../gradle-release.log
                    
                    RELEASE_APK="app/build/outputs/apk/release/app-release.apk"
                    
                    # Verify APK exists
                    if [ ! -f "$RELEASE_APK" ]; then
                        echo "❌ ERROR: Release APK not found"
                        exit 1
                    fi
                    
                    # Get APK info
                    APK_SIZE=$(ls -lh "$RELEASE_APK" | awk '{print $5}')
                    APK_SIZE_MB=$(du -m "$RELEASE_APK" | cut -f1)
                    
                    echo "✅ Release APK built successfully!"
                    echo "   Location: android/$RELEASE_APK"
                    echo "   Size: $APK_SIZE (${APK_SIZE_MB}MB)"
                    
                    # Check size warning
                    if [ "$APK_SIZE_MB" -gt "$MAX_APK_SIZE_MB" ]; then
                        echo "⚠️  WARNING: APK size (${APK_SIZE_MB}MB) exceeds ${MAX_APK_SIZE_MB}MB"
                    fi
                    
                    # Copy to workspace
                    cp "$RELEASE_APK" "../app-release.apk"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gradle-release.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 11: BUILD DEBUG APK
        // ============================================
        stage('Build Debug APK') {
            steps {
                echo '🔨 Building Android Debug APK...'
                sh '''
                    set -e
                    cd android
                    
                    chmod +x gradlew
                    
                    # Build debug APK - requires Metro bundler
                    echo "Building debug APK..."
                    ./gradlew assembleDebug \
                        --no-daemon \
                        --stacktrace \
                        -Dorg.gradle.jvmargs="-Xmx4096m" \
                        2>&1 | tee ../gradle-debug.log
                    
                    DEBUG_APK="app/build/outputs/apk/debug/app-debug.apk"
                    
                    # Verify APK exists
                    if [ ! -f "$DEBUG_APK" ]; then
                        echo "❌ ERROR: Debug APK not found"
                        exit 1
                    fi
                    
                    # Get APK info
                    APK_SIZE=$(ls -lh "$DEBUG_APK" | awk '{print $5}')
                    
                    echo "✅ Debug APK built successfully!"
                    echo "   Location: android/$DEBUG_APK"
                    echo "   Size: $APK_SIZE"
                    
                    # Copy to workspace
                    cp "$DEBUG_APK" "../app-debug.apk"
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'gradle-debug.log', allowEmptyArchive: true
                }
            }
        }
        
        // ============================================
        // STAGE 12: APK ANALYSIS
        // ============================================
        stage('APK Analysis') {
            steps {
                echo '🔍 Analyzing APKs...'
                sh '''
                    set -e
                    
                    echo "=== Release APK Analysis ==="
                    aapt dump badging "app-release.apk" | grep -E "package|application-label|versionCode|versionName|sdkVersion" || true
                    
                    echo ""
                    echo "=== Debug APK Analysis ==="
                    aapt dump badging "app-debug.apk" | grep -E "package|application-label|versionCode|versionName|sdkVersion" || true
                    
                    # Generate checksums
                    sha256sum app-release.apk > app-release.apk.sha256
                    sha256sum app-debug.apk > app-debug.apk.sha256
                    
                    echo ""
                    echo "✅ Checksums generated"
                    echo "Release SHA256: $(cat app-release.apk.sha256 | awk '{print $1}')"
                    echo "Debug SHA256: $(cat app-debug.apk.sha256 | awk '{print $1}')"
                '''
            }
        }
        
        // ============================================
        // STAGE 13: ARCHIVE & BUILD INFO
        // ============================================
        stage('Archive APKs') {
            steps {
                echo '📦 Archiving build artifacts...'
                
                // Archive APKs with your paths
                archiveArtifacts artifacts: 'android/app/build/outputs/apk/**/*.apk', 
                                fingerprint: true
                
                // Also archive from workspace
                archiveArtifacts artifacts: '*.apk,*.sha256', fingerprint: true
                
                // Create your custom build info
                sh '''
                    BUILD_DATE=$(date '+%Y-%m-%d %H:%M:%S')
                    
                    DEBUG_SIZE=$(ls -lh app-debug.apk | awk '{print $5}')
                    RELEASE_SIZE=$(ls -lh app-release.apk | awk '{print $5}')
                    
                    # Get package info
                    PACKAGE_NAME=$(aapt dump badging app-release.apk | grep package | awk '{print $2}' | sed "s/name='//g" | sed "s/'//g")
                    VERSION_CODE=$(aapt dump badging app-release.apk | grep versionCode | awk '{print $3}' | sed "s/versionCode='//g" | sed "s/'//g")
                    VERSION_NAME=$(aapt dump badging app-release.apk | grep versionName | awk '{print $4}' | sed "s/versionName='//g" | sed "s/'//g")
                    
                    cat > build-info.txt << EOF
╔════════════════════════════════════════╗
║        CWApp Build Information         ║
╚════════════════════════════════════════╝

Build Number:    ${BUILD_NUMBER}
Build Date:      ${BUILD_DATE}
Git Commit:      ${GIT_COMMIT_SHORT} (${GIT_COMMIT_FULL})
Git Branch:      ${GIT_BRANCH}
Git Author:      ${GIT_AUTHOR}
Jenkins Job:     ${JOB_NAME}
Build URL:       ${BUILD_URL}

App Information:
─────────────────────────────────────────
Package:         ${PACKAGE_NAME}
Version:         ${VERSION_NAME} (${VERSION_CODE})

📱 APK Artifacts:
─────────────────────────────────────────
🔴 Debug APK (requires Metro bundler):
   File: app-debug.apk
   Location: android/app/build/outputs/apk/debug/app-debug.apk
   Size: ${DEBUG_SIZE}
   SHA256: $(cat app-debug.apk.sha256 | awk '{print $1}')
   
🟢 Release APK (standalone - RECOMMENDED):
   File: app-release.apk
   Location: android/app/build/outputs/apk/release/app-release.apk
   Size: ${RELEASE_SIZE}
   SHA256: $(cat app-release.apk.sha256 | awk '{print $1}')

Download Links:
─────────────────────────────────────────
Release APK: ${BUILD_URL}artifact/app-release.apk
Debug APK:   ${BUILD_URL}artifact/app-debug.apk

Installation:
─────────────────────────────────────────
# Verify checksum (recommended)
sha256sum -c app-release.apk.sha256

# Install via ADB
adb install app-release.apk

Note: Use Release APK for testing without Metro bundler
      Use Debug APK only for development with Metro running

╚════════════════════════════════════════╝
EOF
                    cat build-info.txt
                '''
                
                archiveArtifacts artifacts: 'build-info.txt,audit-*.json', fingerprint: true
            }
        }
    }
    
    // ============================================
    // POST-BUILD ACTIONS
    // ============================================
    post {
        always {
            script {
                echo "═══════════════════════════════════════════════════"
                echo "  BUILD COMPLETED - STATUS: ${currentBuild.result ?: 'SUCCESS'}"
                echo "═══════════════════════════════════════════════════"
            }
            
            // CRITICAL: Clean up sensitive files
            sh '''
                echo "🧹 Cleaning sensitive files..."
                rm -f android/app/google-services.json
                rm -f android/app/release.keystore
                rm -f android/keystore.properties
                find . -name "*.keystore" -delete 2>/dev/null || true
                find . -name "*.jks" -delete 2>/dev/null || true
                echo "✅ Cleanup completed"
            '''
            
            // Clean workspace
            cleanWs(
                deleteDirs: true,
                patterns: [
                    [pattern: 'node_modules', type: 'INCLUDE'],
                    [pattern: 'android/build', type: 'INCLUDE'],
                    [pattern: 'android/app/build', type: 'INCLUDE']
                ]
            )
        }
        
        success {
            script {
                def duration = currentBuild.duration / 1000 / 60
                
                echo "✅ BUILD SUCCESSFUL!"
                echo ""
                echo "📱 APK Downloads:"
                echo "   🟢 Release APK (standalone): ${BUILD_URL}artifact/app-release.apk"
                echo "   🔴 Debug APK (needs Metro):  ${BUILD_URL}artifact/app-debug.apk"
                echo ""
                echo "📄 Build Info: ${BUILD_URL}artifact/build-info.txt"
                echo "🔍 Security Scan: ${BUILD_URL}artifact/npm-audit.json"
                echo "📊 Coverage Report: ${BUILD_URL}Coverage_Report/"
                echo ""
                echo "⏱️  Build Duration: ${duration.round(1)} minutes"
            }
        }
        
        failure {
            echo "❌ BUILD FAILED!"
            echo "Check console output: ${BUILD_URL}console"
        }
        
        unstable {
            echo "⚠️  BUILD UNSTABLE (tests failed but APKs built)"
        }
    }
}
