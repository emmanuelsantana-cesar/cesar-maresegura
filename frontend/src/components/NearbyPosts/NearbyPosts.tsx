import { useState } from 'react'
import clsx from 'clsx'
import { Card, CardHeader } from '../Card/Card'
import { postosProximos } from '../../mocks/painel'
import styles from './NearbyPosts.module.css'

export default function NearbyPosts({ className }: { className?: string }) {
  const [indice, setIndice] = useState(0)
  const total = postosProximos.length
  const par = postosProximos[indice]

  const anterior = () => setIndice((i) => (i - 1 + total) % total)
  const proximo = () => setIndice((i) => (i + 1) % total)

  return (
    <Card className={clsx(styles.nearbyCard, className)}>
      <CardHeader title="POSTOS DA ORLA" sub="BUSQUE OUTROS PONTOS DE BANHO" />

      <nav className={styles.nav}>
        <button className={styles.arrow} onClick={anterior} aria-label="Postos anteriores">‹</button>
        {par.map((p) => (
          <div key={p.nome} className={styles.nearCard}>
            <small>{p.nome}</small><b>{p.distancia}</b><span>{p.posto}</span>
          </div>
        ))}
        <button className={styles.arrow} onClick={proximo} aria-label="Próximos postos">›</button>
      </nav>
    </Card>
  )
}
