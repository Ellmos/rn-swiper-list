import React, { useImperativeHandle, useState, type ForwardedRef } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import type {
  SwiperCardRefType,
  SwiperOptions,
  SwiperCardOptions,
} from 'rn-swiper-list';

import useSwipeControls from './hooks/useSwipeControls';
import SwiperCard from './SwiperCard';
import type { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

const { width: windowWidth, height: windowHeight } = Dimensions.get('screen');

const SWIPE_SPRING_CONFIG: SpringConfig = {
  damping: 20,
  stiffness: 50,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.0001,
  restSpeedThreshold: 0.0001,
};

const Swiper = <T,>(
  {
    data,
    renderCard,
    prerenderItems = data.length - 1,
    onSwipeRight,
    onSwipeLeft,
    onSwipedAll,
    onSwipeTop,
    onSwipeBottom,
    onIndexChange,
    cardStyle,
    flippedCardStyle,
    regularCardStyle,
    disableRightSwipe,
    disableLeftSwipe,
    disableTopSwipe,
    disableBottomSwipe,
    translateXRange = [-windowWidth / 3, 0, windowWidth / 3],
    translateYRange = [-windowHeight / 3, 0, windowHeight / 3],
    rotateInputRange = [-windowWidth / 3, 0, windowWidth / 3],
    rotateOutputRange = [-Math.PI / 20, 0, Math.PI / 20],
    inputOverlayLabelRightOpacityRange = [0, windowWidth / 3],
    outputOverlayLabelRightOpacityRange = [0, 1],
    inputOverlayLabelLeftOpacityRange = [0, -(windowWidth / 3)],
    outputOverlayLabelLeftOpacityRange = [0, 1],
    inputOverlayLabelTopOpacityRange = [0, -(windowHeight / 3)],
    outputOverlayLabelTopOpacityRange = [0, 1],
    inputOverlayLabelBottomOpacityRange = [0, windowHeight / 3],
    outputOverlayLabelBottomOpacityRange = [0, 1],
    OverlayLabelRight,
    OverlayLabelLeft,
    OverlayLabelTop,
    OverlayLabelBottom,
    onSwipeStart,
    onSwipeActive,
    onSwipeEnd,
    swipeBackXSpringConfig = SWIPE_SPRING_CONFIG,
    swipeBackYSpringConfig = SWIPE_SPRING_CONFIG,
    swipeRightSpringConfig = SWIPE_SPRING_CONFIG,
    swipeLeftSpringConfig = SWIPE_SPRING_CONFIG,
    swipeTopSpringConfig = SWIPE_SPRING_CONFIG,
    swipeBottomSpringConfig = SWIPE_SPRING_CONFIG,
    loop = false,
    keyExtractor,
    onPress,
    swipeVelocityThreshold,
    FlippedContent,
    direction = 'y',
    flipDuration = 500,
    overlayLabelContainerStyle,
  }: SwiperOptions<T>,
  ref: ForwardedRef<SwiperCardRefType>
) => {
  const {
    activeIndex,
    refs,
    swipeRight,
    swipeLeft,
    swipeBack,
    swipeTop,
    swipeBottom,
    flipCard,
  } = useSwipeControls(data, loop);

  const [reactIndex, setReactIndex] = useState(0);

  useImperativeHandle(
    ref,
    () => {
      return {
        swipeLeft,
        swipeRight,
        swipeBack,
        swipeTop,
        swipeBottom,
        flipCard,
        activeIndex: reactIndex,
      };
    },
    [
      swipeLeft,
      swipeRight,
      swipeBack,
      swipeTop,
      swipeBottom,
      flipCard,
      reactIndex,
    ]
  );

  useAnimatedReaction(
    () => {
      return activeIndex.value >= data.length;
    },
    (isSwipingFinished: boolean) => {
      if (isSwipingFinished && onSwipedAll) {
        runOnJS(onSwipedAll)();
      }
    },
    [data]
  );

  //Listen to the activeIndex value
  useAnimatedReaction(
    () => {
      return activeIndex.value;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onIndexChange) {
        runOnJS(onIndexChange)(currentValue);
        runOnJS(setReactIndex)(currentValue);
      }
    },
    []
  );

  const Card = SwiperCard as unknown as React.ComponentType<
    React.PropsWithChildren<SwiperCardOptions<T>> & {
      ref?: React.Ref<SwiperCardRefType>;
    }
  >;

  return data
    .map((item, index) => {
      if (index - reactIndex >= 5) return null;

      return (
        <Card
          key={keyExtractor ? keyExtractor(item, index) : index}
          cardStyle={cardStyle}
          flippedCardStyle={flippedCardStyle}
          regularCardStyle={regularCardStyle}
          index={index}
          prerenderItems={prerenderItems}
          disableRightSwipe={disableRightSwipe}
          disableLeftSwipe={disableLeftSwipe}
          disableTopSwipe={disableTopSwipe}
          disableBottomSwipe={disableBottomSwipe}
          translateXRange={translateXRange}
          translateYRange={translateYRange}
          rotateOutputRange={rotateOutputRange}
          rotateInputRange={rotateInputRange}
          inputOverlayLabelRightOpacityRange={
            inputOverlayLabelRightOpacityRange
          }
          outputOverlayLabelRightOpacityRange={
            outputOverlayLabelRightOpacityRange
          }
          inputOverlayLabelLeftOpacityRange={inputOverlayLabelLeftOpacityRange}
          outputOverlayLabelLeftOpacityRange={
            outputOverlayLabelLeftOpacityRange
          }
          inputOverlayLabelTopOpacityRange={inputOverlayLabelTopOpacityRange}
          outputOverlayLabelTopOpacityRange={outputOverlayLabelTopOpacityRange}
          inputOverlayLabelBottomOpacityRange={
            inputOverlayLabelBottomOpacityRange
          }
          outputOverlayLabelBottomOpacityRange={
            outputOverlayLabelBottomOpacityRange
          }
          activeIndex={activeIndex}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelTop={OverlayLabelTop}
          OverlayLabelBottom={OverlayLabelBottom}
          ref={refs[index]}
          onSwipeRight={(cardIndex: number) => {
            onSwipeRight?.(cardIndex);
          }}
          onSwipeLeft={(cardIndex: number) => {
            onSwipeLeft?.(cardIndex);
          }}
          onSwipeTop={(cardIndex: number) => {
            onSwipeTop?.(cardIndex);
          }}
          onSwipeBottom={(cardIndex: number) => {
            onSwipeBottom?.(cardIndex);
          }}
          FlippedContent={FlippedContent}
          onSwipeStart={onSwipeStart}
          onSwipeActive={onSwipeActive}
          onSwipeEnd={onSwipeEnd}
          swipeBackXSpringConfig={swipeBackXSpringConfig}
          swipeBackYSpringConfig={swipeBackYSpringConfig}
          swipeRightSpringConfig={swipeRightSpringConfig}
          swipeLeftSpringConfig={swipeLeftSpringConfig}
          swipeTopSpringConfig={swipeTopSpringConfig}
          swipeBottomSpringConfig={swipeBottomSpringConfig}
          onPress={onPress}
          swipeVelocityThreshold={swipeVelocityThreshold}
          item={item}
          direction={direction}
          flipDuration={flipDuration}
          overlayLabelContainerStyle={overlayLabelContainerStyle}
        >
          {renderCard(item, index)}
        </Card>
      );
    })
    .reverse(); // to render cards in same hierarchy as their z-index
};

function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(render) as any;
}

export default fixedForwardRef(Swiper);
