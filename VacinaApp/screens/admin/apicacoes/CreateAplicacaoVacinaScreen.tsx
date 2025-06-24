import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Usuario } from '../usuarios/UsuariosListScreen';
import { Vacina } from '../vacinas/VacinasListScreen';
import { UnidadeSaude } from '../unidades/UnidadesSaudeListScreen';
import { Medico } from '../medicos/MedicosListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateAplicacaoVacina'>;

const CreateAplicacaoVacinaScreen = ({ navigation }: Props) => {
  const [dataAplicacao, setDataAplicacao] = useState('');
  const [dose, setDose] = useState('');
  const [selectedMedico, setSelectedMedico] = useState<number | null>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [selectedUnidade, setSelectedUnidade] = useState<number | null>(null);

  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [medicosRes, usuariosRes, vacinasRes, unidadesRes] = await Promise.all([
          fetch(`${API_BASE_URL}medicos/`),
          fetch(`${API_BASE_URL}usuarios/`),
          fetch(`${API_BASE_URL}vacinas/`),
          fetch(`${API_BASE_URL}unidades-saude/`)
        ]);
        setMedicos(await medicosRes.json());
        setUsuarios(await usuariosRes.json());
        setVacinas(await vacinasRes.json());
        setUnidades(await unidadesRes.json());
      } catch (error) {
        Alert.alert('Erro', 'Falha ao carregar dados para o formulário.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!selectedMedico || !selectedUsuario || !selectedVacina || !selectedUnidade || !dataAplicacao || !dose) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    const aplicacaoData = {
      medico: selectedMedico,
      usuario: selectedUsuario,
      vacina: selectedVacina,
      unidade: selectedUnidade,
      data_aplicacao: dataAplicacao,
      dose: parseInt(dose, 10),
    };
    try {
      const response = await fetch(`${API_BASE_URL}aplicacoes-vacinais/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aplicacaoData),
      });
      if (!response.ok) throw new Error('Falha ao registar aplicação.');
      Alert.alert('Sucesso', 'Aplicação registada com sucesso!');
      navigation.navigate('AplicacoesVacinaList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Paciente (Usuário)</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedUsuario} onValueChange={(v) => setSelectedUsuario(v)}>
          <Picker.Item label="Selecione um paciente..." value={null} />
          {usuarios.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Vacina Aplicada</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacina} onValueChange={(v) => setSelectedVacina(v)}>
          <Picker.Item label="Selecione uma vacina..." value={null} />
          {vacinas.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Médico Aplicador</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedMedico} onValueChange={(v) => setSelectedMedico(v)}>
          <Picker.Item label="Selecione um médico..." value={null} />
          {medicos.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Unidade de Saúde</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedUnidade} onValueChange={(v) => setSelectedUnidade(v)}>
          <Picker.Item label="Selecione uma unidade..." value={null} />
          {unidades.map((item) => (<Picker.Item key={item.id} label={item.nome} value={item.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Data da Aplicação (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataAplicacao} onChangeText={setDataAplicacao} placeholder="Ex: 2025-12-31" />

      <Text style={styles.label}>Dose</Text>
      <TextInput style={styles.input} value={dose} onChangeText={setDose} keyboardType="numeric" placeholder="Ex: 1" />

      <View style={styles.button}>
        <Button title="Registar Aplicação" onPress={handleSave} color="#4CAF50" />
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

export default CreateAplicacaoVacinaScreen;
