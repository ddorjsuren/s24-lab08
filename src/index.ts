import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { loadCards } from './data/store.js'
import { newCardDeck } from './ordering/cardproducer.js'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes.js'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes.js'
import { newUI } from './ui.js'
import { newCardShuffler } from './ordering/prioritization/cardshuffler.js'

// Parse CLI args
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <cards-file> [options]')
  .positional('cards-file', {
    describe: 'Path to card file',
    type: 'string',
    demandOption: true
  })
  .option('order', {
    describe: 'Card ordering strategy',
    choices: ['random', 'worst-first', 'recent-mistakes-first'],
    default: 'random'
  })
  .option('repetitions', {
    describe: 'Number of successful repetitions per card',
    type: 'number'
  })
  .option('invertCards', {
    describe: 'Swap question and answer',
    type: 'boolean',
    default: false
  })
  .help()
  .parseSync()

// Load cards
let store = loadCards(argv._[0] as string)

// Apply inversion if needed
if (argv.invertCards) {
  store = store.invertCards()
}

// Choose ordering strategy
let organizer
switch (argv.order) {
  case 'worst-first':
    organizer = newMostMistakesFirstSorter()
    break
  case 'recent-mistakes-first':
    organizer = newRecentMistakesFirstSorter()
    break
  default:
    organizer = newCardShuffler()
    break
}

// Create deck
const deck = newCardDeck(store.getAllCards(), organizer)

// Run UI
newUI().studyCards(deck)