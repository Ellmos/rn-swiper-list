/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { Swiper, type SwiperCardRefType } from '@ellmos/rn-swiper-list';

import { ActionButton } from '../components';

const IMAGES: ImageSourcePropType[] = [
  require('../assets/images/1.jpg'),
  require('../assets/images/1.jpg'),
  require('../assets/images/1.jpg'),
  require('../assets/images/1.jpg'),
  require('../assets/images/1.jpg'),
];

const IMAGES2: ImageSourcePropType[] = [
  require('../assets/images/2.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/2.jpg'),
  require('../assets/images/2.jpg'),
];

const ICON_SIZE = 24;

const App = () => {
  const ref = useRef<SwiperCardRefType>();

  const [data, setData] = useState<ImageSourcePropType[]>(IMAGES);

  const renderCard = useCallback(
    (image: ImageSourcePropType, index: number) => {
      return (
        <>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            index: {index}
          </Text>
          <View style={styles.renderCardContainer}>
            <Image
              source={image}
              style={styles.renderCardImage}
              resizeMode="cover"
            />
          </View>
        </>
      );
    },
    []
  );

  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'green',
          },
        ]}
      />
    );
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      />
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.subContainer}>
        <Swiper
          ref={ref}
          data={data}
          swipeVelocityThreshold={1200}
          disableTopSwipe={true}
          disableBottomSwipe={true}
          cardStyle={styles.cardStyle}
          overlayLabelContainerStyle={styles.overlayLabelContainerStyle}
          renderCard={renderCard}
          onIndexChange={(index) => {
            if (index === 3) {
              setData([...IMAGES, ...IMAGES2]);
            }
          }}
          onSwipeRight={(index: number) => {
            console.log('onSwipeRight: ', index);
          }}
          onSwipeLeft={(index: number) => {
            console.log('onSwipeLeft: ', index);
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <ActionButton
          style={styles.button}
          onTap={() => ref.current?.swipeBack()}
        >
          <AntDesign name="reload1" size={ICON_SIZE} color="white" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => ref.current?.swipeLeft()}
        >
          <AntDesign name="close" size={ICON_SIZE} color="white" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            console.log(ref.current?.activeIndex);
            ref.current?.swipeRight();
          }}
        >
          <AntDesign name="heart" size={ICON_SIZE} color="white" />
        </ActionButton>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    bottom: 34,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    height: 50,
    borderRadius: 40,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  renderCardContainer: {
    borderRadius: 15,
    width: '100%',
    height: '100%',
  },
  cardStyle: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renderCardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    borderRadius: 15,
    height: '90%',
    width: '90%',
  },
  overlayLabelContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
