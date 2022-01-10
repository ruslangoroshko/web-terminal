import { KYCPageStepsEnum } from '../enums/KYCsteps';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import IconId from '../assets/svg/icon-id.svg';
import IconDriver from '../assets/svg/icon-driver.svg';
import IconPassport from '../assets/svg/icon-passport.svg';

export const KYCTypesMain = [
  {
    id: KYCPageStepsEnum.Identity,
    title: 'Identity Document',
    comment: 'Required',
    description: 'The document must contain your name, address and date of formation',
    checkId: [
      DocumentTypeEnum.Id,
      [
        DocumentTypeEnum.DriverLicenceBack,
        DocumentTypeEnum.DriverLicenceFront,
      ],
      [
        DocumentTypeEnum.FrontCard,
        DocumentTypeEnum.BackCard,
      ],
    ]
  },
  {
    id: KYCPageStepsEnum.Address,
    title: 'Proof of Address',
    comment: 'Required',
    description: 'The document must contain your name, address and date created less than 3 months old',
    checkId: [DocumentTypeEnum.ProofOfAddress],
  },
  {
    id: KYCPageStepsEnum.BankCard,
    title: 'Bank Card',
    comment: 'For card payments only',
    description: 'If you make a deposit using a bank card, you need to confirm that it belongs to you',
    checkId: [
      [
        DocumentTypeEnum.BankCardBack,
        DocumentTypeEnum.BankCardFront,
      ],
    ],
  },
  {
    id: KYCPageStepsEnum.Additional,
    title: 'Additional Documents',
    comment: 'Upon the request',
    description: 'Proof of Payment, Proof of Wire Transfer (Invoice), Card Authorization Form',
    checkId: [
      DocumentTypeEnum.ProofOfPayment,
      DocumentTypeEnum.ProofOfWireTransfer,
      DocumentTypeEnum.CardAuthorizationForm,
    ],
  },
];

export const KYCTypeOfIdConst = [
  {
    id: DocumentTypeEnum.Id,
    title: 'Passport',
    icon: IconPassport,
    description: 'Upload a full-size photo of the first page of your passport',
  },
  {
    id: DocumentTypeEnum.DriverLicenceFront,
    title: 'Driving Licence',
    icon: IconDriver,
    description: 'Upload photos of the front and back sides of your driving licence',
  },
  {
    id: DocumentTypeEnum.FrontCard,
    title: 'ID card',
    icon: IconId,
    description: 'Upload a photo of the front and back sides of your ID Card',
  },
];

Object.freeze(KYCTypesMain);
