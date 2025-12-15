//LanguageSelection.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// 🟢 Corrected Indian Language Support
const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी (Hindi)' },
  { id: 'bn', name: 'বাংলা (Bengali)' },
  { id: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { id: 'ta', name: 'தமிழ் (Tamil)' },
  { id: 'te', name: 'తెలుగు (Telugu)' },
  { id: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { id: 'mr', name: 'मराठी (Marathi)' },
];

export default function LanguageSelection({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setDropdownVisible(false);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate('ChooseAccount', { language: selectedLanguage.id });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={false}>
        
        {/* Logo */}
        <Image
          source={require('../../assets/languageSelectionLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Choose Your Language</Text>

        {/* Language Dropdown */}
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownButtonText}>
              {selectedLanguage ? selectedLanguage.name : 'Select your language'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>

          {dropdownVisible && (
            <View style={styles.dropdownMenu}>
              <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                {languages.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.dropdownItem,
                      selectedLanguage?.id === item.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => handleLanguageSelect(item)}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedLanguage?.id === item.id && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <MeditationIllustration />
        </View>

      </ScrollView>

      {/* Wave Bottom */}
      <View style={styles.waveContainer}>
        <View style={styles.wave} />
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedLanguage && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedLanguage}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            Continue <Text style={styles.continueArrow}>›</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

/* -------------------------------------------------------
   Restore the MeditationIllustration Component (MUST HAVE)
----------------------------------------------------------*/

function MeditationIllustration() {
  return (
    <View style={styles.svgContainer}>
      <View style={[styles.circle, styles.lightBlueCircle]} />

      {/* Left Leaves */}
      <View style={[styles.leaf, styles.leftLeaf1]} />
      <View style={[styles.leaf, styles.leftLeaf2]} />
      <View style={[styles.leaf, styles.leftLeaf3]} />

      {/* Right Leaves */}
      <View style={[styles.leaf, styles.rightLeaf1]} />
      <View style={[styles.leaf, styles.rightLeaf2]} />
      <View style={[styles.leaf, styles.rightLeaf3]} />

      {/* Orange Accent Circles */}
      <View style={[styles.accentCircle, styles.accentLeft]} />
      <View style={[styles.accentCircle, styles.accentRight]} />

      {/* Person */}
      <View style={[styles.head]} />
      <View style={[styles.hairBun]} />
      <View style={[styles.body]} />
      <View style={[styles.heart]} />

      <View style={[styles.arm, styles.armLeft]} />
      <View style={[styles.arm, styles.armRight]} />

      <View style={[styles.leg, styles.legLeft]} />
      <View style={[styles.leg, styles.legRight]} />

      <View style={[styles.shoe, styles.shoeLeft]} />
      <View style={[styles.shoe, styles.shoeRight]} />

      <View style={[styles.meditationBase]} />
    </View>
  );
}

/* --------------------------
      STYLES
-----------------------------*/

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F9' },

  header: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
  },
  timeText: { fontSize: 10, fontWeight: '600', color: '#000' },
  iconGroup: { flexDirection: 'row', gap: 8 },
  icon: { fontSize: 10 },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 180,
  },

  logo: { width: 180, height: 80, marginBottom: 20 },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 32,
  },

  dropdownContainer: { width: '100%', marginBottom: 32 },

  dropdownButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },

  dropdownButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
  dropdownIcon: { fontSize: 12, fontWeight: 'bold' },

  dropdownMenu: {
    position: 'absolute',
    top: 60, left: 0, right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
    maxHeight: 200,
    zIndex: 100,
  },

  dropdownScroll: { maxHeight: 200 },

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemSelected: { backgroundColor: '#F5F5F5' },
  dropdownItemText: { fontSize: 16, fontWeight: '600' },
  dropdownItemTextSelected: { color: '#F283AF', fontWeight: '700' },

  illustrationContainer: {
    width: 280,
    height: 280,
    marginVertical: 24,
  },

  svgContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    alignItems: 'center',
  },

  circle: { position: 'absolute', borderRadius: 130 },
  lightBlueCircle: { width: 260, height: 260, backgroundColor: '#C5E1F5', opacity: 0.6 },

  leaf: { width: 30, height: 40, position: 'absolute', backgroundColor: '#003D82', opacity: 0.7 },
  leftLeaf1: { left: 20, top: 40, width: 20, height: 30, transform: [{ rotate: '-30deg' }] },
  leftLeaf2: { left: 10, top: 80, transform: [{ rotate: '-45deg' }] },
  leftLeaf3: { left: 0, top: 130, transform: [{ rotate: '-60deg' }] },

  rightLeaf1: { right: 20, top: 40, width: 20, height: 30, transform: [{ rotate: '30deg' }] },
  rightLeaf2: { right: 10, top: 80, transform: [{ rotate: '45deg' }] },
  rightLeaf3: { right: 0, top: 130, transform: [{ rotate: '60deg' }] },

  accentCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#F5A875', position: 'absolute' },
  accentLeft: { left: 30, bottom: 30 },
  accentRight: { right: 30, bottom: 30 },

  head: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0C4B2', top: 40, position: 'absolute' },
  hairBun: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1C1B1F', top: 20, position: 'absolute' },
  body: { width: 60, height: 70, backgroundColor: '#F0C4B2', top: 100, position: 'absolute', borderRadius: 6 },
  heart: { width: 20, height: 20, backgroundColor: '#F74A60', top: 130, position: 'absolute', borderRadius: 10 },

  arm: { width: 16, height: 56, backgroundColor: '#F0C4B2', top: 80, borderRadius: 8, position: 'absolute' },
  armLeft: { left: 30 },
  armRight: { right: 30 },

  leg: { width: 24, height: 36, backgroundColor: '#1C1B1F', position: 'absolute', top: 150, borderRadius: 12 },
  legLeft: { left: 50 },
  legRight: { right: 50 },

  shoe: { width: 16, height: 12, backgroundColor: '#F5A875', borderRadius: 6, position: 'absolute', bottom: 10 },
  shoeLeft: { left: 55 },
  shoeRight: { right: 55 },

  meditationBase: {
    width: 190,
    height: 90,
    backgroundColor: '#003D82',
    borderRadius: 95,
    position: 'absolute',
    bottom: 0,
  },

  waveContainer: {
    position: 'absolute',
    bottom: 0,
    height: 200,
    backgroundColor: '#F283AF',
    left: 0,
    right: 0,
  },
  wave: { height: 100, backgroundColor: '#F283AF' },

  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 24,
    width: '100%',

  },

  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    borderRadius: 28,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonDisabled: { opacity: 0.2 },

  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  continueArrow: { fontSize: 20 },

  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 190,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignSelf: 'center',
  },
});
