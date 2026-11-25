import clsx from 'clsx'
import { Card, CardHeader } from '../Card/Card'
import type { NivelRisco } from '../../mocks/painel'
import styles from './RiskCard.module.css'

const niveis: { nivel: NivelRisco; classe: string }[] = [
  { nivel: 'BAIXO', classe: styles.low },
  { nivel: 'MODERADO', classe: styles.mid },
  { nivel: 'ALTO', classe: styles.high },
]

const orientacoes = [
  'Respeite bandeiras, placas e orientações dos guarda-vidas.',
  'Não entre no mar sozinho ou após consumir álcool.',
  'Mantenha crianças sempre sob supervisão de um adulto.',
]

type RiskCardProps = {
  risco: NivelRisco
  className?: string
}

export default function RiskCard({ risco, className }: RiskCardProps) {
  return (
    <Card className={clsx(styles.riskCard, className)}>
      <CardHeader title="RISCO DE BANHO" tag="ATENÇÃO" />

      <div className={styles.state}>
        <div className={styles.orb} aria-hidden="true" />
        <div>
          <small>CONDIÇÕES DO MAR</small>
          <strong>{risco}</strong>
          <span>Entre somente após observar as condições e a sinalização local.</span>
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
