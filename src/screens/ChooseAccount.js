// ChooseAccount.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function ChooseAccount({ navigation, route }) {
  const [selectedAccountType, setSelectedAccountType] = useState(null);
  const insets = useSafeAreaInsets();
  const language = route?.params?.language || 'en';

  const handleAccountSelection = (accountType) => {
    setSelectedAccountType(accountType);
  };

  const handleContinue = () => {
    if (!selectedAccountType) return;

    if (selectedAccountType === 'provider') {
      navigation.navigate('ProviderSignUp', {
        language,
        accountType: 'provider',
      });
    } else if (selectedAccountType === 'user') {
      navigation.navigate('UserSignUp', {
        language,
        accountType: 'user',
      });
    }
  };


  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />


      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TOP LOGO */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/AccountIcon_bg.png')}
            style={styles.mainLogo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose Your Account</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Let's get started with your profile!</Text>

        {/* Description */}
        <Text style={styles.description}>
          Tell us who you are.{'\n'}Are you here to find the right expert or share your skills.
        </Text>

        <View style={styles.divider} />

        {/* Cards */}
        <View style={styles.cardsContainer}>

          {/* Provider Card */}
          <TouchableOpacity
            style={[
              styles.accountCard,
              selectedAccountType === 'provider' && styles.accountCardSelected,
            ]}
            onPress={() => handleAccountSelection('provider')}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/AccountIcon_provider.png')}
                style={styles.cardIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.cardTitle}>I am a provider:</Text>
            <Text style={styles.cardDescription}>
              Manage and deliver your services
            </Text>
          </TouchableOpacity>

          {/* User Card */}
          <TouchableOpacity
            style={[
              styles.accountCard,
              selectedAccountType === 'user' && styles.accountCardSelected,
            ]}
            onPress={() => handleAccountSelection('user')}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={require('../../assets/AccountIcon_user.png')}
                style={styles.cardIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.cardTitle}>I am a user:</Text>
            <Text style={styles.cardDescription}>
              Explore and book trusted providers
            </Text>
          </TouchableOpacity>

        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedAccountType && styles.continueButtonDisabled,
          ]}
          disabled={!selectedAccountType}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>
            Continue <Text style={styles.continueArrow}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

/* ------------------ STYLES ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F9',
  },

  header: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  timeText: { fontSize: 10, fontWeight: '600' },
  iconGroup: { flexDirection: 'row', gap: 8 },
  icon: { fontSize: 10, opacity: 0.8 },

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 50,
  },
  backIcon: { fontSize: 26, fontWeight: 'bold', color: '#000' },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 180,
  },

  // Top Illustration
  illustrationContainer: {
    width: 180,
    height: 180,
    alignSelf: 'center',
    marginBottom: 20,
  },
  mainLogo: { width: '100%', height: '100%' },

  // Titles
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 32,
  },

  // Cards
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  accountCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    minHeight: 300,
  },
  accountCardSelected: {
    borderColor: '#F283AF',
    borderWidth: 2,
    backgroundColor: '#FFF8FC',
  },

  iconWrapper: {
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: { width: 60, height: 60 },

  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Continue Button
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 24,
  },
  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
  },
  continueButtonDisabled: { opacity: 0.2 },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  continueArrow: { fontSize: 18 },

  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'center',
  },
});
