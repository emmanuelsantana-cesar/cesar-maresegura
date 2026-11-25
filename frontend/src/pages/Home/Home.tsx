import TotemLayout from '../../components/TotemLayout/TotemLayout'
import RiskCard from '../../components/RiskCard/RiskCard'
import TideCard from '../../components/TideCard/TideCard'
import WeatherCard from '../../components/WeatherCard/WeatherCard'
import SunCard from '../../components/SunCard/SunCard'
import MoonCard from '../../components/MoonCard/MoonCard'
import NearbyPosts from '../../components/NearbyPosts/NearbyPosts'
import { useStatus } from '../../hooks/useStatus'
import styles from './Home.module.css'

// Tela principal do totem. A página só decide ONDE cada card fica;
// a aparência de cada card fica dentro do próprio componente.
export default function Home() {
  // Risco vem da placa: muda quando alguém aperta o botão SELECT.
  const { risco, conexao } = useStatus()

  return (
    <TotemLayout>
      <main className={styles.grid}>
        <RiskCard risco={risco} conexao={conexao} className={styles.risk} />
        <TideCard className={styles.tide} />
        <WeatherCard className={styles.weather} />
        <SunCard className={styles.sun} />
        <MoonCard className={styles.moon} />
        <NearbyPosts className={styles.nearby} />
      </main>
    </TotemLayout>
  )
}
