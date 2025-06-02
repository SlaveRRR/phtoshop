import { createContext } from 'react';
import { AppContext } from './types';

export const appContext = createContext<AppContext>({} as AppContext);
