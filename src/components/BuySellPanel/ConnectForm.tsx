import { FC } from 'react';
import { useFormContext, UseFormMethods } from 'react-hook-form';
import { FormValues } from '../../types/Positions';

interface Props {
  children: (arg0: UseFormMethods<FormValues>) => React.ReactElement;
}

export const ConnectForm: FC<Props> = ({ children }) => {
  const methods = useFormContext<FormValues>();
  return children({ ...methods });
};
