import { PersonalDataKYCEnum } from '../enums/PersonalDataKYCEnum';

const KYCStatus = {
  [PersonalDataKYCEnum.NotVerified]: 'NotVerified',
  [PersonalDataKYCEnum.OnVerification]: 'OnVerification',
  [PersonalDataKYCEnum.Verified]: 'Verified',
  [PersonalDataKYCEnum.Restricted]: 'Restricted',
};

Object.freeze(KYCStatus);

export default KYCStatus;
