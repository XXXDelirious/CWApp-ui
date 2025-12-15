					  

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  Platform,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Indian Language Support
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Status Bar Header */}
      <View style={styles.header}>
        <Text style={styles.timeText}>9:41</Text>
        <View style={styles.iconGroup}>
          <Text style={styles.icon}>📶</Text>
          <Text style={styles.icon}>📡</Text>
          <Text style={styles.icon}>🔋</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
		    {/* Logo */}
        <Image
          source={require('../../assets/languageSelectionLogo.png')}
							 
          style={styles.logo}
          resizeMode="contain"
		    />
	 
        {/* Title Section */}
        <View style={styles.titleContainer}>
								 
          <Text style={styles.title}>Choose Your Language</Text>
        </View>

        {/* Language Dropdown */}
        <View style={styles.dropdownWrapper}>
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

          {/* Dropdown Modal */}
          {dropdownVisible && (
            <View style={styles.dropdownOverlay}>
              <TouchableOpacity
                style={styles.dropdownBackdrop}
                onPress={() => setDropdownVisible(false)}
                activeOpacity={1}
              />
              <View style={styles.dropdownMenu}>
                <FlatList
                  data={languages}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={languages.length > 5}
                  renderItem={({ item }) => (
                    <TouchableOpacity
						 
                      style={[
                        styles.dropdownItem,
                        selectedLanguage?.id === item.id &&
                          styles.dropdownItemSelected,
                      ]}
                      onPress={() => handleLanguageSelect(item)}
                      activeOpacity={0.6}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedLanguage?.id === item.id &&
                            styles.dropdownItemTextSelected,
                        ]}
                      >
                        {item.name}
                      </Text>
                      {selectedLanguage?.id === item.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          )}
        </View>

        {/* Illustration Section - Using Image Asset */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/languageSelectionLogo.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

      </ScrollView>

      {/* Pink Wave Background */}
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
          activeOpacity={selectedLanguage ? 0.8 : 1}
        >
          <Text style={styles.continueButtonText}>
            Continue {selectedLanguage && <Text style={styles.arrow}>›</Text>}
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
					   
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Raleway',
    letterSpacing: 0.5,
  },
  dropdownWrapper: {
    width: '100%',
    marginBottom: 32,
    zIndex: 50,
  },

														 

  dropdownButton: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Raleway',
    flex: 1,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 51,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: -1,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
					 
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 16,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },

									 

  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
							  
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemSelected: {
    backgroundColor: '#FFF0F7',
  },
  dropdownItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    fontFamily: 'Raleway',
    flex: 1,
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
    color: '#F283AF',
  },
  checkmark: {
    color: '#F283AF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  illustrationContainer: {
    width: 300,
    height: 300,
    marginVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationImage: {
				 
    width: '100%',
    height: '100%',
						 
						 
  },

													  
																						 

																								  
																							 
																	  
																	  

																							  
																	   
																	   

																											  
									   
										 

																											   
																												  
																											   
																												 

																											 
						
						  

																											   
						
						  

																												 
						 
						   

				   
			   
			   
							   
					 
						 
			  
	

  waveContainer: {
    position: 'absolute',
    bottom: 0,
				
							   
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#F283AF',
  },
  wave: {
    flex: 1,
    backgroundColor: '#F283AF',
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

  continueButton: {
    backgroundColor: '#F283AF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#F283AF',
    opacity: 0.25,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Raleway',
  },
  arrow: {
    fontSize: 18,
    marginLeft: 8,
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
