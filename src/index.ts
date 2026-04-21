import { CardStore, loadCards } from './data/store.js'
import { newCardDeck } from './ordering/cardproducer.js'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes.js'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes.js'
import { newUI } from './ui.js'

const cards: CardStore = loadCards('cards/designpatterns.csv')

// Change the next two lines to test your implementation
// const organizer = newMostMistakesFirstSorter()
const organizer = newRecentMistakesFirstSorter()

const cardDeck = newCardDeck(cards.getAllCards(), organizer)
newUI().studyCards(cardDeck)
