import '@mantine/core/styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { PikkuProvider } from '@pikku/react'
import { App } from './App'
import { pikku } from './lib/pikku'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PikkuProvider pikku={pikku}>
      <MantineProvider>
        <App />
      </MantineProvider>
    </PikkuProvider>
  </StrictMode>,
)
