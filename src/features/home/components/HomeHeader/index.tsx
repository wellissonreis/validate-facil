import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import styles, { primaryGreen } from './style';

export default function HomeHeader() {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  function signOut() {
    setMenuOpen(false);
    const rootNavigation = navigation.getParent()?.getParent() ?? navigation;

    rootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.menuArea}>
        <Pressable
          accessibilityLabel="Abrir menu"
          accessibilityRole="button"
          onPress={() => setMenuOpen((isOpen) => !isOpen)}
          style={({ pressed }) => [styles.menuButton, pressed && styles.menuButtonPressed]}
        >
          <Ionicons color="#202124" name="menu" size={28} />
        </Pressable>

        {menuOpen ? (
          <View style={styles.menu}>
            <Pressable
              onPress={() => setMenuOpen(false)}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Ionicons color="#202124" name="person-circle-outline" size={22} />
              <Text style={styles.menuItemText}>Usuário (Perfil)</Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              onPress={signOut}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Ionicons color="#d93025" name="log-out-outline" size={22} />
              <Text style={[styles.menuItemText, styles.signOutText]}>Sair</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.brand}>
        <MaterialCommunityIcons color={primaryGreen} name="shopping-outline" size={25} />
        <Text style={styles.brandText}>Validade Fácil</Text>
      </View>

      <View style={styles.headerSpacer} />
    </View>
  );
}
