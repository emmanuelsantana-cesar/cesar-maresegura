import { Card, CardHeader } from '../Card/Card'
import { clima } from '../../mocks/painel'
import styles from './WeatherCard.module.css'

export default function WeatherCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader title="PREVISÃO DO TEMPO" sub="HOJE · EXEMPLO" />

      <div className={styles.now}>
        <div className={styles.icon} aria-hidden="true">{clima.icone}</div>
        <div>
          <div className={styles.temperature}>{clima.temperatura}<span>°C</span></div>
          <div className={styles.desc}>{clima.descricao}</div>
        </div>
      </div>

      <div className={styles.stats}>
        {clima.stats.map((s) => (
          <div key={s.titulo} className={styles.stat}>
            <small>{s.titulo}</small><b>{s.valor}</b><span>{s.detalhe}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
