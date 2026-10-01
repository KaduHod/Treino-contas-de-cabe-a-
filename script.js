// =====================================================
// Treino de Cálculo Mental - lógica principal
// Arquivo único, sem bibliotecas, apenas JavaScript puro.
// =====================================================

// ---- Variáveis globais de estado ----
let acertos = 0;                    // total de respostas corretas
let tentativas = 0;                 // total de respostas enviadas
let valorCorreto = 0;               // resultado correto da conta atual
let operacaoAtual = 'multiplicacao'; // operação da conta atual
let aguardandoProxima = false;      // fica true após verificar a resposta

// ---- Referências aos elementos da página ----
const campoResposta = document.getElementById('resposta');
const botaoAcao = document.getElementById('acao');
const seletorOperacao = document.getElementById('operacao');
const seletorTipo = document.getElementById('tipo');
const campoConta = document.getElementById('conta');
const campoDica = document.getElementById('dica');
const campoFeedback = document.getElementById('feedback');
const campoAcertos = document.getElementById('acertos');
const campoTentativas = document.getElementById('tentativas');

// ---- Funções auxiliares ----

// Sorteia um número inteiro entre min e max (ambos inclusos).
function inteiroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gera um número exibido na conta.
// No modo inteiro sempre é inteiro; no modo livre pode ter até 2 casas decimais.
function gerarNumero(livre) {
  if (!livre || Math.random() < 0.5) {
    return inteiroAleatorio(1, 1000);
  }
  // Gera as casas decimais como um inteiro dividido por 100 (evita erros de ponto flutuante).
  return Number((inteiroAleatorio(100, 100000) / 100).toFixed(2));
}

// Mostra o número no formato brasileiro (vírgula no lugar do ponto).
function formatarNumero(numero) {
  return String(numero).replace('.', ',');
}

// Retorna true quando o tipo de número selecionado é "Apenas inteiros".
function modoInteiro() {
  return seletorTipo.value === 'inteiro';
}

// Lê o select de operação; em "Ambas" sorteia entre multiplicação e divisão.
function sortearOperacao() {
  const escolha = seletorOperacao.value;
  if (escolha === 'ambas') {
    return Math.random() < 0.5 ? 'multiplicacao' : 'divisao';
  }
  return escolha;
}

// ---- Geração da conta ----

// Monta a conta atual conforme as configurações escolhidas.
function gerarConta() {
  operacaoAtual = sortearOperacao();
  const livre = !modoInteiro();

  if (operacaoAtual === 'multiplicacao') {
    const fator1 = gerarNumero(livre);
    const fator2 = gerarNumero(livre);
    // Arredonda o produto para evitar erros de ponto flutuante do JavaScript.
    valorCorreto = Number((fator1 * fator2).toFixed(4));
    campoConta.textContent = formatarNumero(fator1) + ' × ' + formatarNumero(fator2);
    campoDica.textContent = '';
  } else {
    let dividendo;
    let divisor;
    if (livre) {
      // Modo livre: o resultado é arredondado para 2 casas decimais.
      dividendo = gerarNumero(true);
      divisor = gerarNumero(true);
      valorCorreto = Number((dividendo / divisor).toFixed(2));
      campoDica.textContent = 'Arredonde para 2 casas decimais';
    } else {
      // Modo inteiro: divisão exata com dividendo até 1000.
      divisor = inteiroAleatorio(2, 100);
      const quociente = inteiroAleatorio(1, Math.floor(1000 / divisor));
      dividendo = divisor * quociente;
      valorCorreto = quociente;
      campoDica.textContent = '';
    }
    campoConta.textContent = formatarNumero(dividendo) + ' ÷ ' + formatarNumero(divisor);
  }
}

// ---- Máscara e validação do campo de resposta ----

// Aplica a máscara: apenas dígitos e uma vírgula, com limite de casas decimais.
function aplicarMascara() {
  // No modo inteiro não há casas decimais; senão, 2 na divisão e 4 na multiplicação.
  let maxCasas = 0;
  if (!modoInteiro()) {
    maxCasas = operacaoAtual === 'divisao' ? 2 : 4;
  }

  // Aceita ponto e vírgula: converte ponto em vírgula e remove o resto.
  const valor = campoResposta.value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
  const partes = valor.split(',');
  const inteiro = partes[0];
  const decimal = partes.slice(1).join(''); // junta caso haja mais de uma vírgula

  if (maxCasas === 0) {
    // Modo inteiro: sem separador decimal (mantém apenas os dígitos).
    campoResposta.value = inteiro + decimal;
  } else if (partes.length > 1) {
    // Modo livre: mantém no máximo o número de casas permitido.
    campoResposta.value = inteiro + ',' + decimal.slice(0, maxCasas);
  } else {
    campoResposta.value = inteiro;
  }

  atualizarBotao();
}

// Diz se a resposta digitada é um número válido.
function respostaValida() {
  const valor = campoResposta.value;
  if (!/[0-9]/.test(valor)) return false; // precisa ter pelo menos um dígito
  const numero = Number(valor.replace(',', '.'));
  return !isNaN(numero) && isFinite(numero);
}

// Habilita o botão apenas quando existe uma resposta válida.
function atualizarBotao() {
  if (aguardandoProxima) return; // o botão está no modo "Próxima conta"
  botaoAcao.disabled = !respostaValida();
}

// ---- Placar e feedback ----

// Atualiza os números do placar na tela.
function atualizarPlacar() {
  campoAcertos.textContent = acertos;
  campoTentativas.textContent = tentativas;
}

// Exibe a mensagem de acerto (verde) ou erro (vermelho).
function mostrarFeedback(texto, sucesso) {
  const cor = sucesso ? 'text-green-600' : 'text-red-600';
  campoFeedback.textContent = texto;
  campoFeedback.className = 'text-center mt-4 font-semibold h-6 ' + cor;
}

// Limpa a mensagem de feedback.
function limparFeedback() {
  campoFeedback.textContent = '';
  campoFeedback.className = 'text-center mt-4 font-semibold h-6';
}

// ---- Ações principais ----

// Compara a resposta do usuário com o valor correto e mostra o resultado.
function verificarResposta() {
  const resposta = Number(campoResposta.value.replace(',', '.'));
  tentativas += 1;

  // Tolerância pequena para compensar arredondamentos.
  if (Math.abs(resposta - valorCorreto) < 0.0001) {
    acertos += 1;
    mostrarFeedback('Acertou!', true);
  } else {
    mostrarFeedback('Errou! Resposta correta: ' + formatarNumero(valorCorreto), false);
  }

  atualizarPlacar();

  // Bloqueia a digitação e transforma o botão em "Próxima conta".
  campoResposta.disabled = true;
  aguardandoProxima = true;
  botaoAcao.textContent = 'Próxima conta';
  botaoAcao.disabled = false;
}

// Gera uma nova conta e prepara a tela para responder novamente.
function proximaConta() {
  gerarConta();
  campoResposta.value = '';
  campoResposta.disabled = false;
  aguardandoProxima = false;
  botaoAcao.textContent = 'Verificar resposta';
  botaoAcao.disabled = true;
  limparFeedback();
  campoResposta.focus();
}

// ---- Inicialização ----

// Liga os eventos e mostra a primeira conta.
function iniciar() {
  // Trocar qualquer configuração gera uma nova conta imediatamente.
  seletorOperacao.addEventListener('change', proximaConta);
  seletorTipo.addEventListener('change', proximaConta);

  // A máscara roda a cada digitação.
  campoResposta.addEventListener('input', aplicarMascara);

  // A tecla Enter aciona o botão ativo (Verificar resposta / Próxima conta),
  // funcionando tanto no campo de resposta quanto após a verificação.
  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Enter' && !botaoAcao.disabled) {
      evento.preventDefault();
      botaoAcao.click();
    }
  });

  // O mesmo botão verifica a resposta ou passa para a próxima conta.
  botaoAcao.addEventListener('click', function () {
    if (aguardandoProxima) {
      proximaConta();
    } else {
      verificarResposta();
    }
  });

  proximaConta();
}

iniciar();
