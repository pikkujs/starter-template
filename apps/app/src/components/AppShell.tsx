import {
  AppShell as MantineAppShell,
  Box,
  Burger,
  Button,
  Group,
  NavLink,
  Stack,
} from '@pikku/mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useState, type FC } from 'react'
import { m } from '@/i18n/messages'
import { useLocale } from '@/i18n/config'
import { signOut } from '@/lib/auth'
import { Wordmark } from './Wordmark'
import { LanguageSelector } from './LanguageSelector'
import { ThemeSelector } from './ThemeSelector'
import { ColorSchemeToggle } from './ColorSchemeToggle'

const HomeGlyph = () => <NavGlyph d="M3 12 12 4l9 8M5 10v9h5v-6h4v6h5v-9" />
const AccountGlyph = () => <NavGlyph d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21a7 7 0 0 1 18 0" />
const SignOutGlyph = () => (
  <NavGlyph d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
)

function NavGlyph({ d }: { d: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}

export const AppShell: FC = () => {
  useLocale()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [isSigningOut, setIsSigningOut] = useState(false)
  // Mobile: the navbar collapses to an off-canvas drawer toggled by a burger in
  // a mobile-only header. Desktop (≥ sm) shows the sidebar and no header (the
  // responsive `header.height` object is 0 there, so no dead space).
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <MantineAppShell
      header={{ height: { base: 56, sm: 0 } }}
      navbar={{ width: 236, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="xl"
    >
      <MantineAppShell.Header hiddenFrom="sm" px="md">
        <Group h="100%" justify="space-between" wrap="nowrap">
          <Wordmark name={m.app__name()} size={22} />
          <Burger opened={opened} onClick={toggle} size="sm" aria-label={m.app_shell__menu()} />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        <Stack h="100%" gap={4}>
          <Box px="xs" py="sm">
            <Wordmark name={m.app__name()} size={26} />
          </Box>

          <Stack gap={2} mt="xs">
            <NavLink
              component={Link}
              to="/app"
              activeOptions={{ exact: true }}
              label={m.nav__home()}
              leftSection={<HomeGlyph />}
              active={pathname === '/app'}
              onClick={close}
            />
            <NavLink
              component={Link}
              to="/app/account"
              label={m.nav__account()}
              leftSection={<AccountGlyph />}
              active={pathname === '/app/account'}
              onClick={close}
            />
          </Stack>

          <Stack gap="xs" mt="auto">
            <ThemeSelector />
            <Group gap="xs" wrap="nowrap">
              <LanguageSelector />
              <ColorSchemeToggle />
            </Group>
            <Button
              variant="subtle"
              color="gray"
              fullWidth
              justify="flex-start"
              leftSection={<SignOutGlyph />}
              loading={isSigningOut}
              onClick={async () => {
                setIsSigningOut(true)
                try {
                  await signOut()
                  window.location.href = '/login'
                } finally {
                  setIsSigningOut(false)
                }
              }}
            >
              {m.app_shell__sign_out()}
            </Button>
          </Stack>
        </Stack>
      </MantineAppShell.Navbar>

      {/* Flex column so a full-height page (e.g. a chat) can fill the remaining
          viewport with just `flex: 1, minHeight: 0` — no viewport math needed.
          Content-sized pages are unaffected. */}
      <MantineAppShell.Main style={{ display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}
