import type { FC } from 'react'
import { Button, Menu, Text } from '@pikku/mantine/core'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { usePikkuQuery } from '@project/functions-sdk/pikku/api.gen'
import { appSlug } from '@/app-meta'
import { signInAsPersona } from '@/lib/auth'
import { asI18n, m } from '@/i18n/messages'

/** Floating "Sign in as" persona switcher; renders nothing unless the devSwitcher flag is on. */
export const DevActorSwitcher: FC = () => {
  const navigate = useNavigate()
  const list = usePikkuQuery('listDevActors', { app: appSlug })
  const signIn = useMutation({
    mutationFn: (id: string) => signInAsPersona(id),
    onSuccess: () => navigate({ to: '/app' }),
  })
  const actors = list.data?.actors ?? []
  if (actors.length === 0) return null
  return (
    <Menu position="top-end" withArrow>
      <Menu.Target>
        <Button
          size="xs"
          variant="light"
          style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          {m.dev_actors__cta()}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{m.dev_actors__label()}</Menu.Label>
        {actors.map((actor) => {
          const busy = signIn.isPending && signIn.variables === actor.id
          return (
            <Menu.Item
              key={actor.id}
              disabled={signIn.isPending}
              onClick={() => signIn.mutate(actor.id)}
            >
              <Text size="sm" fw={500}>
                {asI18n(busy ? `${actor.name} …` : actor.name)}
              </Text>
              {actor.jobTitle ? (
                <Text size="xs" c="dimmed">
                  {asI18n(actor.jobTitle)}
                </Text>
              ) : null}
            </Menu.Item>
          )
        })}
        {signIn.isError ? (
          <Text size="xs" c="red" px="sm" pt={4}>
            {m.dev_actors__error()}
          </Text>
        ) : null}
      </Menu.Dropdown>
    </Menu>
  )
}
