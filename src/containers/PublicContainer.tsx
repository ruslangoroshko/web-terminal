import { Observer, observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import NotificationPopup from '../components/NotificationPopup';
import { useStores } from '../hooks/useStores';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {}

const PublicContainer: FC<Props> = observer((props) => {
  const { children } = props;
  const { notificationStore } = useStores()

  return (
    <FlexContainer height="100vh" width="100%">
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="1005"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={
                notificationStore.isActiveNotification &&
                !notificationStore.isActiveNotificationGlobal
              }
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>

      {children}
    </FlexContainer>
  );
});

export default PublicContainer;