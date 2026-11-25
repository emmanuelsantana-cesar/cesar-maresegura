import { local, relogio } from '../../mocks/painel'
import styles from './Topbar.module.css'

export default function Topbar() {
  return (
    <header className={styles.topbar}>
      <div className={styles.brand}>
        <div className={styles.brandMark} aria-hidden="true">⛱️</div>
        <div>
          <h1>Maré Segura</h1>
          <p>Informação que protege · SRT</p>
        </div>
      </div>

      <div className={styles.place}>
        <div className={styles.eyebrow}>Monitoramento costeiro</div>
        <h2>{local.praia}</h2>
        <p>{local.cidade} &nbsp;|&nbsp; {local.quiosque}</p>
      </div>

      <div className={styles.topRight}>
        <div className={styles.postBadge}>
          <small>Número do posto</small>
          <strong>{local.posto}</strong>
        </div>
        <div className={styles.clock}>
          <strong>{relogio.hora}</strong>
          <small>{relogio.data}</small>
        </div>
      </div>
    </header>
  )
}
