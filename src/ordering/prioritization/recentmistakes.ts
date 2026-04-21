import { CardStatus } from '../../cards/cardstatus.js'
import { CardOrganizer } from '../cardorganizer.js'

function newRecentMistakesFirstSorter (): CardOrganizer {
  /**
   * Computes the most recent mistake's time stamp for a card and helps in
   * determining the sequence of cards in the next iteration, based on the
   * rules that those answered incorrectly in the last round appear first.
   *
   * @param cardStatus The {@link CardStatus} object with failing
   * @return The most recent incorrect response time stamp
   */
    function getMostRecentMistakeIndex (cardStatus: CardStatus): number {
      const results = cardStatus.getResults()
      for (let i = results.length - 1; i >= 0; i--) {
        if (!results[i]) return i
      }
      return -1
    }
  return {
    /**
     * Orders the cards by the time of most recent incorrect answers provided for them.
     *
     * @param cards The {@link CardStatus} objects to order.
     * @return The ordered cards.
     */
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      return cards
        .map((card, deckPosition) => ({ card, deckPosition }))
        .sort((a, b) => {
          const aMistake = getMostRecentMistakeIndex(a.card)
          const bMistake = getMostRecentMistakeIndex(b.card)

          // Cards with no mistakes go last
          if (aMistake === -1 && bMistake === -1) return 0
          if (aMistake === -1) return 1
          if (bMistake === -1) return -1

          // Different rounds: more recent round comes first
          if (bMistake !== aMistake) return bMistake - aMistake

          // Same round: card answered later in the deck (higher position) was
          // most recently seen, so it comes first
          return b.deckPosition - a.deckPosition
        })
        .map(({ card }) => card)
      }
    }
};

export { newRecentMistakesFirstSorter }
