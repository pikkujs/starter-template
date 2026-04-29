import { z } from 'zod'
import { pikkuSessionlessFunc } from '#pikku'

export const HelloWorldInput = z.object({
  name: z.string().optional(),
})

export const HelloWorldOutput = z.object({
  message: z.string(),
  timestamp: z.string(),
})

export const helloWorld = pikkuSessionlessFunc({
  expose: true,
  description: 'A simple hello world function to get you started',
  input: HelloWorldInput,
  output: HelloWorldOutput,
  func: async ({ logger }, { name }) => {
    const greeting = name ? `Hello, ${name}!` : 'Hello, World!'
    logger.info(greeting)
    return {
      message: greeting,
      timestamp: new Date().toISOString(),
    }
  },
})
