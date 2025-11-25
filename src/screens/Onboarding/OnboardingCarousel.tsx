/**
 * CalorIA - Onboarding Carousel
 * Horizontal swipeable carousel for onboarding screens
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useNavigation } from '../../utils/navigation';

import { LandingScreen } from './LandingScreen';
import { NutritionalAnalysisScreen } from './NutritionalAnalysisScreen';
import { BodyTransformationScreen } from './BodyTransformationScreen';

const { width: screenWidth } = Dimensions.get('window');

const ONBOARDING_SCREENS = [
  { id: 'landing', component: LandingScreen },
  { id: 'nutritional', component: NutritionalAnalysisScreen },
  { id: 'transformation', component: BodyTransformationScreen },
];

export const OnboardingCarousel = () => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / screenWidth);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SCREENS.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last screen - navigate to Auth
      navigation.navigate('Auth');
    }
  };

  const renderItem = ({ item, index }: { item: typeof ONBOARDING_SCREENS[0]; index: number }) => {
    const ScreenComponent = item.component;
    
    // Pass onNext handler and current index to control carousel navigation
    return (
      <View style={styles.screenContainer}>
        <ScreenComponent onNext={handleNext} carouselIndex={index} totalScreens={ONBOARDING_SCREENS.length} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SCREENS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    width: screenWidth,
    flex: 1,
  },
});

