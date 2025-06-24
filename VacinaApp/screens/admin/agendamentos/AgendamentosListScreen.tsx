import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';

export type Agendamento = {
  id: number;
  data_hora: string;
  status: string;
  usuario: {
    id: number;
    nome: string;
  };
  vacina: {
    id: number;
    nome: string;
  };
  unidade: {
    id: number;
    nome: string;
  };
};

type Props = DrawerScreenProps<DrawerParamList, 'AgendamentosList'>;

import { API_BASE_URL } from '@/scripts/api'

const AgendamentosListScreen = ({ navigation }: Props) => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}agendamentos/`;

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAgendamentos(); }, []));

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente apagar este agendamento?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar", style: "destructive", onPress: async () => {
        try {
          await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
          Alert.alert('Sucesso', 'Agendamento apagado com sucesso!');
          fetchAgendamentos();
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível apagar o agendamento.');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: Agendamento }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Usuário: {item.usuario.nome}</Text>
      <Text style={styles.cardInfo}>Vacina: {item.vacina.nome}</Text>
      <Text style={styles.cardInfo}>Unidade: {item.unidade.nome}</Text>
      <Text style={styles.cardInfo}>Data: {new Date(item.data_hora).toLocaleString('pt-BR')}</Text>
      <Text style={[styles.status, { color: item.status === 'confirmado' ? 'green' : item.status === 'cancelado' ? 'red' : 'orange' }]}>
        Status: {item.status}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditAgendamento', { agendamento: item })}>
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
        data={agendamentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateAgendamento')}>
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
  status: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#FFA000', padding: 10, borderRadius: 20, marginRight: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default AgendamentosListScreen;
