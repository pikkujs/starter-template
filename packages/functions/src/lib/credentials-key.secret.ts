import { wireSecret } from '@pikku/core/secret'
import { z } from 'zod'

export const CredentialsKeySchema = z.string()

wireSecret({
  name: 'credentialsKey',
  displayName: 'Credentials Encryption Key',
  description:
    'Encrypts per-user credentials at rest (addons imported with --auth per-user or delegated). Optional: apps without per-user credentials run without it.',
  secretId: 'CREDENTIALS_KEY',
  schema: CredentialsKeySchema,
})
