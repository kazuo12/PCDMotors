// As adaptações são o motivo de o PCD Motors existir: num classificado comum
// elas viram texto solto na descrição. Aqui cada uma tem código, nome curto e
// uma explicação em português claro -- quem nunca dirigiu adaptado precisa
// entender o que está comprando sem procurar fora do site.
export const ADAPTACOES = {
  automatico: {
    nome: 'Câmbio automático',
    curto: 'Automático',
    texto: 'Sem pedal de embreagem e sem troca manual de marchas. É a base de quase toda adaptação: libera a perna esquerda e as duas mãos para os demais comandos.',
  },
  'acelerador-esquerdo': {
    nome: 'Acelerador esquerdo',
    curto: 'Acel. esquerdo',
    texto: 'Um segundo pedal de acelerador é instalado à esquerda do freio, para quem não tem força ou mobilidade na perna direita. O pedal original fica travado ou removível.',
  },
  pomo: {
    nome: 'Pomo no volante',
    curto: 'Pomo',
    texto: 'Manopla fixada no aro do volante que permite girar a direção com uma mão só, deixando a outra livre para câmbio, setas e comandos manuais.',
  },
  'freio-manual': {
    nome: 'Comando manual de freio',
    curto: 'Freio manual',
    texto: 'Alavanca ligada ao pedal de freio, acionada com a mão. Indicada para quem não usa as pernas; costuma vir junto do acelerador manual na mesma haste.',
  },
  pedais: {
    nome: 'Prolongador de pedais',
    curto: 'Prolongador',
    texto: 'Extensores que aproximam acelerador e freio do motorista, para pessoas de baixa estatura ou com alcance reduzido, sem precisar colar o banco no volante.',
  },
  giratorio: {
    nome: 'Banco giratório',
    curto: 'Banco giratório',
    texto: 'O banco gira para fora do carro e, nos modelos com elevação, desce até a altura da cadeira de rodas. Facilita a transferência sem esforço de terceiros.',
  },
  elevador: {
    nome: 'Elevador de cadeira',
    curto: 'Elevador',
    texto: 'Plataforma no porta-malas que sobe e guarda a cadeira de rodas sozinha, comandada por botão. Dispensa alguém para erguer a cadeira a cada viagem.',
  },
};

export const ORDEM_ADAPTACOES = Object.keys(ADAPTACOES);
