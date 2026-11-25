import clsx from 'clsx'
import { Card, CardHeader } from '../Card/Card'
import type { NivelRisco } from '../../services/api'
import type { Conexao } from '../../hooks/useStatus'
import styles from './RiskCard.module.css'

const niveis: { nivel: NivelRisco; classe: string }[] = [
  { nivel: 'BAIXO', classe: styles.low },
  { nivel: 'MODERADO', classe: styles.mid },
  { nivel: 'ALTO', classe: styles.high },
]

// Texto e cor do card para cada situação.
const visual = {
  BAIXO: {
    tema: styles.temaBaixo,
    tag: 'FAVORÁVEL',
    titulo: 'BAIXO',
    texto: 'Condições favoráveis. Mesmo assim, respeite a sinalização local.',
  },
  MODERADO: {
    tema: styles.temaModerado,
    tag: 'ATENÇÃO',
    titulo: 'MODERADO',
    texto: 'Entre somente após observar as condições e a sinalização local.',
  },
  ALTO: {
    tema: styles.temaAlto,
    tag: 'PERIGO',
    titulo: 'ALTO',
    texto: 'Evite entrar no mar. Siga as orientações dos guarda-vidas.',
  },
  conectando: {
    tema: styles.temaSemDados,
    tag: 'AGUARDE',
    titulo: 'CONECTANDO…',
    texto: 'Buscando as condições do mar na placa.',
  },
  offline: {
    tema: styles.temaSemDados,
    tag: 'SEM DADOS',
    titulo: 'SEM CONEXÃO',
    texto: 'Não foi possível obter o risco atual. Consulte os guarda-vidas antes de entrar.',
  },
}

const orientacoes = [
  'Respeite bandeiras, placas e orientações dos guarda-vidas.',
  'Não entre no mar sozinho ou após consumir álcool.',
  'Mantenha crianças sempre sob supervisão de um adulto.',
]

type RiskCardProps = {
  risco: NivelRisco | null // null = ainda sem dado confiável da placa
  conexao?: Conexao
  className?: string
}

export default function RiskCard({ risco, conexao = 'online', className }: RiskCardProps) {
  const v = risco ? visual[risco] : visual[conexao === 'conectando' ? 'conectando' : 'offline']

  return (
    <Card className={clsx(styles.riskCard, v.tema, className)}>
      <CardHeader title="RISCO DE BANHO" tag={v.tag} />

      <div className={styles.state} role="status" aria-live="polite">
        <div className={styles.orb} aria-hidden="true" />
        <div>
          <small>CONDIÇÕES DO MAR</small>
          <strong>{v.titulo}</strong>
          <span>{v.texto}</span>
        </div>
      </div>

      <div className={styles.legend} aria-label="Níveis de risco">
        {niveis.map(({ nivel, classe }) => (
          <div key={nivel} className={clsx(styles.level, classe, nivel === risco && styles.active)}>
            {nivel}
          </div>
        ))}
      </div>

      <div className={styles.note}>
        <b>Antes de entrar:</b> verifique correntes, ondas, visibilidade e orientações dos
        guarda-vidas. A classificação desta tela é ilustrativa.
      </div>
      <div className={styles.guard}>
        <span className={styles.dot} /> Respeite bandeiras e áreas sinalizadas.
      </div>

      <CardHeader title="ORIENTAÇÕES" sub="SEGURANÇA NA PRAIA" />
      <div className={styles.safetyPoints}>
        {orientacoes.map((texto) => (
          <div key={texto} className={styles.safetyPoint}>
            <span className={styles.check}>✓</span>
            <span>{texto}</span>
          </div>
        ))}
      </div>

      <div className={styles.emergencyRow}>
        <div className={styles.emergency}><small>Bombeiros · Salvamento</small><b>193</b></div>
        <div className={styles.emergency}><small>SAMU · Emergência médica</small><b>192</b></div>
      </div>
    </Card>
  )
}
