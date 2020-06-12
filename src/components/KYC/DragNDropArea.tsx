import React, { useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import IconFileUpload from '../../assets/svg/icon-upload-file.svg';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconClose from '../../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

interface Props {
  onFileReceive: (file: Blob) => void;
  file: any;
  fileUrl: string;
  hasError?: boolean;
}

const FIVE_MB = 5242880;
const allowedFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

function DragNDropArea(props: Props) {
  const { onFileReceive, file, fileUrl, hasError = false } = props;

  const [inputError, setError] = React.useState(false);
  React.useEffect(() => {
    setError(hasError);
  }, [hasError]);

  const onDrop = useCallback(acceptedFiles => {
    setError(false);
    const file = acceptedFiles[0];
    console.log(file);

    if (file.size <= FIVE_MB && allowedFileTypes.includes(file.type)) {
      onFileReceive(acceptedFiles[0]);
    } else {
      setError(true);
    }
  }, []);

  const handleFileRemove = () => {
    onFileReceive(new Blob());
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return file.size === 0 ? (
    <DnDWrapper
      {...getRootProps()}
      minHeight="120px"
      width="100%"
      borderRadius="4px"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      hasError={inputError}
    >
      <FileInput
        {...getInputProps()}
        accept=".png, .jpg, .jpeg"
        multiple={false}
      />
      {isDragActive ? (
        <PrimaryTextSpan color="#fffccc" fontSize="14px">
          Drop the files here ...
        </PrimaryTextSpan>
      ) : (
        <FlexContainer flexDirection="column" alignItems="center">
          <FlexContainer margin="0 0 10px 0">
            <SvgIcon {...IconFileUpload} fillColor="#fffccc" />
          </FlexContainer>
          <PrimaryTextSpan color="#777A7A" fontSize="14px" marginBottom="4px">
            Drop file here to upload or{' '}
            <PrimaryTextSpan color="#00FFDD" textDecoration="underline">
              choose file
            </PrimaryTextSpan>
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255,255,255,0.4)">
            Maximum upload file size: 5MB
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255,255,255,0.4)">
            Allowed file types: png, jpg
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
          <SvgIcon {...IconClose} fillColor="rgba(255,255,255,0.4)" />
        </ButtonWithoutStyles>
      </FlexContainer>
      <FlexContainer>
        <FlexContainer width="46px" height="46px" margin="0 18px 0 0">
          <img src={fileUrl} width="100%" />
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan
            fontSize="11px"
            color="rgba(255,255,255,0.4)"
            marginBottom="8px"
          >
            Front side photo of your document
          </PrimaryTextSpan>
          <FileNameText color="#fffccc" fontSize="14px">
            {file.name} -{' '}
            <PrimaryTextSpan color="rgba(255,255,255,0.4)">
              {Math.round(file.size / 1024)}kb
            </PrimaryTextSpan>
          </FileNameText>
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
    `1px dashed ${hasError ? '#d44e4e' : 'rgba(255, 255, 255, 0.3)'}`};
  outline: none;
  &:hover {
    cursor: pointer;
    border: 1px dashed #00ffdd;
  }
`;

const FileNameText = styled(PrimaryTextSpan)`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  white-space: nowrap;
`;

const FileInput = styled.input``;
