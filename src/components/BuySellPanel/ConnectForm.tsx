import { FC } from 'react';
import { useFormContext, UseFormMethods } from 'react-hook-form';

interface Props {
  children: (arg0: UseFormMethods) => React.ReactElement;
}

export const ConnectForm: FC<Props> = ({ children }) => {
  const methods = useFormContext();
  return children({ ...methods });
};
