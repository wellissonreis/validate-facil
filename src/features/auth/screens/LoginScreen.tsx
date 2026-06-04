import { SafeAreaView } from "react-native-safe-area-context";

import LoginHeader from '../components/header/LoginHeader';
import Section from '../components/section/Section';
import styles from "./Style";

export default function LoginScreen() {
    return (
    <SafeAreaView style={styles.container}>
        <LoginHeader></LoginHeader>
        <Section></Section>
    </SafeAreaView>
    );
}

