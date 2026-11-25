// Dados de demonstração do painel.
// Cada bloco aqui vai ser trocado por dados reais (API da placa ou serviços externos).

export type NivelRisco = 'BAIXO' | 'MODERADO' | 'ALTO'

export const local = {
  praia: 'Praia de Boa Viagem',
  cidade: 'Recife · Pernambuco · Brasil',
  quiosque: 'Quiosque 12',
  posto: '07',
}

export const relogio = {
  hora: '11:27:00',
  data: 'Domingo, 15 de novembro',
}

export const risco: NivelRisco = 'MODERADO'

export const mare = {
  altura: '1,8',
  direcao: 'Subindo',
  eventos: [
    { titulo: 'Próxima maré alta', hora: '08:42', detalhe: '2,1 m · exemplo' },
    { titulo: 'Maré baixa', hora: '14:51', detalhe: '0,4 m · exemplo' },
    { titulo: 'Maré alta', hora: '21:05', detalhe: '2,0 m · exemplo' },
  ],
}

export const clima = {
  temperatura: 29,
  descricao: 'Parcialmente nublado',
  icone: '🌤️',
  stats: [
    { titulo: 'Vento', valor: '18 km/h', detalhe: 'Direção a integrar' },
    { titulo: 'Umidade', valor: '74%', detalhe: 'Valor ilustrativo' },
    { titulo: 'Chance de chuva', valor: '20%', detalhe: 'Valor ilustrativo' },
    { titulo: 'Sensação térmica', valor: '31 °C', detalhe: 'Valor ilustrativo' },
  ],
}

export const sol = {
  uv: '9 · MUITO ALTO',
  uvPosicao: 86, // posição do marcador na barra, em %
  nascer: '05:00',
  por: '17:20',
}

export const lua = {
  fase: 'Lua crescente',
  iluminacao: 78,
}

export type Posto = { nome: string; distancia: string; posto: string }

// Cada item é um par de postos mostrado lado a lado.
export const postosProximos: [Posto, Posto][] = [
  [
    { nome: 'Quiosque 11', distancia: '1,2 km', posto: 'Posto 06' },
    { nome: 'Quiosque 13', distancia: '0,8 km', posto: 'Posto 08' },
  ],
  [
    { nome: 'Quiosque 10', distancia: '1,7 km', posto: 'Posto 05' },
    { nome: 'Quiosque 14', distancia: '1,1 km', posto: 'Posto 09' },
  ],
  [
    { nome: 'Quiosque 09', distancia: '2,1 km', posto: 'Posto 04' },
    { nome: 'Quiosque 15', distancia: '1,6 km', posto: 'Posto 10' },
  ],
]
