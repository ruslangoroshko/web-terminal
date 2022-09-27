import React, { useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import IconFileUpload from '../../assets/svg/icon-upload-file.svg';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconClose from '../../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useTranslation } from 'react-i18next';
import { DocumentTypeEnum } from '../../enums/DocumentTypeEnum';
import { useStores } from '../../hooks/useStores';
import Colors from '../../constants/Colors';

interface Props {
  onFileReceive: (file: Blob) => void;
  file: any;
  fileUrl: string;
  hasError?: boolean;
  typeOfFile?: string;
  typeForEnum?: DocumentTypeEnum;
}

const FIVE_MB = 5242880;
const allowedFileTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
];

function DragNDropArea(props: Props) {
  const { onFileReceive, file, fileUrl, hasError = false, typeForEnum } = props;

  const { kycStore } = useStores();

  const [inputError, setError] = React.useState(false);
  React.useEffect(() => {
    setError(hasError);
  }, [hasError]);

  const onDrop = useCallback((acceptedFiles) => {
    setError(false);
    const file = acceptedFiles[0];

    if (file.size <= FIVE_MB && allowedFileTypes.includes(file.type)) {
      onFileReceive(acceptedFiles[0]);
    } else {
      setError(true);
    }
  }, []);

  const handleFileRemove = () => {
    onFileReceive(new Blob());
    if (typeForEnum !== undefined) {
      kycStore.setFile(null, typeForEnum);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const { t } = useTranslation();

  return file.size === 0 ? (
    <DnDWrapper
      {...getRootProps()}
      minHeight="120px"
      width="100%"
      borderRadius="4px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      marginBottom="32px"
      hasError={inputError}
    >
      <FileInput
        {...getInputProps()}
        accept=".png, .jpg, .jpeg, .pdf"
        multiple={false}
      />
      {isDragActive ? (
        <PrimaryTextSpan color={Colors.ACCENT} fontSize="14px">
          {t('Drop the files here')} ...
        </PrimaryTextSpan>
      ) : (
        <FlexContainer flexDirection="column" alignItems="center">
          <FlexContainer margin="0 0 10px 0">
            <SvgIcon {...IconFileUpload} fillColor={Colors.ACCENT} />
          </FlexContainer>
          <FlexContainer alignItems="center" marginBottom="6px">
            <PrimaryTextSpan
              color={Colors.WHITE}
              fontSize="16px"
              lineHeight="24px"
            >
              {t('Drop')}&nbsp;
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color={Colors.ACCENT}
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
            >
              '{t(props.typeOfFile || '')} {t('Photo')}'&nbsp;
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color={Colors.WHITE}
              fontSize="16px"
              lineHeight="24px"
            >
              {t('here to upload or')}&nbsp;
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color={Colors.PRIMARY}
              fontSize="16px"
              lineHeight="24px"
              textDecoration="underline"
            >
              {t('choose file')}
            </PrimaryTextSpan>
          </FlexContainer>
          <PrimaryTextSpan
            fontSize="13px"
            lineHeight="17px"
            color={Colors.WHITE_DARK}
          >
            {t('File size must be less 5 MB in PNG, JPEG, PDF format')}
          </PrimaryTextSpan>
        </FlexContainer>
      )}
    </DnDWrapper>
  ) : (
    <FlexContainer
      backgroundColor="#1C2026"
      padding="20px"
      alignItems="center"
      position="relative"
      marginBottom="16px"
    >
      <FlexContainer
        backgroundColor="#151919"
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        position="absolute"
        top="20px"
        right="20px"
      >
        <ButtonWithoutStyles onClick={handleFileRemove}>
          <SvgIcon {...IconClose} fillColor={Colors.WHITE_LIGHT} />
        </ButtonWithoutStyles>
      </FlexContainer>
      <FlexContainer>
        <FlexContainer width="46px" height="46px" margin="0 18px 0 0">
          <img src={fileUrl} width="100%" />
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <FileNameText
            color={Colors.WHITE_LIGHT}
            fontSize="16px"
            lineHeight="24px"
          >
            {file.name}
          </FileNameText>
          <PrimaryTextSpan
            fontSize="12px"
            lineHeight="18px"
            color={Colors.WHITE_LIGHT}
          >
            {Math.round(file.size / 1024)}kb
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}

export default DragNDropArea;

const DnDWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;
  will-change: border;
  border: ${({ hasError }) =>
    `1px dashed ${hasError ? Colors.DANGER : 'rgba(255, 255, 255, 0.3)'}`};
  outline: none;
  &:hover {
    cursor: pointer;
    border: 1px dashed ${Colors.PRIMARY};
  }
`;

const FileNameText = styled(PrimaryTextSpan)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  white-space: nowrap;
`;

const FileInput = styled.input``;
