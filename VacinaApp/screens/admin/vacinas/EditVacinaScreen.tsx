import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api'


type Props = DrawerScreenProps<DrawerParamList, 'EditVacina'>;

const EditVacinaScreen = ({ route, navigation }: Props) => {
  const { vacina } = route.params;

  const [nome, setNome] = useState(vacina.nome);
  const [descricao, setDescricao] = useState(vacina.descricao);
  const [fabricante, setFabricante] = useState(vacina.fabricante);
  const [dosesRecomendadas, setDosesRecomendadas] = useState(vacina.doses_recomendadas.toString());
  const API_URL = `${API_BASE_URL}vacinas/${vacina.id}/`;

  const handleSave = async () => {
    const vacinaData = { 
      nome, 
      descricao, 
      fabricante, 
      doses_recomendadas: parseInt(dosesRecomendadas, 10) 
    };
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vacinaData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar vacina.');
      Alert.alert('Sucesso', 'Vacina atualizada com sucesso!');
      navigation.navigate('VacinasList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Vacina</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      
      <Text style={styles.label}>Fabricante</Text>
      <TextInput style={styles.input} value={fabricante} onChangeText={setFabricante} />

      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} multiline />

      <Text style={styles.label}>Doses Recomendadas</Text>
      <TextInput style={styles.input} value={dosesRecomendadas} onChangeText={setDosesRecomendadas} keyboardType="numeric" />

      <View style={styles.button}>
        <Button title="Salvar Alterações" onPress={handleSave} color="#FFA000" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { marginTop: 24 }
});

export default EditVacinaScreen;