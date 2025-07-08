import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sparkles, Eye, RotateCcw, Scan } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { SpiritEncounterModal } from '.../../components/SpiritEncounterModal';
import { SpiritAvatar } from '.../../components/SpiritAvatar';
import { useFernveil } from '.../../store/useFernveil';
import { getRandomSpirit } from '.../../utils/mockSpiritData';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Define the SpiritEncounter type
interface SpiritEncounter {
  id: string;
  name: string;
  type: string;
  description?: string;
  rarity?: string;
  avatar?: string;
}

const FernveilARScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back');
  const [isScanning, setIsScanning] = useState(false);
  const [scanLineY] = useState(new Animated.Value(0));
  const [spiritFound, setSpiritFound] = useState<SpiritEncounter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Extract the needed functions from the store (adjust based on your actual store structure)
  const fernveilStore = useFernveil();
  const setCurrentSpirit = fernveilStore.setCurrentSpirit || ((spirit: SpiritEncounter) => {
    console.log('Setting current spirit:', spirit);
  });

  useEffect(() => {
    if (isScanning) {
      animateScanLine();
      const scanTimeout = setTimeout(() => {
        const spirit = getRandomSpirit();
        setSpiritFound(spirit);
        setIsScanning(false);
        setModalVisible(true);
        setCurrentSpirit(spirit);
      }, 4000);

      // Cleanup timeout on unmount or when scanning stops
      return () => clearTimeout(scanTimeout);
    }
  }, [isScanning]);

  const animateScanLine = () => {
    scanLineY.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineY, {
          toValue: height - 200,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleScanPress = () => {
    setIsScanning(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleCameraFlip = () => {
    setCameraFacing(prev => prev === 'back' ? 'front' : 'back');
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleSpiritInteract = () => {
    setModalVisible(true);
  };

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1">
        <LinearGradient
          colors={["#0f172a", "#1e293b"]}
          className="flex-1 justify-center items-center px-10"
        >
          <Text className="text-2xl font-bold text-white text-center mt-6 mb-4">
            Camera Permission Needed
          </Text>
          <Text className="text-base text-slate-400 text-center leading-6 mb-8">
            To scan and discover spirits, please allow camera access.
          </Text>
          <TouchableOpacity onPress={requestPermission} className="rounded-xl overflow-hidden">
            <LinearGradient
              colors={["#10B981", "#059669"]}
              className="px-8 py-4"
            >
              <Text className="text-white font-semibold text-base">Allow Camera</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView style={{ flex: 1 }} facing={cameraFacing} />
      
      {/* Header Controls */}
      <View className="absolute top-16 left-5 right-5 flex-row justify-between items-center">
        <TouchableOpacity onPress={handleGoBack} className="rounded-full overflow-hidden">
          <BlurView intensity={40} tint="dark" className="p-3">
            <X color="white" size={24} />
          </BlurView>
        </TouchableOpacity>
        
        <View className="rounded-full overflow-hidden">
          <BlurView intensity={40} tint="dark" className="px-4 py-2 items-center">
            <Text className="text-white font-semibold text-lg">Spirit Scan</Text>
            <Text className="text-emerald-400 text-xs">AR Mode</Text>
          </BlurView>
        </View>
        
        <TouchableOpacity onPress={handleCameraFlip} className="rounded-full overflow-hidden">
          <BlurView intensity={40} tint="dark" className="p-3">
            <RotateCcw color="white" size={24} />
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Scan Controls */}
      <View className="absolute bottom-28 w-full items-center">
        {isScanning ? (
          <View className="rounded-xl overflow-hidden">
            <BlurView intensity={40} tint="dark" className="px-6 py-4 items-center">
              <Text className="text-white text-base mb-3">Scanning for Spirits...</Text>
              <View className="flex-row">
                {[0, 1, 2].map((dot, index) => (
                  <View key={index} className="w-2 h-2 rounded-full bg-emerald-500 mx-1" />
                ))}
              </View>
            </BlurView>
          </View>
        ) : spiritFound ? (
          <TouchableOpacity onPress={handleSpiritInteract} className="rounded-xl overflow-hidden">
            <BlurView intensity={40} tint="dark" className="flex-row items-center px-6 py-4">
              <Sparkles color="#10B981" size={20} />
              <Text className="text-emerald-400 font-semibold text-base ml-2">Spirit Detected!</Text>
            </BlurView>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleScanPress} className="rounded-full overflow-hidden shadow-md shadow-emerald-500">
            <LinearGradient colors={["#10B981", "#059669"]} className="flex-row items-center px-6 py-4">
              <Scan color="white" size={20} />
              <Text className="text-white font-semibold text-base ml-2">Start Spirit Scan</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Animated Scan Line */}
      {isScanning && (
        <Animated.View
          style={{
            transform: [{ translateY: scanLineY }],
          }}
          className="absolute left-0 right-0 h-[3px] bg-emerald-500 shadow shadow-emerald-500"
        />
      )}

      {/* Spirit Display */}
      {spiritFound && (
        <View className="absolute top-[30%] left-[50%] -ml-[60px] items-center">
          <SpiritAvatar {...spiritFound} />
          <View className="mt-4 items-center bg-black/80 rounded-xl px-4 py-3 border-2 border-emerald-500">
            <Text className="text-white text-sm font-semibold mb-1 text-center">{spiritFound.name}</Text>
            <Text className="text-emerald-400 text-xs mb-2">{spiritFound.type}</Text>
            <TouchableOpacity onPress={handleSpiritInteract} className="flex-row items-center bg-emerald-500/30 px-3 py-1 rounded-lg">
              <Text className="text-white text-xs mr-1">Interact</Text>
              <Eye size={14} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Spirit Encounter Modal */}
      {spiritFound && (
        <SpiritEncounterModal 
          visible={modalVisible} 
          spirit={spiritFound} 
          onClose={handleModalClose} 
        />
      )}
    </View>
  );
};

export default FernveilARScreen;