import React, { useCallback } from 'react'
import { FlexContainer } from '../../styles/FlexContainer';
import IconFileUpload from '../../assets/svg/icon-upload-file.svg'
import styled from '@emotion/styled';
import {useDropzone} from 'react-dropzone'
import SvgIcon from '../SvgIcon';
import { PrimaryTextSpan } from '../../styles/TextsElements';

interface Props {}

function DragNDropArea(props: Props) {
    const {} = props
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
      }, [])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
    
      return (
        <DnDWrapper
          {...getRootProps()}
          border="1px dashed rgba(255, 255, 255, 0.3)"
          height="120px"
          width="100%"
          borderRadius="4px"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <PrimaryTextSpan color="#fffccc" fontSize="14px">
              Drop the files here ...
            </PrimaryTextSpan>
          ) : (
            <FlexContainer flexDirection="column" alignItems="center">
              <FlexContainer margin="0 0 10px 0">
                <SvgIcon {...IconFileUpload} fillColor="#fffccc" />
              </FlexContainer>
              <PrimaryTextSpan color="#777A7A" fontSize="14px">
                Drop file here to upload or{' '}
                <PrimaryTextSpan color="#00FFDD" textDecoration="underline">
                  choose file
                </PrimaryTextSpan>
              </PrimaryTextSpan>
            </FlexContainer>
          )}
        </DnDWrapper>
      );
   
}

export default DragNDropArea

const DnDWrapper = styled(FlexContainer)`
  transition: all 0.2s ease;

  &:hover {
    cursor: pointer;
    border: 1px dashed #00ffdd;
  }
`;