import React from 'react';
import Image from 'next/image';
import styles from './mem-couponCard.module.css';

export default function MemCouponCard({ src, name, content, money, time }) {
  return (
    <div className={styles.card}>
      <div className={styles.boxImg}>
        <Image
          src={src}
          width={60}
          height={100}
          style={{ objectFit: 'cover' }}
          className={styles.boxImg2}
          alt=""
        />
      </div>
      <div>
        <div className={styles.box}>
          <div> 名稱 :</div> <div className={styles.detail}>{name}</div>
        </div>
        <div className={styles.box}>
          <div> 來源 :</div> <div className={styles.detail}>{content}</div>
        </div>
        <div className={styles.box}>
          <div> 折扣 :</div> <div className={styles.detail}>{money}</div>
        </div>
        <div className={styles.box}>
          <div> 期限 :</div> <div className={styles.detail}>{time}</div>
        </div>
      </div>
    </div>
  );
}
