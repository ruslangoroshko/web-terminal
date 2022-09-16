import React, { FC, useMemo } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import { observer } from 'mobx-react-lite';
import Colors from '../../constants/Colors';

interface Props {
  id: DocumentTypeEnum.Id |
    DocumentTypeEnum.FrontCard |
    DocumentTypeEnum.DriverLicenceFront,
  title: string,
  icon: any,
  description: string,
}

const KYCTypeOfId: FC<Props> = observer(({ id, title, icon, description }) => {
  const { t } = useTranslation();
  const {
    kycStore,
  } = useStores();

  const handleChangeActualType = () => {
    kycStore.setTypeOfId(id);
  };

  return (
    <TypeWrapper
      backgroundColor={
        id === kycStore.typeOfIdActual
          ? Colors.WHITE_TINE
          : 'rgba(255, 255, 255, 0.06)'
      }
      cursor="pointer"
      border={
        id === kycStore.typeOfIdActual
          ? `2px solid ${Colors.ACCENT}`
          : 'none'
      }
      boxShadow="inset 0px 1px 1px rgba(255, 255, 255, 0.04)"
      borderRadius="4px"
      padding="12px 32px 16px 12px"
      width="232px"
      minHeight="120px"
      flexDirection="column"
      onClick={handleChangeActualType}
    >
      <FlexContainer
        marginBottom="12px"
      >
        <SvgIcon {...icon} fillColor="none" />
      </FlexContainer>
      <PrimaryTextSpan
        fontWeight={700}
        fontSize="12px"
        lineHeight="16px"
        color={Colors.ACCENT}
        marginBottom="4px"
      >
        {t(title)}
      </PrimaryTextSpan>
      <PrimaryTextSpan
        fontWeight={400}
        fontSize="12px"
        lineHeight="16px"
        color={Colors.WHITE_DARK}
      >
        {t(description)}
      </PrimaryTextSpan>
    </TypeWrapper>
  );
})

export default KYCTypeOfId;

const TypeWrapper = styled(FlexContainer)`
  box-sizing: border-box;
`;