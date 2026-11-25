import type { ReactNode } from 'react'
import Topbar from '../Topbar/Topbar'
import styles from './TotemLayout.module.css'

// Moldura comum a todas as páginas do totem: fundo + barra do topo.
export default function TotemLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.app}>
      <Topbar />
      {children}
    </div>
  )
}
