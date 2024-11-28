import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router'; 


export default function ConsultaScreen() {
  const [ticketId, setTicketId] = useState(''); 
  const [sessionToken, setSessionToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState(null);
  
  const getSessionToken = async () => {
    try {
      const response = await axios.get('http://suporte.thermomant.com.br/apirest.php/initSession', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'user_token TOKENREMOVIDOXxBCLpIyUAdiKu', 
          'App-Token': 'TOKENREMOVIDOGsXZZosrr5ptQzJh46',
        },
      });

      const token = response.data.session_token;

      if (token) {
        setSessionToken(token); 
      } else {
        Alert.alert('Erro', 'Falha interna, contate o administrador do sistema.');
      }
    } catch (error) {
      console.error('Erro ao obter session_token:', error);
      Alert.alert('Erro', 'Falha interna, contate o administrador do sistema.');
    }
  };

    const statusDescriptions: { [key: number]: string } = {
      1: 'Novo',
      2: 'Em atendimento',
      3: 'Fechado',
      4: 'Aguardando',
      5: 'Resolvido',
      6: 'Cancelado',
    };


    const urgencyDescriptions: { [key: number]: string } = {
      1: 'Baixa',
      3: 'Média',
      5: 'Alta',
    };

  const handleSubmit = async () => {
    if (!sessionToken) {
      Alert.alert('Erro', 'Falha interna, contate o administrador do sistema.');
      return;
    }

    if (!ticketId) {
      Alert.alert('Erro', 'Por favor, forneça um ID de ticket válido.');
      return;
    }


    try {
      const response = await axios.get(
        `http://suporte.thermomant.com.br/apirest.php/Ticket/${ticketId}`, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': sessionToken, 
            'App-Token': 'TOKENREMOVIDOGsXZZosrr5ptQzJh46',
          },
        }
      );

      const ticket = response.data;
      if (ticket) {
        const ticketStatus = ticket.status as 1 | 2 | 3 | 4 | 5 | 6;
        const statusDescription = statusDescriptions[ticketStatus] || 'Não informado';     
        
        const ticketUrgency = ticket.urgency as 1  | 3  | 5 ;
        const urgencyDescription = urgencyDescriptions[ticketUrgency] || 'Não informado';   

        Alert.alert(
          `Chamado Nº: ${ticket.id}`,
          `${ticket.name}\nStatus: ${statusDescription}\nDescrição: ${ticket.content}\nPrioridade: ${urgencyDescription}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', 'Ticket não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao consultar o ticket:', error);
      Alert.alert('Erro', 'Erro ao consultar o ticket. Tente novamente mais tarde.');
    }
  };


  useEffect(() => {
    getSessionToken(); 
  }, []);
  

  return (
    // Usando KeyboardAvoidingView para ajustar a tela quando o teclado aparece
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  // Ajuste para iOS e Android
    >
      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Qual o número do chamado que deseja consultar?</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o número"
            value={ticketId}
            onChangeText={setTicketId}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Consultar" onPress={handleSubmit} />
        </View>
      
      </ScrollView>
    </KeyboardAvoidingView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  body: {
    backgroundColor: '#f7f7f7',
  },
  title: {
    color: '#362C28',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    color: '#333',
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  picker: {
    height: 50,
    borderColor: '#362C28',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  phoneInputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  phoneInputTextContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    height: 50,
  },
});