import React, { FC } from 'react';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import SvgIcon from '../SvgIcon';

interface Props {
  icon: {
    id: string;
    width?: number;
    height?: number;
    viewBox: string;
    fillColor?: string;
    hoverFillColor?: string;
    strokeColor?: string;
    transformProp?: string;
  };
  text: string;
  color: string;
  type: 'next' | 'actual';
  isNew?: boolean
}

const AccountBenefitsItem: FC<Props> = observer(({icon, text, color, type, isNew }) => {
  const { t } = useTranslation();

  return (
    <FlexContainer alignItems="center" justifyContent="space-between" marginBottom="12px">
      <FlexContainer alignItems="center">
        <FlexContainer marginRight="8px">
          <SvgIcon
            {...icon}
            strokeColor={color}
            width={type === 'next' ? 20 : 24}
            height={type === 'next' ? 20 : 24}
            fillColor={color}
          />
        </FlexContainer>
        <PrimaryTextSpan
          color="#ffffff"
          fontSize="14px"
          lineHeight="21px"
          fontWeight={400}
        >
          {t(text)}
        </PrimaryTextSpan>
      </FlexContainer>
      {isNew && <FlexContainer
        width="37px"
        height="16px"
        padding="2px 4px"
        borderRadius="4px"
        background={color}
        alignItems="center"
        justifyContent="center"
      >
        <PrimaryTextSpan
          textTransform="uppercase"
          fontWeight={500}
          lineHeight="12px"
          fontSize="12px"
          color="#1C1F26"
        >
          {t('new')}
        </PrimaryTextSpan>
      </FlexContainer>}
    </FlexContainer>
  );
});

export default AccountBenefitsItem;
