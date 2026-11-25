import { Card, CardHeader } from '../Card/Card'
import { lua } from '../../mocks/painel'
import styles from './MoonCard.module.css'

const fases = [
  { simbolo: '●', nome: 'Nova' },
  { simbolo: '◔', nome: 'Crescente' },
  { simbolo: '○', nome: 'Cheia' },
  { simbolo: '◑', nome: 'Minguante' },
]

export default function MoonCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader title="FASES DA LUA" sub="CALENDÁRIO LUNAR" />

      <div className={styles.current}>
        <div className={styles.disc} aria-hidden="true" />
        <div>
          <b>{lua.fase}</b>
          <small>
            Iluminação ilustrativa: {lua.iluminacao}%<br />Fase a atualizar por calendário astronômico.
          </small>
        </div>
      </div>

      <div className={styles.phases}>
        {fases.map((f) => (
          <div key={f.nome} className={styles.phase}>
            <i>{f.simbolo}</i><small>{f.nome}</small>
          </div>
        ))}
      </div>
    </Card>
  )
}
