import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Dimensions,Animated,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Filter, Calendar, Star, Sparkles } from 'lucide-react-native';
import { AnimatedBackground } from '.../../components/AnimatedBackground';
import { JournalCard } from '.../../components/JournalCard';
import { useFernveil } from '.../../store/useFernveil';

const { width } = Dimensions.get('window');

export default function JournalScreen() {
  const { journal, xp, spiritBondLevel } = useFernveil();
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Mindfulness' | 'Story' | 'Puzzle'>('All');
  const [isInitialized, setIsInitialized] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const filteredJournal = journal.filter(entry => 
    selectedFilter === 'All' || entry.type === selectedFilter
  );

  const totalEncounters = journal.length;
  const mindfulnessCount = journal.filter(e => e.type === 'Mindfulness').length;
  const storyCount = journal.filter(e => e.type === 'Story').length;
  const puzzleCount = journal.filter(e => e.type === 'Puzzle').length;

  const filterButtons = [
    { label: 'All', count: totalEncounters },
    { label: 'Mindfulness', count: mindfulnessCount },
    { label: 'Story', count: storyCount },
    { label: 'Puzzle', count: puzzleCount },
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
            <BookOpen color="#10B981" size={28} />
            <Text style={styles.title}>Spirit Journal</Text>
          </View>
          <Text style={styles.subtitle}>
            Your collection of forest encounters
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.15)', 'rgba(6, 95, 70, 0.15)']}
                style={styles.statGradient}
              >
                <Sparkles color="#10B981" size={20} />
                <Text style={styles.statNumber}>{totalEncounters}</Text>
                <Text style={styles.statLabel}>Encounters</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.15)', 'rgba(124, 58, 237, 0.15)']}
                style={styles.statGradient}
              >
                <Star color="#8B5CF6" size={20} />
                <Text style={styles.statNumber}>{xp}</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.15)']}
                style={styles.statGradient}
              >
                <Calendar color="#F59E0B" size={20} />
                <Text style={styles.statNumber}>{spiritBondLevel}</Text>
                <Text style={styles.statLabel}>Bond Level</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterSection}>
          <View style={styles.filterRow}>
            <Filter color="#64748B" size={16} />
            <Text style={styles.filterLabel}>Filter by type:</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterScrollView}
            contentContainerStyle={styles.filterScrollContent}
          >
            {filterButtons.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.label && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(filter.label as any)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === filter.label && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Journal Entries */}
        <ScrollView
          style={styles.journalScrollView}
          contentContainerStyle={styles.journalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredJournal.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen color="#64748B" size={64} />
              <Text style={styles.emptyTitle}>
                {totalEncounters === 0 
                  ? "Your Journey Awaits" 
                  : `No ${selectedFilter === 'All' ? '' : selectedFilter} encounters yet`
                }
              </Text>
              <Text style={styles.emptyDescription}>
                {totalEncounters === 0
                  ? "Discover forest spirits through the Spirit Vision to start building your journal."
                  : `Try using Spirit Vision to find ${selectedFilter === 'All' ? 'more' : selectedFilter.toLowerCase()} spirits.`
                }
              </Text>
            </View>
          ) : (
            <View style={styles.journalList}>
              <Text style={styles.journalHeader}>
                {filteredJournal.length} encounter{filteredJournal.length !== 1 ? 's' : ''} found
              </Text>
              {filteredJournal
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((encounter) => (
                  <JournalCard
                    key={encounter.id}
                    encounter={encounter}
                    onPress={() => {
                      // Could navigate to detailed view
                    }}
                  />
                ))}
            </View>
          )}
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
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
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
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  filterScrollView: {
    flexGrow: 0,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  filterButtonTextActive: {
    color: '#10B981',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  journalScrollView: {
    flex: 1,
  },
  journalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
    fontFamily: 'Inter-SemiBold',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  journalList: {
    flex: 1,
  },
  journalHeader: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
});