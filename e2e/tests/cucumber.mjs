export default {
  require: ['tests/support/**/*.ts', 'tests/steps/**/*.ts'],
  paths: ['tests/features/**/*.feature'],
  format: ['progress'],
  forceExit: true,
}
