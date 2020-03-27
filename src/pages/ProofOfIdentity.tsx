import React, { useState } from 'react'
import { FlexContainer } from '../styles/FlexContainer'
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import DragNDropArea from '../components/KYC/DragNDropArea';
import { PrimaryButton } from '../styles/Buttons';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Axios from 'axios';
import API from '../helpers/API';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import KeysInApi from '../constants/keysInApi';
import { appHistory } from '../routing/history';
import Page from '../constants/Pages';

interface Props {}

function ProofOfIdentity(props: Props) {

  const [customPassportId, setCustomPassportId] = useState({
    file: new Blob(),
    fileSrc: '',
  });
  const [customProofOfAddress, setCustomProofOfAddress] = useState({
    file: new Blob(),
    fileSrc: '',
  })

const handleFileReceive = (method: (file: any) => void) => (file: any) => {
  method({
    file,
    fileSrc: URL.createObjectURL(file)
  });
};

const submitFiles = async () => {
  try {
  await Axios.all([
    API.postDocument(DocumentTypeEnum.Id),
    API.postDocument(DocumentTypeEnum.Id),
  ]);
   try {
     const response = await Axios.all([API.getKeyValue(KeysInApi.PERSONAL_DATA),API.getKeyValue(KeysInApi.PHONE_VERIFICATION)]);
let personalData:any = {};
response.forEach(item => {
  personalData = { ...personalData, ...JSON.parse(item) };
})
API.postPersonalData(personalData).finally(() => {
  appHistory.push(Page.DASHBOARD);
})
   } catch (error) {
     
   }
  } catch (error) {
    
  }
}

    return (
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        backgroundColor="#252636"
        padding="40px 32px"
      >
        <FlexContainer
          width="568px"
          flexDirection="column"
          padding="20px 0 0 0"
        >
          <PrimaryTextParagraph
            fontSize="30px"
            fontWeight="bold"
            color="#fffccc"
            marginBottom="8px"
          >
            Proof of indentity
          </PrimaryTextParagraph>
          <PrimaryTextSpan
            marginBottom="40px"
            fontSize="14px"
            lineHeight="20px"
            color="rgba(255, 255, 255, 0.4)"
          >
            The documents you sent must be clearly visible. This step is
            necessary in accordance
            <br />
            with the regulatory requirements.
          </PrimaryTextSpan>
          <PrimaryTextParagraph
            fontSize="20px"
            fontWeight="bold"
            color="#fffccc"
            marginBottom="6px"
          >
            Passport or ID Card
          </PrimaryTextParagraph>
          <PrimaryTextParagraph
            fontSize="14px"
            color="#fffccc"
            marginBottom="16px"
          >
            The document should clearly show:
          </PrimaryTextParagraph>
          <PrimaryTextSpan
            marginBottom="32px"
            fontSize="14px"
            lineHeight="20px"
            color="rgba(255, 255, 255, 0.4)"
          >
            Your full name / Your photo / Date of birth / Expiry date / Document
            number / Your signature
          </PrimaryTextSpan>
          <FlexContainer flexDirection="column" margin="0 0 64px 0">
            <DragNDropArea
              onFileReceive={handleFileReceive(setCustomPassportId)}
              file={customPassportId.file}
              fileUrl={customPassportId.fileSrc}
            ></DragNDropArea>
          </FlexContainer>
          <PrimaryTextParagraph
            fontSize="20px"
            fontWeight="bold"
            color="#fffccc"
            marginBottom="6px"
          >
            Housing and communal services receipt
          </PrimaryTextParagraph>
          <PrimaryTextParagraph
            fontSize="14px"
            color="#fffccc"
            marginBottom="16px"
          >
            The Document that should contain the address of your current
            residence:
          </PrimaryTextParagraph>
          <PrimaryTextSpan
            marginBottom="32px"
            fontSize="14px"
            lineHeight="20px"
            color="rgba(255, 255, 255, 0.4)"
          >
            Street address / City / Province / State / Country
          </PrimaryTextSpan>
          <FlexContainer flexDirection="column" margin="0 0 64px 0">
            <DragNDropArea
              onFileReceive={handleFileReceive(setCustomProofOfAddress)}
              file={customProofOfAddress.file}
              fileUrl={customProofOfAddress.fileSrc}
            ></DragNDropArea>
          </FlexContainer>
          <FlexContainer margin="0 0 32px 0">
            <PrimaryButton padding="8px 32px">Save and continue</PrimaryButton>
          </FlexContainer>
          <FlexContainer>
            <ButtonWithoutStyles onClick={submitFiles}>
              <PrimaryTextSpan color="#07FAFF" fontSize="14px">
                Attach documents later
              </PrimaryTextSpan>
            </ButtonWithoutStyles>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    );
}

export default ProofOfIdentity
