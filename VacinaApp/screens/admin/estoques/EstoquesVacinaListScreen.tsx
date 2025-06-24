import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/scripts/api'

export type EstoqueVacina = {
  id: number;
  quantidade_disponsivel: string;
  vacina: {
    id: number;
    nome: string;
  };
  unidade: {
    id: number;
    nome: string;
  };
};

type Props = DrawerScreenProps<DrawerParamList, 'EstoquesVacinaList'>;

const EstoquesVacinaListScreen = ({ navigation }: Props) => {
  const [estoques, setEstoques] = useState<EstoqueVacina[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}estoques-vacina/`;

  const fetchEstoques = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setEstoques(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os estoques.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchEstoques(); }, []));

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente apagar este registro de estoque?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar", style: "destructive", onPress: async () => {
        try {
          await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
          Alert.alert('Sucesso', 'Registro de estoque apagado com sucesso!');
          fetchEstoques();
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível apagar o registro.');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: EstoqueVacina }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Vacina: {item.vacina.nome}</Text>
      <Text style={styles.cardSubtitle}>Unidade: {item.unidade.nome}</Text>
      <Text style={styles.quantity}>Quantidade: {item.quantidade_disponsivel}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditEstoqueVacina', { estoqueVacina: item })}>
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
        data={estoques}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateEstoqueVacina')}>
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
  cardSubtitle: { fontSize: 16, color: '#555', marginTop: 4 },
  quantity: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50', marginTop: 8 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#FFA000', padding: 10, borderRadius: 20, marginRight: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default EstoquesVacinaListScreen;
