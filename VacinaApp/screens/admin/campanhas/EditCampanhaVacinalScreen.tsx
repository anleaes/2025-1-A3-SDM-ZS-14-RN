import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'EditCampanhaVacinal'>;

const EditCampanhaVacinalScreen = ({ route, navigation }: Props) => {
  const { campanhaVacinal } = route.params;

  const [nome, setNome] = useState(campanhaVacinal.nome);
  const [descricao, setDescricao] = useState(campanhaVacinal.descricao);
  const [dataInicio, setDataInicio] = useState(campanhaVacinal.data_inicio);
  const [dataFim, setDataFim] = useState(campanhaVacinal.data_fim);
  const API_URL = `${API_BASE_URL}campanhas-vacinais/${campanhaVacinal.id}/`;

  const handleSave = async () => {
    const campanhaData = {
      nome,
      descricao,
      data_inicio: dataInicio,
      data_fim: dataFim,
    };
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campanhaData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar campanha.');
      Alert.alert('Sucesso', 'Campanha atualizada com sucesso!');
      navigation.navigate('CampanhasVacinaisList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Campanha</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} multiline />

      <Text style={styles.label}>Data de Início (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataInicio} onChangeText={setDataInicio} />

      <Text style={styles.label}>Data de Fim (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataFim} onChangeText={setDataFim} />
      
      <View style={styles.button}>
        <Button title="Salvar Alterações" onPress={handleSave} color="#FFA000" />
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

export default EditCampanhaVacinalScreen;
