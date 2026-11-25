import { Card, CardHeader } from '../Card/Card'
import { sol } from '../../mocks/painel'
import styles from './SunCard.module.css'

export default function SunCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader title="INCIDÊNCIA SOLAR" tag="PROTEJA-SE" />

      <div className={styles.uvRow}>
        <span>Índice UV</span>
        <strong>{sol.uv}</strong>
      </div>
      <div className={styles.uvBar}>
        <span className={styles.uvPointer} style={{ left: `${sol.uvPosicao}%` }} />
      </div>

      <div className={styles.times}>
        <div className={styles.time}><small>☀ Nascer do sol</small><b>{sol.nascer}</b></div>
        <div className={styles.time}><small>🌅 Pôr do sol</small><b>{sol.por}</b></div>
      </div>

      <div className={styles.advice}>
        Use protetor solar, reaplique conforme as instruções, procure sombra e use proteção
        adequada. Horários e índice ilustrativos.
      </div>
    </Card>
  )
}
