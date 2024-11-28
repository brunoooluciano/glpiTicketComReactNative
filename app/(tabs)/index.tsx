import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router'; 
import PhoneInput from 'react-native-phone-number-input'; 
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: CountryModal: Support for defaultProps']);

export default function Index() {
  const [nameEmployee, setNameEmployee] = useState('');
  const [phoneEmployee, setPhoneEmployee] = useState(''); 
  const [identificationEmployee, setIdentificationEmployee] = useState('');
  const [ticketArea, setTicketArea] = useState('');
  const [ticketPriority, setTicketPriority] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [sessionToken, setSessionToken] = useState(null); 

  const clearFields = () => {
    setNameEmployee('');
    setTicketArea('');
    setTicketPriority('');
    setTicketDesc('');
    setPhoneEmployee('');
    setIdentificationEmployee('');
  };
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

  const handleSubmit = async () => {
    if (!sessionToken) {
      Alert.alert('Erro', 'Falha interna, contate o administrador do sistema.');
      return;
    }

    var name = `Chamado de ${nameEmployee} iniciado via App`
    var content = `\nEquipamento: ${identificationEmployee}\n${ticketDesc}\nContato: ${phoneEmployee}`  
    const data = {
      input: {
        name: name,
        content: content, 
        urgency: ticketPriority, 
        itilcategories_id: ticketArea,
        status: 1,
      },
    };


    try {
      const response = await axios.post(
        'http://suporte.thermomant.com.br/apirest.php/Ticket',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Session-Token': sessionToken, 
            'App-Token': 'TOKENREMOVIDOGsXZZosrr5ptQzJh46',
          },
        }
      );
      const { id, message } = response.data;

      if (id && message) {
        Alert.alert(
          'Solicitação Recebida!',
          `Número do chamado: ${id}\nGuarde esse número para consultar o chamado.`,
          [
            {
              text: 'OK',
              onPress: () => {
                router.push('/consulta');
              },
            },
          ]
        );

      clearFields();

      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao processar sua solicitação.');
      }
      
    } catch (error) {
      Alert.alert(`Contate o administrador do sistema!\nErro ao enviar a solicitação: ${error}`);
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
        <View style={styles.inputContainer}>
          {/* Nome do empregado */}
          <Text style={styles.title}>Qual o seu nome?</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={nameEmployee}
            onChangeText={setNameEmployee}
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Qual o seu número de telefone?</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu telefone"
            value={phoneEmployee}
            onChangeText={setPhoneEmployee}
            keyboardType="phone-pad"
          />
        </View>

        {/* Identificação do Equipamento */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Identificação do Equipamento</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome ou Nº da etiqueta de patrimônio"
            value={identificationEmployee}
            onChangeText={setIdentificationEmployee}
          />
        </View>

        {/* Departamento */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Departamento</Text>
          <Picker
            selectedValue={ticketArea}
            style={styles.picker}
            onValueChange={(itemValue) => setTicketArea(itemValue)}
          >
            <Picker.Item label="Escolha o departamento" value="" />
            <Picker.Item label="TI" value="1" />
            <Picker.Item label="Manutenção" value="2" />
          </Picker>
        </View>

        {/* Prioridade */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Prioridade</Text>
          <Picker
            selectedValue={ticketPriority}
            style={styles.picker}
            onValueChange={(itemValue) => setTicketPriority(itemValue)}
          >
            <Picker.Item label="Escolha o nível de prioridade" value="" />
            <Picker.Item label="Alta" value="5" />
            <Picker.Item label="Média" value="3" />
            <Picker.Item label="Baixa" value="1" />
          </Picker>
        </View>

        {/* Descrição do problema */}
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Descreva o problema</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva detalhadamente"
            value={ticketDesc}
            onChangeText={setTicketDesc}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Botão para enviar */}
        <View style={styles.buttonContainer}>
          <Button title="Enviar Solicitação" onPress={handleSubmit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  inputContainer: {
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
  },
  phoneInputTextContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
});