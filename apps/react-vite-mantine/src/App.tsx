import { useEffect, useState } from 'react'
import { usePikkuFetch } from '@pikku/react'
import { Container, Title, Text, Code } from '@mantine/core'

export function App() {
  const fetch = usePikkuFetch()
  const [data, setData] = useState<{ message: string; timestamp: string }>({
    message: 'Hello, World!',
    timestamp: '…',
  })

  useEffect(() => {
    fetch
      .post('/hello', {})
      .then((d) => setData(d))
      .catch((err: Error) => setData({ message: 'Hello, World!', timestamp: `error: ${err.message}` }))
  }, [fetch])

  return (
    <Container py="xl">
      <Title order={1} data-testid="hello-message">{data.message}</Title>
      <Text mt="sm" c="dimmed" data-testid="hello-source">client:react-vite</Text>
      <Code data-testid="hello-timestamp" mt="sm">{data.timestamp}</Code>
    </Container>
  )
}
