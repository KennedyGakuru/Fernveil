import React, { useState, useEffect, useRef } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,Modal,Animated,Dimensions,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { X, CheckCircle } from 'lucide-react-native';
import { SpiritAvatar } from './SpiritAvatar';
import { SpiritEncounter } from '../store/useFernveil';

interface SpiritEncounterModalProps {
  visible: boolean;
  encounter: SpiritEncounter | null;
  onComplete: (personalNote: string) => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export const SpiritEncounterModal: React.FC<SpiritEncounterModalProps> = ({
  visible,
  encounter,
  onComplete,
  onClose,
}) => {
  const [personalNote, setPersonalNote] = useState('');
  const [showReward, setShowReward] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setShowReward(false);
      setPersonalNote('');
    }
  }, [visible]);

  const handleComplete = () => {
    setShowReward(true);
    setTimeout(() => {
      onComplete(personalNote);
    }, 2000);
  };

  if (!encounter) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={20} style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(15, 23, 42, 0.95)', 'rgba(30, 41, 59, 0.95)']}
            style={styles.modalContent}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <View style={styles.header}>
              <SpiritAvatar size={100} spiritName={encounter.spiritName} isActive />
              <Text style={styles.spiritName}>{encounter.spiritName}</Text>
              <Text style={styles.encounterType}>{encounter.type} Encounter</Text>
            </View>

            {!showReward ? (
              <View style={styles.taskContainer}>
                <Text style={styles.taskTitle}>Your Task:</Text>
                <Text style={styles.taskText}>{encounter.task}</Text>

                <View style={styles.noteSection}>
                  <Text style={styles.noteLabel}>
                    How did this experience make you feel? (Optional)
                  </Text>
                  <TextInput
                    style={styles.noteInput}
                    placeholder="Share your thoughts..."
                    placeholderTextColor="#64748B"
                    value={personalNote}
                    onChangeText={setPersonalNote}
                    multiline
                    maxLength={200}
                  />
                </View>

                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={handleComplete}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#10B981', '#065F46']}
                    style={styles.completeButtonGradient}
                  >
                    <CheckCircle color="#FFFFFF" size={20} />
                    <Text style={styles.completeButtonText}>I've Completed This Task</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardTitle}>✨ Well Done! ✨</Text>
                <Text style={styles.rewardText}>You've received:</Text>
                <View style={styles.rewardItem}>
                  <Text style={styles.rewardName}>{encounter.reward}</Text>
                  <Text style={styles.xpEarned}>+{encounter.xpEarned} Spirit Bond XP</Text>
                </View>
                <Text style={styles.thankYou}>
                  Thank you for connecting with the forest spirits. Your journey continues...
                </Text>
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  spiritName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  encounterType: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  taskContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
    marginBottom: 24,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  completeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  rewardContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  rewardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardText: {
    fontSize: 16,
    color: '#CBD5E1',
    marginBottom: 16,
  },
  rewardItem: {
    alignItems: 'center',
    marginBottom: 24,
  },
  rewardName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
    textAlign: 'center',
  },
  xpEarned: {
    fontSize: 16,
    color: '#F59E0B',
    fontWeight: '600',
  },
  thankYou: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});