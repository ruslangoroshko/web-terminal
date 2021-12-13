import { AccountStatusEnum } from '../enums/AccountStatusEnum';

import BackgroundSilver from '../assets/images/account-types/illustr-silver.png';
import BackgroundGold from '../assets/images/account-types/illustr-gold.png';
import BackgroundPlatinum from '../assets/images/account-types/illustr-platinum.png';
import BackgroundDiamond from '../assets/images/account-types/illustr-diamond.png';
import BackgroundVIP from '../assets/images/account-types/illustr-vip.png';

import IconConditions from '../assets/svg/account-types/icon-conditions-type.svg';
import IconEducation from '../assets/svg/icon-education.svg';
import IconInstruments from '../assets/svg/account-types/icon-instruments-type.svg';
import IconSpread from '../assets/svg/account-types/icon-spread-type.svg';
import IconSwap from '../assets/svg/account-types/icon-swap-type.svg';
import IconWebinar from '../assets/svg/account-types/icon-webinar.svg';

export const AccountToBe = {
  [AccountStatusEnum.Basic]: {
    color: '#ffffff',
    backgroundImage: BackgroundSilver,
    gradient: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) -0.6%, rgba(255, 255, 255, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    benefits: [
      {
        text: 'Unlock 150+ Instruments',
        icon: IconInstruments,
      },
      {
        text: 'Personal Account Management',
        icon: IconEducation,
      },
      {
        text: 'Basic Trading Conditions',
        icon: IconConditions,
      },
    ],
  },
  [AccountStatusEnum.Silver]: {
    color: '#CAE2F6',
    gradient: 'linear-gradient(90deg, rgba(202, 226, 246, 0.2) -0.6%, rgba(202, 226, 246, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    backgroundImage: BackgroundGold,
    benefits: [
      {
        text: 'Education Course',
        icon: IconEducation,
      },
      {
        text: 'Live Webinar',
        icon: IconWebinar,
      },
      {
        text: 'Advanced Analytics Tools',
        icon: IconConditions,
      },
      {
        text: 'Spread -20%',
        icon: IconSpread,
      },
    ],
  },
  [AccountStatusEnum.Gold]: {
    color: '#FFFCCC',
    gradient: 'linear-gradient(90deg, rgba(255, 252, 204, 0.2) -0.6%, rgba(255, 252, 204, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    backgroundImage: BackgroundPlatinum,
    benefits: [
      {
        text: 'Advanced Education',
        icon: IconEducation,
      },
      {
        text: 'Weekly Webinars',
        icon: IconWebinar,
      },
      {
        text: 'Custom Analytics',
        icon: IconConditions,
      },
      {
        text: 'Spread -30%',
        icon: IconSpread,
      },
      {
        text: 'Swap -30%',
        icon: IconSwap,
      },
    ],
  },
  [AccountStatusEnum.Platinum]: {
    color: '#00FFDD',
    gradient: 'linear-gradient(90deg, rgba(0, 255, 221, 0.2) -0.6%, rgba(0, 255, 221, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    backgroundImage: BackgroundDiamond,
    benefits: [
      {
        text: 'Tutorials at Request',
        icon: IconEducation,
      },
      {
        text: 'All Webinars',
        icon: IconWebinar,
      },
      {
        text: 'TOP Analytics',
        icon: IconConditions,
      },
      {
        text: 'Spread -50%',
        icon: IconSpread,
      },
      {
        text: 'Swap -50%',
        icon: IconSwap,
      },
    ],
  },
  [AccountStatusEnum.Diamond]: {
    color: '#7AD4FF',
    gradient: 'linear-gradient(90deg, rgba(122, 212, 255, 0.2) -0.6%, rgba(122, 212, 255, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    backgroundImage: BackgroundVIP,
    benefits: [
      {
        text: 'Personal trading assistance',
        icon: IconEducation,
      },
      {
        text: 'All Webinars',
        icon: IconWebinar,
      },
      {
        text: 'TOP Analytics',
        icon: IconConditions,
      },
      {
        text: 'Spread -70%',
        icon: IconSpread,
      },
      {
        text: 'Swap -70%',
        icon: IconSwap,
      },
    ],
  },
  [AccountStatusEnum.Vip]: {
    color: '#CAB1FF',
    gradient: 'linear-gradient(90deg, rgba(202, 177, 255, 0.2) -0.6%, rgba(202, 177, 255, 0) 99.4%), rgba(0, 0, 0, 0.3)',
    backgroundImage: BackgroundVIP,
    benefits: [],
  }
};

export const AccountComplete = {
  [AccountStatusEnum.Basic]: {
    color: '#ffffff',
    gradient: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(255, 255, 255, 0.4)',
    benefits: [],
  },
  [AccountStatusEnum.Silver]: {
    color: '#CAE2F6',
    gradient: 'linear-gradient(180deg, rgba(202, 226, 246, 0) 0%, rgba(202, 226, 246, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(202, 226, 246, 0.4)',
    benefits: [
      {
        text: '150+ Instruments',
        icon: IconInstruments,
        isNew: true,
      },
      {
        text: 'Introductory Session',
        icon: IconEducation,
        isNew: true,
      },
      {
        text: 'Basic Trading Conditions',
        icon: IconConditions,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.Gold]: {
    color: '#FFFCCC',
    gradient: 'linear-gradient(180deg, rgba(255, 252, 204, 0) 0%, rgba(255, 252, 204, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(255, 252, 204, 0.4)',
    benefits: [
      {
        text: '150+ Instruments',
        icon: IconInstruments,
        isNew: false,
      },
      {
        text: 'Education Course',
        icon: IconEducation,
        isNew: true,
      },
      {
        text: 'Live Webinar',
        icon: IconWebinar,
        isNew: true,
      },
      {
        text: 'Advanced Analytics Tools',
        icon: IconConditions,
        isNew: true,
      },
      {
        text: 'Spread -20%',
        icon: IconSpread,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.Platinum]: {
    color: '#00FFDD',
    gradient: 'linear-gradient(180deg, rgba(0, 255, 221, 0) 0%, rgba(0, 255, 221, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(0, 255, 221, 0.4)',
    benefits: [
      {
        text: '150+ Instruments',
        icon: IconInstruments,
        isNew: false,
      },
      {
        text: 'Advanced Education',
        icon: IconEducation,
        isNew: true,
      },
      {
        text: 'Weekly Webinars',
        icon: IconWebinar,
        isNew: true,
      },
      {
        text: 'Custom Analytics',
        icon: IconConditions,
        isNew: true,
      },
      {
        text: 'Spread -30%',
        icon: IconSpread,
        isNew: true,
      },
      {
        text: 'Swap -30%',
        icon: IconSwap,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.Diamond]: {
    color: '#7AD4FF',
    gradient: 'linear-gradient(180deg, rgba(122, 212, 255, 0) 0%, rgba(122, 212, 255, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(122, 212, 255, 0.4)',
    benefits: [
      {
        text: '150+ Instruments',
        icon: IconInstruments,
        isNew: false,
      },
      {
        text: 'Tutorials at Request',
        icon: IconEducation,
        isNew: true,
      },
      {
        text: 'All Webinars',
        icon: IconWebinar,
        isNew: true,
      },
      {
        text: 'TOP Analytics',
        icon: IconConditions,
        isNew: true,
      },
      {
        text: 'Spread -50%',
        icon: IconSpread,
        isNew: true,
      },
      {
        text: 'Swap -50%',
        icon: IconSwap,
        isNew: true,
      },
    ],
  },
  [AccountStatusEnum.Vip]: {
    color: '#CAB1FF',
    gradient: 'linear-gradient(180deg, rgba(202, 177, 255, 0) 0%, rgba(121, 89, 188, 0.4) 100%), #2F323C',
    boxShadow: 'rgba(121, 89, 188, 0.4)',
    benefits: [
      {
        text: '150+ Instruments',
        icon: IconInstruments,
        isNew: false,
      },
      {
        text: 'Personal trading assistance',
        icon: IconEducation,
        isNew: true,
      },
      {
        text: 'All Webinars',
        icon: IconWebinar,
        isNew: false,
      },
      {
        text: 'TOP Analytics',
        icon: IconConditions,
        isNew: false,
      },
      {
        text: 'Spread -70%',
        icon: IconSpread,
        isNew: true,
      },
      {
        text: 'Swap -70%',
        icon: IconSwap,
        isNew: true,
      },
    ],
  },
};

export const AccountInfoTable = {
  [AccountStatusEnum.Basic]: {
    color: '#ffffff',
    gradient: 'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
    description: {
      deposit: '$50',
      instruments: '7',
      personal_session: 'Education course',
      webinars: 'No',
      analystics: 'No',
      spread: 'No',
      swap: 'No',
    }
  },
  [AccountStatusEnum.Silver]: {
    color: '#CAE2F6',
    gradient: 'linear-gradient(90deg, rgba(202, 226, 246, 0.2) 0%, rgba(202, 226, 246, 0) 100%)',
    description: {
      deposit: '$250',
      instruments: '150+',
      personal_session: 'Introductory session',
      webinars: 'No',
      analystics: 'Basic indicators',
      spread: 'No',
      swap: 'No',
    }
  },
  [AccountStatusEnum.Gold]: {
    color: '#FFFCCC',
    gradient: 'linear-gradient(90deg, rgba(255, 252, 204, 0.2) 0%, rgba(255, 252, 204, 0) 100%)',
    description: {
      deposit: '$2,500',
      instruments: '150+',
      personal_session: 'Education course',
      webinars: 'Live webinar',
      analystics: 'Advance tools',
      spread: '-20%',
      swap: 'No',
    }
  },
  [AccountStatusEnum.Platinum]: {
    color: '#00FFDD',
    gradient: 'linear-gradient(90deg, rgba(0, 255, 221, 0.2) 0%, rgba(0, 255, 221, 0) 100%)',
    description: {
      deposit: '$10,000',
      instruments: '150+',
      personal_session: 'Advanced education',
      webinars: 'Weekly webinars',
      analystics: 'Custom analytics',
      spread: '-30%',
      swap: '-30%',
    }
  },
  [AccountStatusEnum.Diamond]: {
    color: '#7AD4FF',
    gradient: 'linear-gradient(90deg, rgba(122, 212, 255, 0.2) 0%, rgba(122, 212, 255, 0) 100%)',
    description: {
      deposit: '$25,000',
      instruments: '150+',
      personal_session: 'Tutorials at request',
      webinars: 'All webinars',
      analystics: 'TOP analytics',
      spread: '-50%',
      swap: '-50%',
    }
  },
  [AccountStatusEnum.Vip]: {
    color: '#CAB1FF',
    gradient: 'linear-gradient(90deg, rgba(121, 89, 188, 0.2) 0%, rgba(121, 89, 188, 0) 100%)',
    description: {
      deposit: '$75,000',
      instruments: '150+',
      personal_session: 'Personal trading assistance',
      webinars: 'All webinars',
      analystics: 'TOP analytics',
      spread: '-70%',
      swap: '-70%',
    }
  },
};