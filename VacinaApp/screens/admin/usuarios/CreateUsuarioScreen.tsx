import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Picker } from '@react-native-picker/picker';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { API_BASE_URL } from '@/scripts/api';

type Props = DrawerScreenProps<DrawerParamList, 'CreateUsuario'>;

const CreateUsuarioScreen = ({ navigation }: Props) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('M');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const API_URL = `${API_BASE_URL}usuarios/`;

  const handleSave = async () => {
    const usuarioData = { nome, cpf, data_nascimento: dataNascimento, sexo, email, telefone };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const firstErrorKey = Object.keys(errorData)[0];
        const errorMessage = `${firstErrorKey}: ${errorData[firstErrorKey][0]}`;
        throw new Error(errorMessage || 'Falha ao criar usuário.');
      }
      Alert.alert('Sucesso', 'Usuário criado com sucesso!');
      navigation.navigate('UsuariosList');
    } catch (error) {
      Alert.alert('Erro de Validação', (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />
      
      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" />

      <Text style={styles.label}>Data de Nascimento (AAAA-MM-DD)</Text>
      <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="Ex: 1990-12-31"/>

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

      <View style={styles.button}>
        <Button title="Salvar" onPress={handleSave} color="#4CAF50" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, fontSize: 16 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  button: { marginTop: 24, marginBottom: 48 }
});

export default CreateUsuarioScreen;
