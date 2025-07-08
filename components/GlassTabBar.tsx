import { BlurView } from 'expo-blur'
import { View, Pressable, Text, Platform } from 'react-native'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Chrome as Home, Camera, BookOpen, User } from 'lucide-react-native'
import { useColorScheme } from 'react-native'

const icons = {
  index: Home,
  ar: Camera,
  journal: BookOpen,
  profile: User,
}

export default function GlassTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets()
  const scheme = useColorScheme()
  const isDark = scheme === 'dark'

  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: insets.bottom + 10,
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
        zIndex: 999,
      }}
    >
      <BlurView
        intensity={80}
        tint={isDark ? 'dark' : 'light'}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 16,
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.6)'
            : 'rgba(255,255,255,0.3)',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const Icon = icons[route.name as keyof typeof icons] || Home

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={{ alignItems: 'center', gap: 4 }}
            >
              <Icon
                size={22}
                strokeWidth={2}
                color={isFocused ? '#10B981' : '#94A3B8'}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  fontFamily: 'Inter-SemiBold',
                  color: isFocused ? '#10B981' : '#64748B',
                }}
              >
                {options.title}
              </Text>
            </Pressable>
          )
        })}
      </BlurView>
    </View>
  )
}