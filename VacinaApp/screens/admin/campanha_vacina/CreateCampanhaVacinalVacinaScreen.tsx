import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { CampanhaVacinal } from '../campanhas/CampanhasVacinaisListScreen';
import { Vacina } from '../vacinas/VacinasListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateCampanhaVacinalVacina'>;

const CreateCampanhaVacinalVacinaScreen = ({ navigation }: Props) => {
  const [selectedCampanha, setSelectedCampanha] = useState<number | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);

  const [campanhas, setCampanhas] = useState<CampanhaVacinal[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [campanhasRes, vacinasRes] = await Promise.all([
          fetch(`${API_BASE_URL}campanhas-vacinais/`),
          fetch(`${API_BASE_URL}vacinas/`),
        ]);
        setCampanhas(await campanhasRes.json());
        setVacinas(await vacinasRes.json());
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados para o formulário.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedCampanha || !selectedVacina) {
      Alert.alert('Erro', 'Ambos os campos, Campanha e Vacina, são obrigatórios.');
      return;
    }
    const vinculoData = {
      campanha: selectedCampanha,
      vacina: selectedVacina,
    };
    try {
      const response = await fetch(`${API_BASE_URL}campanha-vacinal-vacina/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vinculoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors?.[0] || 'Falha ao criar o vínculo. Ele pode já existir.';
        throw new Error(errorMessage);
      }
      Alert.alert('Sucesso', 'Vínculo entre campanha e vacina criado com sucesso!');
      navigation.navigate('CampanhaVacinalVacinaList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Campanha</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedCampanha} onValueChange={(itemValue) => setSelectedCampanha(itemValue)}>
          <Picker.Item label="Selecione uma campanha..." value={null} />
          {campanhas.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Vacina</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacina} onValueChange={(itemValue) => setSelectedVacina(itemValue)}>
          <Picker.Item label="Selecione uma vacina..." value={null} />
          {vacinas.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <View style={styles.button}>
        <Button title="Criar Vínculo" onPress={handleSave} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 6 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9' },
  button: { marginTop: 24, marginBottom: 48 }
});

export default CreateCampanhaVacinalVacinaScreen;
