import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api'

type Props = DrawerScreenProps<DrawerParamList, 'EditMedico'>;

const EditMedicoScreen = ({ route, navigation }: Props) => {
  const { medico } = route.params;

  const [nome, setNome] = useState(medico.nome);
  const [cpf, setCpf] = useState(medico.cpf);
  const [dataNascimento, setDataNascimento] = useState(medico.data_nascimento);
  const [sexo, setSexo] = useState(medico.sexo);
  const [email, setEmail] = useState(medico.email);
  const [telefone, setTelefone] = useState(medico.telefone);
  const [crm, setCrm] = useState(medico.crm);
  const [especialidade, setEspecialidade] = useState(medico.especialidade);
  const API_URL = `${API_BASE_URL}medicos/${medico.id}/`;

  const handleSave = async () => {
    const medicoData = {
      nome, cpf, data_nascimento: dataNascimento, sexo, email, telefone,
      crm, especialidade
    };
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicoData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const firstErrorKey = Object.keys(errorData)[0];
        const errorMessage = `${firstErrorKey}: ${errorData[firstErrorKey][0]}`;
        throw new Error(errorMessage || 'Falha ao atualizar médico.');
      }
      Alert.alert('Sucesso', 'Médico atualizado com sucesso!');
      navigation.navigate('MedicosList');
    } catch (error) {
      Alert.alert('Erro de Validação', (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dados Pessoais</Text>
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" />

      <Text style={styles.label}>Data de Nascimento (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sexo}
          onValueChange={(itemValue) => setSexo(itemValue)}
        >
          <Picker.Item label="Masculino" value="M" />
          <Picker.Item label="Feminino" value="F" />
        </Picker>
      </View>

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

      <Text style={styles.header}>Dados Profissionais</Text>
      <Text style={styles.label}>CRM</Text>
      <TextInput style={styles.input} value={crm} onChangeText={setCrm} />

      <Text style={styles.label}>Especialidade</Text>
      <TextInput style={styles.input} value={especialidade} onChangeText={setEspecialidade} />

      <View style={styles.button}>
        <Button title="Salvar Alterações" onPress={handleSave} color="#FFA000" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#4CAF50', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5 },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16, backgroundColor: '#f9f9f9' },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  button: { marginTop: 24, marginBottom: 48 }
});

export default EditMedicoScreen;
