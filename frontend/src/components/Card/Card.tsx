import type { ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Card.module.css'

type CardProps = {
  className?: string
  children: ReactNode
}

// Caixa base de todos os cards do painel.
// Cada card específico passa a própria classe em `className` para mudar cor, posição etc.
export function Card({ className, children }: CardProps) {
  return <section className={clsx(styles.card, className)}>{children}</section>
}

type CardHeaderProps = {
  title: string
  tag?: string // selo com borda (destaque)
  sub?: string // texto discreto à direita
}

export function CardHeader({ title, tag, sub }: CardHeaderProps) {
  return (
    <div className={styles.head}>
      <h3>{title}</h3>
      {tag && <span className={styles.tag}>{tag}</span>}
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  )
}
