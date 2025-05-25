"use client"

import store from '@/store/store'
import React, { ReactNode } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'    

const persistor = persistStore(store)

const ClientProvider = ({children}:{children:ReactNode}) => {
  return (
    <Provider store = {store}>
        <PersistGate loading={null} persistor={persistor}>
            {children}
        </PersistGate>
    </Provider>
  )
}

export default ClientProvider