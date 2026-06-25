import { Ionicons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from '@/shared/styles/utilityScreenStyle';

export default function MoreRoute() {
  const navigation = useNavigation();

  function signOut() {
    const rootNavigation = navigation.getParent()?.getParent() ?? navigation;

    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.content, localStyles.content]}>
        <View style={styles.iconBox}>
          <Ionicons color="#05b163" name="ellipsis-horizontal" size={34} />
        </View>
        
        <View style={localStyles.profileCard}>
          <Ionicons color="#05b163" name="person-circle-outline" size={42} />
          <View style={localStyles.profileText}>
            <Text style={localStyles.profileName}>Usuário</Text>
            <Text style={localStyles.profileLabel}>Perfil</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={signOut}
          style={({ pressed }) => [localStyles.signOutButton, pressed && localStyles.signOutButtonPressed]}
        >
          <Ionicons color="#ffffff" name="log-out-outline" size={22} />
          <Text style={localStyles.signOutButtonText}>Sair</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
    paddingTop: 54,
  },
  profileCard: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#f7fbf9',
    borderColor: '#d9efe4',
    borderRadius: 8,
    borderWidth: 1,
    columnGap: 12,
    flexDirection: 'row',
    marginTop: 28,
    padding: 16,
  },
  profileLabel: {
    color: '#6f747b',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  profileName: {
    color: '#202124',
    fontSize: 17,
    fontWeight: '800',
  },
  profileText: {
    flex: 1,
  },
  signOutButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#d93025',
    borderRadius: 8,
    columnGap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 14,
  },
  signOutButtonPressed: {
    backgroundColor: '#b3261e',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
