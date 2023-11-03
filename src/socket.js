import { io } from "socket.io-client";
import { reactive } from "vue";
// const son = new Audio(require('@/assets/alert/airport-bingbong.wav'))


export const state = reactive({
  senhasEsperando: [],
  senhasAtendidas: [],
  senhasChamadas: [],
  loadtria: false,
  loadAten: false,
  senhaSelecionada: undefined,
  alert: false
})


class SocketService {
  socket;
  constructor(){}


  setupSocketConnection(){
    this.socket = io('http://192.168.102.168:3000')
    this.socket.on('listar senhas', (data)=>{
      state.loadtria = false;
      state.loadAten = false;
      
      state.senhasAtendidas = data.senhasAtendidas;
      state.senhasEsperando = data.senhasEsperando;
      state.senhasChamadas = data.senhasChamadas;
    })
  }

  listemSenha(){
    this.socket.on('listar senhas alert', (data)=>{
      state.senhasAtendidas = data.senhas.senhasAtendidas;
      state.senhasEsperando = data.senhas.senhasEsperando;
      state.senhasChamadas = data.senhas.senhasChamadas;

      if(data.data.senha == state.senhasChamadas[state.senhasChamadas.length -1].senha){
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        msg.voice = voices[0]; 
        msg.volume = 1; // From 0 to 1
        msg.rate = 2; // From 0.1 to 10
        msg.pitch = 1; // From 0 to 2
        msg.text = `senha. ${this.formatTextSpeech(data.data.senha)} guichê. ${this.formatTextSpeech(data.data.guiche)}
        `;
        window.speechSynthesis.speak(msg)
        // son.play()
      }
      state.alert = true;

    });
  }

  formatTextSpeech(val){
    let temp = ''
    for (let i = 0; i < val.length; i++) {
      temp += `${val[i]}. `
    }
    console.log(temp)
    return temp
  }
 

  chamarNovamente(data){
    this.socket.emit('chamar novamente',  data)
  }

  sentData(data){
    state.loadtria = true;
    this.socket.emit('criar senha', data)
  }

  chamarSenha(data){
    state.loadAten = true;
    this.socket.emit('chamar senha', data);
  }

  finalizarAtendimento(data){
    state.loadAten = true
    this.socket.emit('finalizar atendimento', data)
  }

  voltarSenha(data){
    state.loadAten = true
    this.socket.emit('voltar senha', data)
  }


  disconnect() {
      if (this.socket) {
          this.socket.disconnect();
      }
  }
}

export default new SocketService();

