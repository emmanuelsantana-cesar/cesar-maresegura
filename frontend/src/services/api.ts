// Comunicação com a API da placa (ESP32).
// Tudo que o painel lê da placa passa por aqui.

export type NivelRisco = 'BAIXO' | 'MODERADO' | 'ALTO'

// Resposta de GET /api/status (veja handleStatus() no .ino)
export type Status = {
  uptime: number // segundos desde que a placa ligou
  risco: NivelRisco
}

const TEMPO_LIMITE_MS = 3000

export async function buscarStatus(): Promise<Status> {
  const resposta = await fetch('/api/status', {
    cache: 'no-store',
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  })
  if (!resposta.ok) {
    throw new Error(`A placa respondeu ${resposta.status}`)
  }
  return resposta.json()
}
