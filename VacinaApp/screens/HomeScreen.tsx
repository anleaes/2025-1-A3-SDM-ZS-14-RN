import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const HomeScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Bem-vindo ao VacinaApp!</Text>
    <Text>Use o menu lateral para navegar.</Text>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    }
})

export default HomeScreen;