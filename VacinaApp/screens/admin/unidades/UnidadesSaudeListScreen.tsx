import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/scripts/api'

export type UnidadeSaude = {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
};

type Props = DrawerScreenProps<DrawerParamList, 'UnidadesSaudeList'>;

const UnidadesSaudeListScreen = ({ navigation }: Props) => {
  const [unidades, setUnidades] = useState<UnidadeSaude[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}unidades-saude/`;

  const fetchUnidades = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setUnidades(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a lista de unidades de saúde.');
      console.error('Falha ao buscar unidades:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    fetchUnidades();
  }, []));

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem a certeza de que deseja apagar esta unidade de saúde?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          onPress: async () => {
            try {
              await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
              Alert.alert('Sucesso', 'Unidade de saúde apagada com sucesso!');
              fetchUnidades();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível apagar a unidade.');
              console.error('Falha ao apagar unidade:', error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: UnidadeSaude }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardInfo}>Endereço: {item.endereco}</Text>
      <Text style={styles.cardInfo}>Telefone: {item.telefone}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditUnidadeSaude', { unidadeSaude: item })}>
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
        data={unidades}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateUnidadeSaude')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 16, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  cardInfo: { fontSize: 14, color: '#666', marginTop: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#FFA000', padding: 10, borderRadius: 20, marginRight: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default UnidadesSaudeListScreen;
