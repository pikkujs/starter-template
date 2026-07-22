@auth @smoke
Feature: Authentication
  Users sign in with email + password; the session is cookie-based.

  Scenario: a registered user signs in through the login form
    Given a test account exists
    When "the user" signs in through the login form
    Then they land on the app
