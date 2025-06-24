import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import CustomDrawerContent from '../components/CustomDrawerContent';

// Telas
import HomeScreen from '../screens/HomeScreen';
import AdminHubScreen from '../screens/admin/AdminHubScreen';

// Telas CRUD
import UsuariosListScreen, { Usuario } from '../screens/admin/usuarios/UsuariosListScreen';
import CreateUsuarioScreen from '../screens/admin/usuarios/CreateUsuarioScreen';
import EditUsuarioScreen from '../screens/admin/usuarios/EditUsuarioScreen';

import MedicosListScreen, { Medico } from '../screens/admin/medicos/MedicosListScreen';
import CreateMedicoScreen from '../screens/admin/medicos/CreateMedicoScreen';
import EditMedicoScreen from '../screens/admin/medicos/EditMedicoScreen';

import VacinasListScreen, { Vacina } from '../screens/admin/vacinas/VacinasListScreen';
import CreateVacinaScreen from '../screens/admin/vacinas/CreateVacinaScreen';
import EditVacinaScreen from '../screens/admin/vacinas/EditVacinaScreen';

import UnidadesSaudeListScreen, { UnidadeSaude } from '../screens/admin/unidades/UnidadesSaudeListScreen';
import CreateUnidadeSaudeScreen from '../screens/admin/unidades/CreateUnidadeSaudeScreen';
import EditUnidadeSaudeScreen from '../screens/admin/unidades/EditUnidadeSaudeScreen';

import EstoquesVacinaListScreen, { EstoqueVacina } from '../screens/admin/estoques/EstoquesVacinaListScreen';
import CreateEstoqueVacinaScreen from '../screens/admin/estoques/CreateEstoqueVacinaScreen';
import EditEstoqueVacinaScreen from '../screens/admin/estoques/EditEstoqueVacinaScreen';

import AgendamentosListScreen, { Agendamento } from '../screens/admin/agendamentos/AgendamentosListScreen';
import CreateAgendamentoScreen from '../screens/admin/agendamentos/CreateAgendamentoScreen';
import EditAgendamentoScreen from '../screens/admin/agendamentos/EditAgendamentoScreen';

import AplicacoesVacinaListScreen, { AplicacaoVacina } from '../screens/admin/aplicacoes/AplicacoesVacinaListScreen';
import CreateAplicacaoVacinaScreen from '../screens/admin/aplicacoes/CreateAplicacaoVacinaScreen';
import EditAplicacaoVacinaScreen from '../screens/admin/aplicacoes/EditAplicacaoVacinaScreen';

import CampanhasVacinaisListScreen, { CampanhaVacinal } from '../screens/admin/campanhas/CampanhasVacinaisListScreen';
import CreateCampanhaVacinalScreen from '../screens/admin/campanhas/CreateCampanhaVacinalScreen';
import EditCampanhaVacinalScreen from '../screens/admin/campanhas/EditCampanhaVacinalScreen';

import CampanhaVacinalVacinaListScreen, { CampanhaVacinalVacina } from '../screens/admin/campanha_vacina/CampanhaVacinalVacinaListScreen';
import CreateCampanhaVacinalVacinaScreen from '../screens/admin/campanha_vacina/CreateCampanhaVacinalVacinaScreen';
import EditCampanhaVacinalVacinaScreen from '../screens/admin/campanha_vacina/EditCampanhaVacinalVacinaScreen';


export type DrawerParamList = {
  Home: undefined;
  AdminHub: undefined;

  UsuariosList: undefined;
  CreateUsuario: undefined;
  EditUsuario: { usuario: Usuario };

  MedicosList: undefined;
  CreateMedico: undefined;
  EditMedico: { medico: Medico };
  
  VacinasList: undefined;
  CreateVacina: undefined;
  EditVacina: { vacina: Vacina };

  UnidadesSaudeList: undefined;
  CreateUnidadeSaude: undefined;
  EditUnidadeSaude: { unidadeSaude: UnidadeSaude };

  EstoquesVacinaList: undefined;
  CreateEstoqueVacina: undefined;
  EditEstoqueVacina: { estoqueVacina: EstoqueVacina };

  AgendamentosList: undefined;
  CreateAgendamento: undefined;
  EditAgendamento: { agendamento: Agendamento };

  AplicacoesVacinaList: undefined;
  CreateAplicacaoVacina: undefined;
  EditAplicacaoVacina: { aplicacaoVacina: AplicacaoVacina };

  CampanhasVacinaisList: undefined;
  CreateCampanhaVacinal: undefined;
  EditCampanhaVacinal: { campanhaVacinal: CampanhaVacinal };

  CampanhaVacinalVacinaList: undefined;
  CreateCampanhaVacinalVacina: undefined;
  EditCampanhaVacinalVacina: { campanhaVacinalVacina: CampanhaVacinalVacina };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerType: 'slide',
        drawerActiveTintColor: '#2E7D32',
        drawerLabelStyle: { marginLeft: 0, fontSize: 16 },
        drawerStyle: { backgroundColor: '#fff', width: 280 },
        headerStyle: { backgroundColor: '#4CAF50' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Início', drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />, }} />
      <Drawer.Screen name="AdminHub" component={AdminHubScreen} options={{ title: 'Gerenciamento do Sistema', drawerIcon: ({ color, size }) => <Ionicons name="server-outline" size={size} color={color} />, }} />

      <Drawer.Screen name="UsuariosList" component={UsuariosListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Usuários' }}/>
      <Drawer.Screen name="CreateUsuario" component={CreateUsuarioScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Usuário' }}/>
      <Drawer.Screen name="EditUsuario" component={EditUsuarioScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Usuário' }}/>
      
      <Drawer.Screen name="MedicosList" component={MedicosListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Médicos' }}/>
      <Drawer.Screen name="CreateMedico" component={CreateMedicoScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Médico' }}/>
      <Drawer.Screen name="EditMedico" component={EditMedicoScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Médico' }}/>

      <Drawer.Screen name="VacinasList" component={VacinasListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Vacinas' }}/>
      <Drawer.Screen name="CreateVacina" component={CreateVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Vacina' }}/>
      <Drawer.Screen name="EditVacina" component={EditVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Vacina' }}/>

      <Drawer.Screen name="UnidadesSaudeList" component={UnidadesSaudeListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Unidades de Saúde' }}/>
      <Drawer.Screen name="CreateUnidadeSaude" component={CreateUnidadeSaudeScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Unidade de Saúde' }}/>
      <Drawer.Screen name="EditUnidadeSaude" component={EditUnidadeSaudeScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Unidade de Saúde' }}/>

      <Drawer.Screen name="EstoquesVacinaList" component={EstoquesVacinaListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Estoques' }}/>
      <Drawer.Screen name="CreateEstoqueVacina" component={CreateEstoqueVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Estoque' }}/>
      <Drawer.Screen name="EditEstoqueVacina" component={EditEstoqueVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Estoque' }}/>

      <Drawer.Screen name="AgendamentosList" component={AgendamentosListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Agendamentos' }}/>
      <Drawer.Screen name="CreateAgendamento" component={CreateAgendamentoScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Agendamento' }}/>
      <Drawer.Screen name="EditAgendamento" component={EditAgendamentoScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Agendamento' }}/>

      <Drawer.Screen name="AplicacoesVacinaList" component={AplicacoesVacinaListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Aplicações' }}/>
      <Drawer.Screen name="CreateAplicacaoVacina" component={CreateAplicacaoVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Aplicação' }}/>
      <Drawer.Screen name="EditAplicacaoVacina" component={EditAplicacaoVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Aplicação' }}/>

      <Drawer.Screen name="CampanhasVacinaisList" component={CampanhasVacinaisListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Campanhas' }}/>
      <Drawer.Screen name="CreateCampanhaVacinal" component={CreateCampanhaVacinalScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Nova Campanha' }}/>
      <Drawer.Screen name="EditCampanhaVacinal" component={EditCampanhaVacinalScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Campanha' }}/>

      <Drawer.Screen name="CampanhaVacinalVacinaList" component={CampanhaVacinalVacinaListScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Gerenciar Vínculos de Campanha' }}/>
      <Drawer.Screen name="CreateCampanhaVacinalVacina" component={CreateCampanhaVacinalVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Novo Vínculo' }}/>
      <Drawer.Screen name="EditCampanhaVacinalVacina" component={EditCampanhaVacinalVacinaScreen} options={{ drawerItemStyle: { display: 'none' }, title: 'Editar Vínculo' }}/>
      
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
