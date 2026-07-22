@pages @smoke
Feature: Every page loads
  Signed in, every static route must render without an HTTP error, a failed or
  5xx app API call, an uncaught exception, or a console error. This is the
  baseline reliability gate — extend it with per-domain behaviour features as
  the app grows (create/edit/list flows, permissions, etc.).

  Scenario: all pages load cleanly when signed in
    Given "the user" is signed in
    Then every page loads without errors
