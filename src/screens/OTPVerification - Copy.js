//OTPVerification.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OTPVerificationScreen({ navigation, route }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [termsAccepted, setTermsAccepted] = useState(true); // Pre-checked as per design
  const insets = useSafeAreaInsets();
  
  const language = route?.params?.language || 'en';
  const accountType = route?.params?.accountType || 'user';
  const phoneNumber = route?.params?.phoneNumber || '+91-9992837465';

  // Refs for OTP inputs
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const isFormValid = otp.every((digit) => digit !== '') && termsAccepted;

  const handleOTPChange = (value, index) => {
    // Only allow single digit
    const newValue = value.slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (newValue !== '' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = () => {
    if (isFormValid) {
      const otpCode = otp.join('');
      // Navigate to next screen (e.g., Home or Profile Setup)
      navigation.navigate('HomeScreen', {
        language,
        accountType,
        phoneNumber,
        otpCode,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditPhoneNumber = () => {
    navigation.goBack();
  };

  const handleResendOTP = () => {
    // Reset OTP inputs
    setOtp(['', '', '', '']);
    inputRefs[0].current?.focus();
    
    // TODO: Call API to resend OTP
    console.log('Resend OTP to:', phoneNumber);
  };

  const handleTermsPress = () => {
    console.log('Navigate to Terms of Services');
  };

  const handlePrivacyPress = () => {
    console.log('Navigate to Privacy Policy');
  };

  useEffect(() => {
    // Auto-focus first input on mount
    setTimeout(() => {
      inputRefs[0].current?.focus();
    }, 500);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.6}
      >
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.title}>OTP Verification</Text>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Enter the OTP sent to{' '}
            <Text style={styles.phoneNumber}>{phoneNumber}</Text>
          </Text>

          {/* Edit Phone Number Link */}
          <TouchableOpacity
            onPress={handleEditPhoneNumber}
            activeOpacity={0.6}
          >
            <Text style={styles.editLink}>Edit Phone Number?</Text>
          </TouchableOpacity>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOTPChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't received the OTP? </Text>
            <TouchableOpacity onPress={handleResendOTP} activeOpacity={0.6}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Spacer */}
          <View style={{ height: 80 }} />

          {/* Terms and Privacy Checkbox */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setTermsAccepted(!termsAccepted)}
              activeOpacity={0.7}
            >
              {termsAccepted ? (
                <View style={styles.checkboxChecked}>
                  <Text style={styles.checkmark}>✓</Text>
                </View>
              ) : (
                <View style={styles.checkboxUnchecked} />
              )}
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  Terms of Services
                </Text>
                {' & '}
                <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verify Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            !isFormValid && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={!isFormValid}
          activeOpacity={isFormValid ? 0.8 : 1}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Poppins',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    fontSize: 10,
    opacity: 0.8,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 200,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 8,
  },
  phoneNumber: {
    fontWeight: '600',
    fontFamily: 'Lato',
  },
  editLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Raleway',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#384278',
    fontFamily: 'Raleway',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 8,
    marginTop: 2,
  },
  checkboxUnchecked: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1C1B1F',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#0067A1',
    borderRadius: 2,
    backgroundColor: '#0067A1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 30,
  },
  verifyButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonDisabled: {
    backgroundColor: '#F283AF',
    opacity: 0.2,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Raleway',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});