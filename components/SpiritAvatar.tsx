import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SpiritAvatarProps {
  size?: number;
  isActive?: boolean;
  spiritName?: string;
}

export const SpiritAvatar: React.FC<SpiritAvatarProps> = ({ 
  size = 120, 
  isActive = false,
  spiritName = "Unknown Spirit"
}) => {
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const floatAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const floatTranslateY = floatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const getSpiritColor = (name: string): [string, string] => {
    const colors: Record<string, [string, string]> = {
      'Aurelia': ['#10B981', '#059669'],
      'Whisper': ['#8B5CF6', '#7C3AED'],
      'Sage': ['#F59E0B', '#D97706'],
      'Luna': ['#3B82F6', '#2563EB'],
      'Moss': ['#065F46', '#047857'],
    };
    
    const spiritKey = Object.keys(colors).find(key => name.includes(key));
    return colors[spiritKey as keyof typeof colors] || ['#10B981', '#059669'];
  };

  const spiritColors = getSpiritColor(spiritName);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          transform: [{ translateY: floatTranslateY }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.glow,
          {
            width: size + 20,
            height: size + 20,
            opacity: glowOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={[spiritColors[0] + '40', 'transparent']}
          style={styles.glowGradient}
        />
      </Animated.View>
      
      <View style={[styles.avatar, { width: size, height: size }]}>
        <LinearGradient
          colors={spiritColors}
          style={styles.avatarGradient}
        />
        <View style={styles.innerGlow} />
        
        {/* Spirit representation - could be replaced with actual 3D model */}
        <View style={styles.spiritCore}>
          <View style={styles.spiritEssence} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    borderRadius: 1000,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 1000,
  },
  avatar: {
    borderRadius: 1000,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarGradient: {
    flex: 1,
  },
  innerGlow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  spiritCore: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 30,
    height: 30,
    marginTop: -15,
    marginLeft: -15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spiritEssence: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});