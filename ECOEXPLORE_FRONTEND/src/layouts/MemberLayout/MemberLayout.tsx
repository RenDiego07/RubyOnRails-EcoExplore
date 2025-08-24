import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/common/Header';
import styles from './MemberLayout.module.css';

export default function MemberLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
