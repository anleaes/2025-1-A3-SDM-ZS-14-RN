import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/scripts/api'

export type AplicacaoVacina = {
  id: number;
  data_aplicacao: string;
  dose: number;
  medico: { id: number; nome: string };
  usuario: { id: number; nome: string };
  vacina: { id: number; nome: string };
  unidade: { id: number; nome: string };
};

type Props = DrawerScreenProps<DrawerParamList, 'AplicacoesVacinaList'>;

const AplicacoesVacinaListScreen = ({ navigation }: Props) => {
  const [aplicacoes, setAplicacoes] = useState<AplicacaoVacina[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}aplicacoes-vacinais/`;

  const fetchAplicacoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setAplicacoes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as aplicações de vacina.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAplicacoes(); }, []));

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente apagar este registo de aplicação?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar", style: "destructive", onPress: async () => {
        try {
          await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
          Alert.alert('Sucesso', 'Registo de aplicação apagado com sucesso!');
          fetchAplicacoes();
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível apagar o registo.');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: AplicacaoVacina }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Paciente: {item.usuario.nome}</Text>
      <Text style={styles.cardInfo}>Vacina: {item.vacina.nome} (Dose {item.dose})</Text>
      <Text style={styles.cardInfo}>Data: {new Date(item.data_aplicacao).toLocaleDateString('pt-BR')}</Text>
      <Text style={styles.cardInfo}>Aplicador: Dr(a). {item.medico.nome}</Text>
      <Text style={styles.cardInfo}>Unidade: {item.unidade.nome}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditAplicacaoVacina', { aplicacaoVacina: item })}>
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={aplicacoes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateAplicacaoVacina')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardInfo: { fontSize: 14, color: '#666', marginTop: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#FFA000', padding: 10, borderRadius: 20, marginRight: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default AplicacoesVacinaListScreen;
