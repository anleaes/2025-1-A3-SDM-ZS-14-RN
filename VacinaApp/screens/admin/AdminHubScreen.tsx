import React from 'react';
import { View, Button, StyleSheet, ScrollView, Text } from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/DrawerNavigator';

type Props = DrawerScreenProps<DrawerParamList, 'AdminHub'>;

const AdminHubScreen = ({ navigation }: Props) => {

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Painel de Gerenciamento</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Usuários" onPress={() => navigation.navigate('UsuariosList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Médicos" onPress={() => navigation.navigate('MedicosList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Vacinas" onPress={() => navigation.navigate('VacinasList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Unidades de Saúde" onPress={() => navigation.navigate('UnidadesSaudeList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Estoques de Vacina" onPress={() => navigation.navigate('EstoquesVacinaList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Agendamentos" onPress={() => navigation.navigate('AgendamentosList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Aplicações de Vacina" onPress={() => navigation.navigate('AplicacoesVacinaList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Campanhas Vacinais" onPress={() => navigation.navigate('CampanhasVacinaisList')} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Gerenciar Vínculos Campanha-Vacina" onPress={() => navigation.navigate('CampanhaVacinalVacinaList')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 20
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 24,
    color: '#333'
  },
  buttonContainer: { 
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#FFFFFF'
  },
});

export default AdminHubScreen;
