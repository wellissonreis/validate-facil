import { Pressable, StyleSheet, Text, View } from 'react-native';

export type PeriodOption = 7 | 15 | 30;

type PeriodFilterProps = {
  selectedPeriod: PeriodOption;
  onSelectPeriod: (period: PeriodOption) => void;
};

const periods: PeriodOption[] = [7, 15, 30];
const primaryGreen = '#05b163';

export default function PeriodFilter({ selectedPeriod, onSelectPeriod }: PeriodFilterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        {periods.map((period) => {
          const selected = selectedPeriod === period;

          return (
            <Pressable
              key={period}
              onPress={() => onSelectPeriod(period)}
              style={({ pressed }) => [
                styles.button,
                selected && styles.selectedButton,
                pressed && !selected && styles.pressedButton,
              ]}
            >
              <Text style={[styles.buttonText, selected && styles.selectedButtonText]}>
                {period} dias
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.description}>
        Exibindo produtos que vencem em até {selectedPeriod} dias
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#edf0f2',
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    flex: 1,
    height: 44,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#30343a',
    fontSize: 14,
    fontWeight: '800',
  },
  buttons: {
    columnGap: 10,
    flexDirection: 'row',
  },
  container: {
    backgroundColor: '#ffffff',
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  description: {
    color: '#6f747b',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 13,
  },
  pressedButton: {
    backgroundColor: '#f5fbf8',
  },
  selectedButton: {
    backgroundColor: primaryGreen,
    borderColor: primaryGreen,
    shadowColor: primaryGreen,
    shadowOpacity: 0.18,
  },
  selectedButtonText: {
    color: '#ffffff',
  },
});
