import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import HintBlock from './HintBlock';
import { useStores } from '../../hooks/useStores';
import { HintEnum } from '../../enums/HintsEnum';
import { IHint } from '../../types/HintsTypes';
import { HINT_DATA } from '../../constants/hintsData';
import { observer } from 'mobx-react-lite';

interface Props {
  hintType: HintEnum;
}

const HintsWrapper = observer(({ hintType }: Props) => {
  const { educationStore } = useStores();

  const [step, setStep] = useState<number>(0);
  const [activeFlowData, setData] = useState<IHint[] | null>(null);

  const handleClose = () => {
    educationStore.closeHint();
  };

  const handleNext = () => {
    const totalCount = activeFlowData?.length || 0;
    if (activeFlowData === null || activeFlowData[step].order === totalCount) {
      return;
    }
    setStep(step + 1);
  };

  useEffect(() => {
    const hintData = HINT_DATA[hintType] || null;
    if (
      hintData !== null &&
      (
        !educationStore.educationIsLoaded ||
        educationStore.coursesList === null ||
        educationStore.coursesList.filter(
          (item) => item.id && item.totalQuestions > 0
        ).length === 0
      )
    ) {
      setData(hintData.filter((hint) => !hint.text.includes('education')));
    } else {
      setData(hintData);
    }
  }, [
    hintType,
    educationStore.educationIsLoaded,
    educationStore.coursesList
  ]);

  if (activeFlowData === null) {
    return null;
  }

  return (
    <FlexContainer
      width="100vw"
      height="100vh"
      position="fixed"
      top="0"
      left="0"
      right="0"
      margin="0 auto"
      zIndex="198"
    >
      <HintBlock
        item={activeFlowData[step]}
        onClose={handleClose}
        onNext={handleNext}
        total={activeFlowData.length}
        currentStepNum={step + 1}
      />
    </FlexContainer>
  );
});

export default HintsWrapper;
