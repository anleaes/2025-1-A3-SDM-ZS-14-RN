import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../../navigation/DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '@/scripts/api'

export type CampanhaVacinal = {
  id: number;
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
};

type Props = DrawerScreenProps<DrawerParamList, 'CampanhasVacinaisList'>;

const CampanhasVacinaisListScreen = ({ navigation }: Props) => {
  const [campanhas, setCampanhas] = useState<CampanhaVacinal[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = `${API_BASE_URL}campanhas-vacinais/`;

  const fetchCampanhas = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setCampanhas(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as campanhas.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchCampanhas(); }, []));

  const handleDelete = async (id: number) => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente apagar esta campanha?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Apagar", style: "destructive", onPress: async () => {
        try {
          await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
          Alert.alert('Sucesso', 'Campanha apagada com sucesso!');
          fetchCampanhas();
        } catch (error) {
          Alert.alert('Erro', 'Não foi possível apagar a campanha.');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: CampanhaVacinal }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardDescription}>{item.descricao}</Text>
      <Text style={styles.cardInfo}>
        Período: {new Date(item.data_inicio).toLocaleDateString('pt-BR')} a {new Date(item.data_fim).toLocaleDateString('pt-BR')}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditCampanhaVacinal', { campanhaVacinal: item })}>
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
        data={campanhas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateCampanhaVacinal')}>
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
  cardDescription: { fontStyle: 'italic', color: '#555', marginVertical: 4 },
  cardInfo: { fontSize: 14, color: '#666', marginTop: 4 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  editButton: { backgroundColor: '#FFA000', padding: 10, borderRadius: 20, marginRight: 10 },
  deleteButton: { backgroundColor: '#D32F2F', padding: 10, borderRadius: 20 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#4CAF50', width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});

export default CampanhasVacinaisListScreen;
