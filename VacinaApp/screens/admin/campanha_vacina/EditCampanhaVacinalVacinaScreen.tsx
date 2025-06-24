import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { CampanhaVacinal } from '../campanhas/CampanhasVacinaisListScreen';
import { Vacina } from '../vacinas/VacinasListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'EditCampanhaVacinalVacina'>;

const EditCampanhaVacinalVacinaScreen = ({ route, navigation }: Props) => {
  const { campanhaVacinalVacina } = route.params;

  const [selectedCampanha, setSelectedCampanha] = useState<number | null>(campanhaVacinalVacina.campanha.id);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(campanhaVacinalVacina.vacina.id);

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
    const vinculoData = {
      campanha: selectedCampanha,
      vacina: selectedVacina,
    };
    try {
      const response = await fetch(`${API_BASE_URL}campanha-vacinal-vacina/${campanhaVacinalVacina.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vinculoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.non_field_errors?.[0] || 'Falha ao atualizar o vínculo. Ele pode já existir.';
        throw new Error(errorMessage);
      }
      Alert.alert('Sucesso', 'Vínculo atualizado com sucesso!');
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
          {campanhas.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Vacina</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacina} onValueChange={(itemValue) => setSelectedVacina(itemValue)}>
          {vacinas.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <View style={styles.button}>
        <Button title="Salvar Alterações" onPress={handleSave} color="#FFA000" />
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

export default EditCampanhaVacinalVacinaScreen;
