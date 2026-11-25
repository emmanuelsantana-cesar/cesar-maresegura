import { useEffect, useState } from 'react'
import { buscarStatus, type Status } from '../services/api'

const INTERVALO_MS = 1000 // de quanto em quanto tempo pergunta para a placa
const SEM_CONEXAO_APOS_MS = 5000 // sem resposta por esse tempo = "sem conexão"

export type Conexao = 'conectando' | 'online' | 'offline'

// Lê /api/status da placa a cada INTERVALO_MS.
// A próxima leitura só começa depois que a anterior termina,
// para não acumular pedidos na ESP32 (ela atende um por vez).
export function useStatus() {
  const [status, setStatus] = useState<Status | null>(null)
  const [conexao, setConexao] = useState<Conexao>('conectando')

  useEffect(() => {
    let ativo = true
    let timer: ReturnType<typeof setTimeout>
    let ultimaResposta = Date.now()

    async function ler() {
      try {
        const novo = await buscarStatus()
        if (!ativo) return
        ultimaResposta = Date.now()
        setStatus(novo)
        setConexao('online')
      } catch {
        if (!ativo) return
        // Uma falha isolada (Wi-Fi oscilando) não derruba a tela;
        // só depois de SEM_CONEXAO_APOS_MS sem nenhuma resposta.
        if (Date.now() - ultimaResposta > SEM_CONEXAO_APOS_MS) {
          setConexao('offline')
        }
      }
      if (ativo) timer = setTimeout(ler, INTERVALO_MS)
    }

    ler()
    return () => {
      ativo = false
      clearTimeout(timer)
    }
  }, [])

  // Sem conexão, não mostramos um risco antigo: a tela pode estar desatualizada.
  return {
    risco: conexao === 'online' ? status?.risco ?? null : null,
    conexao,
  }
}
