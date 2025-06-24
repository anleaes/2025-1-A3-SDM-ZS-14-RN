import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Vacina } from '../vacinas/VacinasListScreen';
import { UnidadeSaude } from '../unidades/UnidadesSaudeListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateEstoqueVacina'>;

const CreateEstoqueVacinaScreen = ({ navigation }: Props) => {
  const [quantidade, setQuantidade] = useState('');
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [selectedUnidade, setSelectedUnidade] = useState<number | null>(null);

  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [vacinasRes, unidadesRes] = await Promise.all([
          fetch(`${API_BASE_URL}vacinas/`),
          fetch(`${API_BASE_URL}unidades-saude/`)
        ]);
        const vacinasData = await vacinasRes.json();
        const unidadesData = await unidadesRes.json();
        setVacinas(vacinasData);
        setUnidades(unidadesData);
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados de vacinas e unidades.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedVacina || !selectedUnidade || !quantidade) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    const estoqueData = {
      vacina: selectedVacina,
      unidade: selectedUnidade,
      quantidade_disponsivel: quantidade,
    };
    try {
      const response = await fetch(`${API_BASE_URL}estoques-vacina/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoqueData),
      });
      if (!response.ok) throw new Error('Falha ao criar o registro de estoque.');
      Alert.alert('Sucesso', 'Estoque criado com sucesso!');
      navigation.navigate('EstoquesVacinaList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Vacina</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedVacina}
          onValueChange={(itemValue) => setSelectedVacina(itemValue)}
          prompt="Selecione uma vacina"
        >
          <Picker.Item label="Selecione uma vacina..." value={null} />
          {vacinas.map((vac) => (<Picker.Item key={vac.id} label={`${vac.nome} (${vac.fabricante})`} value={vac.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Unidade de Saúde</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedUnidade}
          onValueChange={(itemValue) => setSelectedUnidade(itemValue)}
          prompt="Selecione uma unidade"
        >
          <Picker.Item label="Selecione uma unidade..." value={null} />
          {unidades.map((uni) => (<Picker.Item key={uni.id} label={uni.nome} value={uni.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Quantidade Disponível</Text>
      <TextInput style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="decimal-pad" placeholder="Ex: 100.00" />

      <View style={styles.button}>
        <Button title="Adicionar ao Estoque" onPress={handleSave} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#f9f9f9' },
  button: { marginTop: 24, marginBottom: 48 }
});

export default CreateEstoqueVacinaScreen;
