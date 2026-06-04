import { SafeAreaView } from "react-native-safe-area-context";

import LoginFooter from '../components/footer/LoginFooter';
import LoginHeader from '../components/header/LoginHeader';
import Section from '../components/section/Section';
import styles from "./Style";

export default function LoginScreen() {
    return (
    <SafeAreaView style={styles.container}>
        <LoginHeader></LoginHeader>
        <Section></Section>
        <LoginFooter></LoginFooter>
    </SafeAreaView>
    );
}

