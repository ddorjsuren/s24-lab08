import { FlashCard } from '../cards/flashcard.js'
import { CardOrganizer, newCombinedCardOrganizer } from './cardorganizer.js'
import { CardStatus, newCardStatus } from '../cards/cardstatus.js'
import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from './repetition/cardrepeater.js'

/**
 * A card deck represents a set of cards in a specific order with associated state and a mechanism to filter and reorder
 * them.
 */
interface CardDeck {
  getCards: () => CardStatus[]
  isComplete: () => boolean
  getOrganizer: () => CardOrganizer
  reorganize: () => void
  countCards: () => number
};

/**
 * Initializes a new {@link CardDeck} instance.
 *
 * @param cards         The {@link FlashCard} cards to store in this deck, to be paired with a status into
 *                      a {@link CardStatus}.
 * @param cardOrganizer The (potentially composite) {@link CardOrganizer} instance to sort and filter the cards with
 *                      based on the correctness of responses.
 * @param repetitions   The number of correct answers required per card before it is removed from the deck.
 */
function newCardDeck (cards: FlashCard[], cardOrganizer: CardOrganizer, repetitions?: number): CardDeck {
  const repeater = repetitions !== undefined
    ? newRepeatingCardOrganizer(repetitions)
    : newNonRepeatingCardOrganizer()
  const combinedOrganizer = newCombinedCardOrganizer([cardOrganizer, repeater])
  let status: CardStatus[] = cards.map(newCardStatus)
  return {
    /**
     * Retrieves the remaining stored cards.
     *
     * @return The {@link CardStatus} cards in this deck.
     */
    getCards: function (): CardStatus[] {
      return status.slice()
    },
    /**
     * Retrieves the associated card organizer.
     *
     * @return The {@link CardOrganizer} used to sort this deck.
     */
    getOrganizer: function (): CardOrganizer {
      return combinedOrganizer
    },
    /**
     * A helper method, that calls {@link CardOrganizer#reorganize(List)} with the global cards field and overwrites
     * it with the result.
     */
    reorganize: function () {
      status = combinedOrganizer.reorganize(status)
    },
    /**
     * Checks whether any more cards need to be tested.
     *
     * @return {@code true} if all cards have been filtered.
     */
    isComplete: function (): boolean {
      return status.length === 0
    },
    /**
     * Gets the size of the remaining cards in this deck.
     *
     * @return The number of cards in this deck.
     */
    countCards: function () {
      return status.length
    }
  }
};

export { newCardDeck, CardDeck }