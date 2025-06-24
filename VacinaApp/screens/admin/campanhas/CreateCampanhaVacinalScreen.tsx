import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateCampanhaVacinal'>;

const CreateCampanhaVacinalScreen = ({ navigation }: Props) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const API_URL = `${API_BASE_URL}campanhas-vacinais/`;
  const handleSave = async () => {
    if (!nome || !dataInicio || !dataFim) {
      Alert.alert('Erro', 'Os campos Nome, Data de Início e Data de Fim são obrigatórios.');
      return;
    }
    const campanhaData = {
      nome,
      descricao,
      data_inicio: dataInicio,
      data_fim: dataFim,
    };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campanhaData),
      });
      if (!response.ok) throw new Error('Falha ao criar campanha.');
      Alert.alert('Sucesso', 'Campanha criada com sucesso!');
      navigation.navigate('CampanhasVacinaisList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Campanha</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Ex: Campanha de Vacinação contra a Gripe" />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} multiline placeholder="Breve descrição dos objetivos da campanha" />

      <Text style={styles.label}>Data de Início (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} placeholder="Ex: 2025-04-01" />

      <Text style={styles.label}>Data de Fim (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataFim} onChangeText={setDataFim} placeholder="Ex: 2025-05-31" />
      
      <View style={styles.button}>
        <Button title="Criar Campanha" onPress={handleSave} color="#4CAF50" />
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

export default CreateCampanhaVacinalScreen;
