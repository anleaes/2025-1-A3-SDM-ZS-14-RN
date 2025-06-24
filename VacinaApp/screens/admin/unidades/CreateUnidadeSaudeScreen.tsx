import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateUnidadeSaude'>;

const CreateUnidadeSaudeScreen = ({ navigation }: Props) => {
  // Estados para cada campo do formulário
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const API_URL = `${API_BASE_URL}unidades-saude/`; // Use o seu IP

  // Função para guardar os dados
  const handleSave = async () => {
    // Validação simples
    if (!nome || !endereco) {
      Alert.alert('Erro', 'Os campos Nome e Endereço são obrigatórios.');
      return;
    }
    const unidadeData = { nome, endereco, telefone };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unidadeData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao criar unidade de saúde.');
      }
      Alert.alert('Sucesso', 'Unidade de saúde criada com sucesso!');
      navigation.navigate('UnidadesSaudeList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
      console.error('Falha ao criar unidade:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Unidade</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Posto de Saúde Central" />

      <Text style={styles.label}>Endereço</Text>
      <TextInput style={styles.input} value={endereco} onChangeText={setEndereco} placeholder="Rua, Número, Bairro, Cidade" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" placeholder="(XX) XXXX-XXXX" />

      <View style={styles.button}>
        <Button title="Salvar Unidade" onPress={handleSave} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16, backgroundColor: '#f9f9f9' },
  button: { marginTop: 24, marginBottom: 48 }
});

export default CreateUnidadeSaudeScreen;
