import { pikkuFeature } from '#pikku/workflow/pikku-workflow-types.gen.js'
import { everyPageLoadsScenario } from '../scenarios/every-page-loads.scenario.js'

export const pagesFeature = pikkuFeature({
  name: 'Every page loads',
  description: 'Every static route renders cleanly for a signed-in user',
  tags: ['pages', 'smoke'],
  scenarios: [everyPageLoadsScenario],
})
