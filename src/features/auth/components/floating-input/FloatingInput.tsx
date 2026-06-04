import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  TextInput,
  TextInputProps,
  View
} from 'react-native';
import styles from './Style';

type FloatingInputProps = TextInputProps & {
  icon: 'user' | 'lock';
  label: string;
};

const inputIcons = {
  user: { ios: 'person', android: 'person', web: 'person' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
} as const;

export default function FloatingInput({
  icon,
  label,
  secureTextEntry,
  value,
  onChangeText,
  ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [labelProgress] = useState(() => new Animated.Value(value ? 1 : 0));
  const isRaised = focused || Boolean(value);
  const hasPasswordToggle = Boolean(secureTextEntry);
  const isPasswordHidden = hasPasswordToggle && !passwordVisible;

  useEffect(() => {
    Animated.timing(labelProgress, {
      toValue: isRaised ? 1 : 0,
      duration: 160,
      useNativeDriver: false,
    }).start();
  }, [isRaised, labelProgress]);

  const labelStyle = {
    fontSize: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    top: labelProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [24, 12],
    }),
  };

  return (
    <View style={[styles.inputContainer, focused && styles.inputContainerFocused]}>
      <View style={styles.icon}>
        <SymbolView
          name={inputIcons[icon]}
          size={26}
          tintColor="#60646C"
        />
      </View>
      <Animated.Text style={[styles.inputLabel, labelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        {...props}
        autoCapitalize="none"
        onBlur={(event) => {
          setFocused(false);
          props.onBlur?.(event);
        }}
        onChangeText={onChangeText}
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        placeholder=""
        placeholderTextColor="#60646C"
        secureTextEntry={isPasswordHidden}
        style={[styles.input, hasPasswordToggle && styles.inputWithAction]}
        value={value}
      />
      {hasPasswordToggle && (
        <Pressable
          accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setPasswordVisible((current) => !current)}
          style={styles.passwordToggle}
        >
          <SymbolView
            name={
              passwordVisible
                ? { ios: 'eye', android: 'visibility', web: 'visibility' }
                : { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }
            }
            size={24}
            tintColor="#60646C"
          />
        </Pressable>
      )}
    </View>
  );
}
