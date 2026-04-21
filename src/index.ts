import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { loadCards } from './data/store.js'
import { newCardDeck } from './ordering/cardproducer.js'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes.js'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes.js'
import { newCardShuffler } from './ordering/prioritization/cardshuffler.js'
import { newUI } from './ui.js'
import { CardOrganizer } from './ordering/cardorganizer.js'

// CLI
interface CLIArgs {
  cardsFile: string
  order: 'random' | 'worst-first' | 'recent-mistakes-first'
  repetitions?: number
  invertCards: boolean
}

const argv = yargs(hideBin(process.argv))
  .scriptName('flashcard')
  .usage('flashcard <cards-file> [options]')
  .command<CLIArgs>(
    '$0 <cardsFile>',
    'Run the flashcard program',
    (yargs) => {
      return yargs.positional('cardsFile', {
        describe: 'Path to the card file',
        type: 'string',
        demandOption: true
      })
    }
  )
  .option('order', {
    describe: 'The type of ordering to use',
    choices: ['random', 'worst-first', 'recent-mistakes-first'] as const,
    default: 'random'
  })
  .option('repetitions', {
    describe: 'Number of repetitions',
    type: 'number'
  })
  .option('invertCards', {
    describe: 'Flip cards',
    type: 'boolean',
    default: false
  })
  .check((argv) => {
    if (argv.repetitions !== undefined && argv.repetitions <= 0) {
      throw new Error('Error: --repetitions must be positive')
    }
    return true
  })
  .help()
  .strict()
  .parseSync()

// LOAD CARDS
let store
try {
  const cardsFile = argv.cardsFile as string
  store = loadCards(cardsFile)
} catch (err) {
  console.error(`Error: Failed to load cards from file "${String(argv.cardsFile)}"`)
  process.exit(1)
}

// invert if needed
if (argv.invertCards) {
  store = store.invertCards()
}

// ORGANIZER
let organizer: CardOrganizer
switch (argv.order) {
  case 'worst-first':
    organizer = newMostMistakesFirstSorter()
    break
  case 'recent-mistakes-first':
    organizer = newRecentMistakesFirstSorter()
    break
  case 'random':
  default:
    organizer = newCardShuffler()
}

// DECK
const deck = newCardDeck(
  store.getAllCards(),
  organizer,
  argv.repetitions
)

// RUN
newUI().studyCards(deck)