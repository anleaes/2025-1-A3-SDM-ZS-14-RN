import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Usuario } from '../usuarios/UsuariosListScreen';
import { Vacina } from '../vacinas/VacinasListScreen';
import { UnidadeSaude } from '../unidades/UnidadesSaudeListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'CreateAgendamento'>;

const CreateAgendamentoScreen = ({ navigation }: Props) => {
  const [dataHora, setDataHora] = useState('');
  const [status, setStatus] = useState('pendente');
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(null);
  const [selectedUnidade, setSelectedUnidade] = useState<number | null>(null);

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usuariosRes, vacinasRes, unidadesRes] = await Promise.all([
          fetch(`${API_BASE_URL}usuarios/`),
          fetch(`${API_BASE_URL}vacinas/`),
          fetch(`${API_BASE_URL}unidades-saude/`)
        ]);
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
    if (!selectedUsuario || !selectedVacina || !selectedUnidade || !dataHora) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    const agendamentoData = {
      usuario: selectedUsuario,
      vacina: selectedVacina,
      unidade: selectedUnidade,
      data_hora: dataHora,
      status: status,
    };
    try {
      const response = await fetch(`${API_BASE_URL}agendamentos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamentoData),
      });
      if (!response.ok) throw new Error('Falha ao criar agendamento.');
      Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      navigation.navigate('AgendamentosList');
    } catch (error) {
      Alert.alert('Erro', (error as Error).message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Usuário</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedUsuario} onValueChange={(itemValue) => setSelectedUsuario(itemValue)}>
          <Picker.Item label="Selecione um usuário..." value={null} />
          {usuarios.map((user) => (<Picker.Item key={user.id} label={user.nome} value={user.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Vacina</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacina} onValueChange={(itemValue) => setSelectedVacina(itemValue)}>
          <Picker.Item label="Selecione uma vacina..." value={null} />
          {vacinas.map((vac) => (<Picker.Item key={vac.id} label={vac.nome} value={vac.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Unidade de Saúde</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedUnidade} onValueChange={(itemValue) => setSelectedUnidade(itemValue)}>
          <Picker.Item label="Selecione uma unidade..." value={null} />
          {unidades.map((uni) => (<Picker.Item key={uni.id} label={uni.nome} value={uni.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Data e Hora (AAAA-MM-DDTHH:MM)</Text>
      <TextInput style={styles.input} value={dataHora} onChangeText={setDataHora} placeholder="Ex: 2025-12-31T14:30" />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)}>
          <Picker.Item label="Pendente" value="pendente" />
          <Picker.Item label="Confirmado" value="confirmado" />
          <Picker.Item label="Cancelado" value="cancelado" />
          <Picker.Item label="Realizado" value="realizado" />
        </Picker>
      </View>

      <View style={styles.button}>
        <Button title="Criar Agendamento" onPress={handleSave} color="#4CAF50" />
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

export default CreateAgendamentoScreen;
