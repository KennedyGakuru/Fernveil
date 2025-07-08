import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,Dimensions,Animated,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Camera, BookOpen, Zap } from 'lucide-react-native';
import { AnimatedBackground } from '.../../components/AnimatedBackground';
import { SpiritAvatar } from '.../../components/SpiritAvatar';
import { useFernveil } from '.../../store/useFernveil';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { xp, spiritBondLevel, journal } = useFernveil();
  const [isInitialized, setIsInitialized] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
    setTimeout(() => {
      setIsInitialized(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  }, []);

  const nextLevelXp = spiritBondLevel * 100;
  const progressPercentage = (xp % 100) / 100;

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.titleText}>Fernveil</Text>
            <Text style={styles.subtitleText}>
              Where forest spirits await your presence
            </Text>
          </View>

          {/* Spirit Bond Level Card */}
          <View style={styles.spiritBondCard}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.15)', 'rgba(6, 95, 70, 0.15)']}
              style={styles.spiritBondGradient}
            >
              <View style={styles.spiritBondHeader}>
                <Zap color="#10B981" size={20} />
                <Text style={styles.spiritBondTitle}>Spirit Bond Level {spiritBondLevel}</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: `${progressPercentage * 100}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.xpText}>{xp % 100}/{100} XP</Text>
              </View>
              
              <Text style={styles.totalXpText}>Total XP: {xp}</Text>
            </LinearGradient>
          </View>

          {/* Spirit Avatar */}
          <View style={styles.spiritSection}>
            <SpiritAvatar size={140} isActive={true} spiritName="Forest Guardian" />
            <Text style={styles.spiritStatusText}>
              {journal.length === 0 
                ? "The forest spirits sense your arrival..." 
                : `You've connected with ${journal.length} spirit${journal.length !== 1 ? 's' : ''}`
              }
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.mainActionButton}
              onPress={() => router.push('/ar')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#065F46']}
                style={styles.mainActionGradient}
              >
                <Camera color="#FFFFFF" size={24} strokeWidth={2} />
                <Text style={styles.mainActionText}>Enter Spirit Vision</Text>
                <Sparkles color="#FFFFFF" size={16} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionButton}
              onPress={() => router.push('/journal')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.secondaryActionGradient}
              >
                <BookOpen color="#FFFFFF" size={20} />
                <Text style={styles.secondaryActionText}>
                  View Journal ({journal.length})
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Recent Encounters Preview */}
          {journal.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent Encounters</Text>
              <View style={styles.recentGrid}>
                {journal.slice(-3).reverse().map((encounter, index) => (
                  <View key={encounter.id} style={styles.recentItem}>
                    <Text style={styles.recentSpirit}>{encounter.spiritName.split(',')[0]}</Text>
                    <Text style={styles.recentType}>{encounter.type}</Text>
                    <Text style={styles.recentXp}>+{encounter.xpEarned} XP</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Inspirational Quote */}
          <View style={styles.quoteSection}>
            <Text style={styles.quote}>
              "In every walk with nature, one receives far more than they seek."
            </Text>
            <Text style={styles.quoteAuthor}>— John Muir</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  titleText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Cinzel-SemiBold',
    marginBottom: 8,
    textShadowColor: 'rgba(16, 185, 129, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spiritBondCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  spiritBondGradient: {
    padding: 20,
  },
  spiritBondHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  spiritBondTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  xpText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  totalXpText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  spiritSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  spiritStatusText: {
    fontSize: 16,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    maxWidth: width * 0.8,
    lineHeight: 24,
  },
  actionSection: {
    marginBottom: 32,
  },
  mainActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  mainActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mainActionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 12,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  secondaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  secondaryActionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  recentSection: {
    marginBottom: 32,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  recentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  recentItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    width: '31%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentSpirit: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  recentType: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  recentXp: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  quoteSection: {
    alignItems: 'center',
    paddingTop: 20,
  },
  quote: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
});