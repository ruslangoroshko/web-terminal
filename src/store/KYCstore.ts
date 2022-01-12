import { action, makeAutoObservable } from 'mobx';
import { KYCPageStepsEnum, KYCstepsEnum } from '../enums/KYCsteps';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';

interface Props {
  currentStep: KYCstepsEnum;
  filledStep: KYCstepsEnum;
  actualPageStep: KYCPageStepsEnum;
}

export class KYCstore implements Props {
  currentStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  filledStep: KYCstepsEnum = KYCstepsEnum.PhoneVerification;
  actualPageStep: KYCPageStepsEnum = KYCPageStepsEnum.Main;
  allFiles = {
    [DocumentTypeEnum.Id]: null,
    [DocumentTypeEnum.ProofOfAddress]: null,
    [DocumentTypeEnum.FrontCard]: null,
    [DocumentTypeEnum.BackCard]: null,
    [DocumentTypeEnum.DepositLetter]: null,
    [DocumentTypeEnum.Other]: null,
    [DocumentTypeEnum.DriverLicenceFront]: null,
    [DocumentTypeEnum.DriverLicenceBack]: null,
    [DocumentTypeEnum.BankCardFront]: null,
    [DocumentTypeEnum.BankCardBack]: null,
    [DocumentTypeEnum.ProofOfPayment]: null,
    [DocumentTypeEnum.ProofOfWireTransfer]: null,
    [DocumentTypeEnum.CardAuthorizationForm]: null,
  };
  typeOfIdActual:
    DocumentTypeEnum.Id |
    DocumentTypeEnum.FrontCard |
    DocumentTypeEnum.DriverLicenceFront = DocumentTypeEnum.Id;
  showPopup: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setFile = (newFile: any, type: DocumentTypeEnum) => {
    this.allFiles = {
      ...this.allFiles,
      [type]: newFile,
    };
  };

  @action
  setTypeOfId = (newActualType: DocumentTypeEnum.Id |
    DocumentTypeEnum.FrontCard |
    DocumentTypeEnum.DriverLicenceFront) => {
    this.typeOfIdActual = newActualType;
  };

  @action
  setCurrentStep = (newCurrentStep: KYCstepsEnum) => {
    this.currentStep = newCurrentStep;
  };

  @action
  setCurrentPageStep = (newCurrentStep: KYCPageStepsEnum) => {
    this.actualPageStep = newCurrentStep;
  };

  @action
  setFilledStep = (newFilledStep: KYCstepsEnum) => {
    this.filledStep = newFilledStep;
  };

  @action
  setShowPopup = (newValue: boolean) => {
    this.showPopup = newValue;
  };

  @action
  resetKYCStore = () => {
    this.allFiles = {
      [DocumentTypeEnum.Id]: null,
      [DocumentTypeEnum.ProofOfAddress]: null,
      [DocumentTypeEnum.FrontCard]: null,
      [DocumentTypeEnum.BackCard]: null,
      [DocumentTypeEnum.DepositLetter]: null,
      [DocumentTypeEnum.Other]: null,
      [DocumentTypeEnum.DriverLicenceFront]: null,
      [DocumentTypeEnum.DriverLicenceBack]: null,
      [DocumentTypeEnum.BankCardFront]: null,
      [DocumentTypeEnum.BankCardBack]: null,
      [DocumentTypeEnum.ProofOfPayment]: null,
      [DocumentTypeEnum.ProofOfWireTransfer]: null,
      [DocumentTypeEnum.CardAuthorizationForm]: null,
    };
    this.typeOfIdActual = DocumentTypeEnum.Id;
    this.currentStep = KYCstepsEnum.PhoneVerification;
    this.filledStep = KYCstepsEnum.PhoneVerification;
    this.actualPageStep = KYCPageStepsEnum.Main;
    this.showPopup = false;
  }
}
