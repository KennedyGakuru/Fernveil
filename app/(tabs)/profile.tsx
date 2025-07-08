import React, { useState, useEffect, useRef } from 'react';
import { View,Text,StyleSheet,ScrollView,TouchableOpacity,Switch,Alert,Animated,Dimensions,Image,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Volume2, VolumeX, RefreshCw, Download, Info, Heart, Shield,BookOpen,Sparkles,Award,Calendar,Star} from 'lucide-react-native';
import { AnimatedBackground } from '.../../components/AnimatedBackground';
import { SpiritAvatar } from '.../../components/SpiritAvatar';
import { useFernveil } from '.../../store/useFernveil';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { 
    soundEnabled, 
    toggleSound, 
    resetData, 
    xp, 
    spiritBondLevel, 
    journal 
  } = useFernveil();
  
  const [isInitialized, setIsInitialized] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100);
  }, []);

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your spirit encounters, journal entries, and progress. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset All Data',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            Alert.alert(
              'Data Reset Complete',
              'Your journey begins anew. The forest spirits await your return.',
              [{ text: 'Start Fresh', style: 'default' }]
            );
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    const exportData = {
      xp,
      spiritBondLevel,
      journalCount: journal.length,
      encounters: journal.map(encounter => ({
        spiritName: encounter.spiritName,
        type: encounter.type,
        date: encounter.date,
        personalNote: encounter.personalNote,
      })),
      exportDate: new Date().toISOString(),
    };

    Alert.alert(
      'Export Journey Data',
      `Your Fernveil journey includes ${journal.length} spirit encounters and ${xp} XP earned. In a full version, this would save your data to your device.`,
      [
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const nextLevelXp = spiritBondLevel * 100;
  const progressPercentage = (xp % 100) / 100;
  const mindfulnessCount = journal.filter(e => e.type === 'Mindfulness').length;
  const storyCount = journal.filter(e => e.type === 'Story').length;
  const puzzleCount = journal.filter(e => e.type === 'Puzzle').length;

  const settingsSections = [
    {
      title: 'Audio & Experience',
      items: [
        {
          icon: soundEnabled ? Volume2 : VolumeX,
          title: 'Forest Sounds',
          description: 'Ambient nature sounds and spirit voices',
          type: 'toggle',
          value: soundEnabled,
          onToggle: toggleSound,
          color: '#10B981',
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: Download,
          title: 'Export Journey',
          description: 'Save your Fernveil experiences',
          type: 'action',
          onPress: handleExportData,
          color: '#3B82F6',
        },
        {
          icon: RefreshCw,
          title: 'Reset All Data',
          description: 'Start your journey anew',
          type: 'action',
          onPress: handleResetData,
          color: '#EF4444',
        },
      ],
    },
    {
      title: 'About Fernveil',
      items: [
        {
          icon: Info,
          title: 'Version',
          description: '1.0.0 Beta',
          type: 'info',
          color: '#64748B',
        },
        {
          icon: Heart,
          title: 'Made with Care',
          description: 'Connecting you with nature\'s hidden wisdom',
          type: 'info',
          color: '#EC4899',
        },
        {
          icon: Shield,
          title: 'Privacy',
          description: 'All data stays on your device',
          type: 'info',
          color: '#10B981',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <User color="#10B981" size={28} />
            <Text style={styles.title}>Profile</Text>
          </View>
          <Text style={styles.subtitle}>
            Your spiritual journey through Fernveil
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.15)', 'rgba(6, 95, 70, 0.15)']}
              style={styles.profileGradient}
            >
              <View style={styles.profileHeader}>
                <SpiritAvatar size={80} isActive={true} spiritName="Forest Guardian" />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>Forest Walker</Text>
                  <Text style={styles.profileLevel}>Spirit Bond Level {spiritBondLevel}</Text>
                </View>
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
                <Text style={styles.xpText}>{xp % 100}/{100} XP to next level</Text>
              </View>
              
              <Text style={styles.totalXpText}>Total XP: {xp}</Text>
            </LinearGradient>
          </View>

          {/* Journey Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Journey Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(16, 185, 129, 0.15)', 'rgba(6, 95, 70, 0.15)']}
                  style={styles.statGradient}
                >
                  <BookOpen color="#10B981" size={20} />
                  <Text style={styles.statNumber}>{journal.length}</Text>
                  <Text style={styles.statLabel}>Total Encounters</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.15)', 'rgba(124, 58, 237, 0.15)']}
                  style={styles.statGradient}
                >
                  <Star color="#8B5CF6" size={20} />
                  <Text style={styles.statNumber}>{mindfulnessCount}</Text>
                  <Text style={styles.statLabel}>Mindfulness</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.15)']}
                  style={styles.statGradient}
                >
                  <Award color="#F59E0B" size={20} />
                  <Text style={styles.statNumber}>{storyCount}</Text>
                  <Text style={styles.statLabel}>Stories</Text>
                </LinearGradient>
              </View>

              <View style={styles.statCard}>
                <LinearGradient
                  colors={['rgba(239, 68, 68, 0.15)', 'rgba(220, 38, 38, 0.15)']}
                  style={styles.statGradient}
                >
                  <Sparkles color="#EF4444" size={20} />
                  <Text style={styles.statNumber}>{puzzleCount}</Text>
                  <Text style={styles.statLabel}>Puzzles</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Settings color="#64748B" size={16} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.settingItem,
                      itemIndex === section.items.length - 1 && styles.settingItemLast,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={item.type === 'action' ? 0.7 : 1}
                    disabled={item.type !== 'action'}
                  >
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.settingItemGradient}
                    >
                      <View style={styles.settingItemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                          <item.icon color={item.color} size={20} strokeWidth={2} />
                        </View>
                        <View style={styles.settingItemContent}>
                          <Text style={styles.settingItemTitle}>{item.title}</Text>
                          <Text style={styles.settingItemDescription}>{item.description}</Text>
                        </View>
                      </View>
                      
                      {item.type === 'toggle' && (
                        <Switch
                          value={'value' in item ? item.value : false}
                          onValueChange={'onToggle' in item ? item.onToggle : undefined}
                          trackColor={{ false: '#374151', true: '#10B98180' }}
                          thumbColor={'value' in item && item.value ? '#10B981' : '#9CA3AF'}
                          ios_backgroundColor="#374151"
                        />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Footer Quote */}
          <View style={styles.footerQuote}>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
    fontFamily: 'Cinzel-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  profileGradient: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  profileLevel: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
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
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statGradient: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  settingItemDescription: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  footerQuote: {
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
  },
  quote: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
});