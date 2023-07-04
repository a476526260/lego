import {userErrorMessage} from './user';
import {workErrorMessage} from './work';
import {utilErrorMessage} from './utils';

export type GlobalErrorTypes = keyof (typeof userErrorMessage & typeof workErrorMessage & typeof utilErrorMessage)
export const globalErrorMessages = {
  ...userErrorMessage,
  ...workErrorMessage,
  ...utilErrorMessage
};

