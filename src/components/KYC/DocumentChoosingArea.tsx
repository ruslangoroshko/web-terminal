import React, { useState } from 'react';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import { FlexContainer } from '../../styles/FlexContainer';
import YearMonthDropdown from './YearMonthDropdown';
import { getMonths } from '../../helpers/getMonths';
import { getYearsForBday } from '../../helpers/getYearsForBirthday';
import DragNDropArea from './DragNDropArea';

const DocumentChoosingArea = () => {
  const [error, setError] = useState(false);

  const [customImage, setCustomImage] = useState({
    file: new Blob(),
    fileSrc: '',
  });

  const handleFileReceive = (method: (file: any) => void) => (file: any) => {
    method({
      file,
      fileSrc: URL.createObjectURL(file),
    });
    setError(false);
  };

  return (
      <FlexContainer flexDirection="column">
        <FlexContainer
          flexDirection="column"
          margin="0 0 64px 0"
          minHeight="120px"
        >
          <DragNDropArea
            hasError={error}
            onFileReceive={handleFileReceive(setCustomImage)}
            file={customImage.file}
            fileUrl={customImage.fileSrc}
          />
        </FlexContainer>
      </FlexContainer>
  );
}

export default BirthDayPicker;
