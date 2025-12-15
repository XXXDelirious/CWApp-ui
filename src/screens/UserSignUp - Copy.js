//UserSignUp.js
import React, { useState } from 'react';
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

export default function UserSignUpScreen({ navigation, route }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const insets = useSafeAreaInsets();
  
  const language = route?.params?.language || 'en';
  const accountType = route?.params?.accountType || 'user';

  const isFormValid = phoneNumber.length >= 10 && termsAccepted;

  const handleSendOTP = () => {
    if (isFormValid) {
      // Navigate to OTP verification screen
      navigation.navigate('OTPVerification', {
        language,
        accountType,
        phoneNumber: `+91${phoneNumber}`,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTermsPress = () => {
    // Navigate to Terms of Services screen
    console.log('Navigate to Terms of Services');
  };

  const handlePrivacyPress = () => {
    // Navigate to Privacy Policy screen
    console.log('Navigate to Privacy Policy');
  };

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
          <Text style={styles.title}>Sign Up/Log In</Text>

          {/* Phone Number Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            You will receive and OTP to your number
          </Text>

          {/* Spacer */}
          <View style={{ height: 300 }} />

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
                <Text
                  style={styles.termsLink}
                  onPress={handleTermsPress}
                >
                  Terms of Services
                </Text>
                {' & '}
                <Text
                  style={styles.termsLink}
                  onPress={handlePrivacyPress}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Send OTP Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.sendOTPButton,
            !isFormValid && styles.sendOTPButtonDisabled,
          ]}
          onPress={handleSendOTP}
          disabled={!isFormValid}
          activeOpacity={isFormValid ? 0.8 : 1}
        >
          <Text style={styles.sendOTPButtonText}>Send OTP</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  countryCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Lato',
    marginRight: 8,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    fontFamily: 'Raleway',
    padding: 0,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
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
    borderColor: '#F283AF',
    borderRadius: 2,
    backgroundColor: '#F283AF',
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
  sendOTPButton: {
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
  sendOTPButtonDisabled: {
    backgroundColor: '#F283AF',
    opacity: 0.2,
  },
  sendOTPButtonText: {
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