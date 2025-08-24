import DashboardCard from '@/components/common/DashboardCard';
import styles from './Dashboard.module.css';

export default function MemberDashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <DashboardCard
          title="Mis Avistamientos"
          description="Registra nuevos avistamientos de especies"
          path="/member/sightings"
        />

        <DashboardCard
          title="Explorar Ecosistemas"
          description="Descubre especies en diferentes ecosistemas"
          onClick={() => console.log('Explorar Ecosistemas - En desarrollo')}
        />

        <DashboardCard
          title="Mi Perfil"
          description="Gestiona tu información personal"
          onClick={() => console.log('Mi Perfil - En desarrollo')}
        />

        <DashboardCard
          title="Historial"
          description="Revisa tu actividad en la plataforma"
          onClick={() => console.log('Historial - En desarrollo')}
        />
      </div>
    </div>
  );
}
