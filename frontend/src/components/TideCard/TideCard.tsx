import { Card, CardHeader } from '../Card/Card'
import { mare } from '../../mocks/painel'
import styles from './TideCard.module.css'

export default function TideCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader title="MARÉ AGORA" tag="TÁBUA DE MARÉS · DEMO" />

      <div className={styles.current}>
        <strong>{mare.altura} <span>m</span></strong>
        <div className={styles.direction}>↗ <b>{mare.direcao}</b><span>Altura ilustrativa</span></div>
      </div>

      <svg className={styles.chart} viewBox="0 0 620 110" preserveAspectRatio="none" role="img"
        aria-label="Gráfico ilustrativo da variação da maré">
        <defs>
          <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#40d2ee" stopOpacity=".3" />
            <stop offset="1" stopColor="#40d2ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 81 C60 77 86 20 158 18 S250 91 324 87 S410 25 470 27 S555 85 620 64 L620 110H0Z"
          fill="url(#tideFill)" />
        <path d="M0 81 C60 77 86 20 158 18 S250 91 324 87 S410 25 470 27 S555 85 620 64" fill="none"
          stroke="#52d9f2" strokeWidth="3" />
        <path d="M0 53H620" stroke="#9bd7e7" strokeOpacity=".3" strokeDasharray="5 7" />
        <circle cx="385" cy="48" r="6" fill="#e9fbff" stroke="#42d1ed" strokeWidth="3" />
        <g fill="#88afc1" fontSize="10">
          <text x="0" y="105">06h</text>
          <text x="195" y="105">10h</text>
          <text x="390" y="105">14h</text>
          <text x="590" y="105">18h</text>
        </g>
      </svg>

      <div className={styles.events}>
        {mare.eventos.map((e) => (
          <div key={e.titulo} className={styles.event}>
            <small>{e.titulo}</small><b>{e.hora}</b><span>{e.detalhe}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
