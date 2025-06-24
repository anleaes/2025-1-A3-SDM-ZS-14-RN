import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Usuario } from '../usuarios/UsuariosListScreen';
import { Vacina } from '../vacinas/VacinasListScreen';
import { UnidadeSaude } from '../unidades/UnidadesSaudeListScreen';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'EditAgendamento'>;

const EditAgendamentoScreen = ({ route, navigation }: Props) => {
  const { agendamento } = route.params;

  const [dataHora, setDataHora] = useState(agendamento.data_hora);
  const [status, setStatus] = useState(agendamento.status);
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(agendamento.usuario.id);
  const [selectedVacina, setSelectedVacina] = useState<number | null>(agendamento.vacina.id);
  const [selectedUnidade, setSelectedUnidade] = useState<number | null>(agendamento.unidade.id);

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
    const agendamentoData = {
      usuario: selectedUsuario,
      vacina: selectedVacina,
      unidade: selectedUnidade,
      data_hora: dataHora,
      status: status,
    };
    try {
      const response = await fetch(`${API_BASE_URL}agendamentos/${agendamento.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agendamentoData),
      });
      if (!response.ok) throw new Error('Falha ao atualizar agendamento.');
      Alert.alert('Sucesso', 'Agendamento atualizado com sucesso!');
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
          {usuarios.map((user) => (<Picker.Item key={user.id} label={user.nome} value={user.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Vacina</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedVacina} onValueChange={(itemValue) => setSelectedVacina(itemValue)}>
          {vacinas.map((vac) => (<Picker.Item key={vac.id} label={vac.nome} value={vac.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Unidade de Saúde</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={selectedUnidade} onValueChange={(itemValue) => setSelectedUnidade(itemValue)}>
          {unidades.map((uni) => (<Picker.Item key={uni.id} label={uni.nome} value={uni.id} />))}
        </Picker>
      </View>

      <Text style={styles.label}>Data e Hora (AAAA-MM-DDTHH:MM)</Text>
      <TextInput style={styles.input} value={dataHora} onChangeText={setDataHora} />

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
        <Button title="Salvar Alterações" onPress={handleSave} color="#FFA000" />
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

export default EditAgendamentoScreen;
