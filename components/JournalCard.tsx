import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Star, BookOpen } from 'lucide-react-native';
import { SpiritEncounter } from '../store/useFernveil';

interface JournalCardProps {
  encounter: SpiritEncounter;
  onPress?: () => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ encounter, onPress }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Mindfulness': return '#10B981';
      case 'Story': return '#8B5CF6';
      case 'Puzzle': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Mindfulness': return '🧘';
      case 'Story': return '📖';
      case 'Puzzle': return '🧩';
      default: return '✨';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.spiritIcon}>{getTypeIcon(encounter.type)}</Text>
            <Text style={styles.spiritName}>{encounter.spiritName}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(encounter.type) }]}>
            <Text style={styles.typeText}>{encounter.type}</Text>
          </View>
        </View>

        <Text style={styles.task} numberOfLines={2}>
          {encounter.task}
        </Text>

        <View style={styles.rewardRow}>
          <Star color="#F59E0B" size={16} />
          <Text style={styles.reward}>{encounter.reward}</Text>
          <Text style={styles.xp}>+{encounter.xpEarned} XP</Text>
        </View>

        {encounter.personalNote && (
          <View style={styles.noteContainer}>
            <BookOpen color="#64748B" size={14} />
            <Text style={styles.personalNote} numberOfLines={2}>
              "{encounter.personalNote}"
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.dateRow}>
            <Calendar color="#64748B" size={14} />
            <Text style={styles.date}>{formatDate(encounter.date)}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  spiritIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  spiritName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  task: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 12,
    lineHeight: 20,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reward: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
    marginLeft: 6,
    flex: 1,
  },
  xp: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  personalNote: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
});