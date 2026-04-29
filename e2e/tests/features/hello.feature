Feature: The app boots and reaches the Pikku backend
  Smoke test for any starter-template frontend. The same scenario runs
  once per app — set APP_URL (and optionally APP_SOURCE / APP_SSR) to
  point at the dev server under test.

  Scenario: Home page renders Hello World wired to the backend
    When I open the home page
    Then the testid "hello-message" should equal "Hello, World!"
    And the testid "hello-timestamp" should be a non-empty backend value
    And the testid "hello-source" should match the configured source

  @ssr
  Scenario: Hello World is present in the initial HTML response
    When I fetch the raw home page HTML
    Then the raw HTML should contain "Hello, World!"
