import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks/useStores';

const EventBonusTimer = observer(() => {
  let timerInterval: any;

  const { bonusStore, mainAppStore } = useStores();
  const { t } = useTranslation();

  const [timeLeft, setTimeLeft] = useState('');
  const countDown = () => {
    const interval = 1000;
    timerInterval = setInterval(function () {
      let eventTime = bonusStore.bonusExpirationDate || 0;
      let currentTime = Math.floor(new Date().getTime());
      let diffTime = eventTime - currentTime;
      let duration: any = moment.duration(diffTime, 'milliseconds');

      // update bonus info if exp
      if (currentTime >= eventTime) {
        bonusStore.getUserBonus();
      }

      if (duration.days() > 0) {
        setTimeLeft(
          `${duration.days()} ${t('days')} ${duration.hours()} ${t('hours')}`
        );
        return;
      }

      if (duration.hours() > 0) {
        setTimeLeft(
          `${duration.hours()} ${t('hours')} ${duration.minutes()} ${t(
            'minutes'
          )}`
        );
        return;
      }

      setTimeLeft(
        `${duration.minutes()} ${t('minutes')} ${duration.seconds()} ${t(
          'seconds'
        )}`
      );
    }, interval);
  };

  useEffect(() => {
    countDown();
    // clearInterval
    return () => {
      clearInterval(timerInterval);
    };
  }, [bonusStore.bonusExpirationDate]);

  return <>{`${t('Only')} ${timeLeft} ${t('left')}`}</>;
});

export default EventBonusTimer;
