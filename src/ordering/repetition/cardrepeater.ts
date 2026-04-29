import { CardStatus } from '../../cards/cardstatus.js'
import { CardOrganizer } from '../cardorganizer.js'

function newCardRepeater (isComplete: (card: CardStatus) => boolean): CardOrganizer {
  /**
   * Checks whether the provided card needs to be repeated. If {@code false}, it will be filtered from the
   * {@link CardRepeater#reorganize(List)} process.
   *
   * @param card The {@link CardStatus} object to check.
   * @return Whether the user needs to keep studying this card.
   */
  function isNotComplete (card: CardStatus): boolean { return !isComplete(card) };
  return {
    /**
     * Removes all cards that require no more repetition.
     *
     * @param cards The {@link CardStatus} objects to order.
     * @return The filtered cards, in no particular order.
     */
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      return cards.filter(isNotComplete)
    }

  }
};

/**
 * Returns every {@link FlashCard} exactly once, regardless of the correctness of the response.
 */
function newNonRepeatingCardOrganizer (): CardOrganizer {
  /**
   * Checks if the provided card has not yet been answered, correctly or otherwise.
   *
   * @param card The {@link CardStatus} object to check.
   * @return {@code true} if this card has received one or more answers.
   */
  function anyAnswer (card: CardStatus): boolean {
    // Completion is marked by having been answered at least once, regardless of the correctness of that response.
    return card.getResults().filter((c)=>c).length >= 1
  };

  return newCardRepeater(anyAnswer)
};

/**
 * Ensures that every {@link FlashCard} is answered correctly a given number of times.
 * {@code repetitions} must be positive
 *
 * @throws RangeError when the number of repetitions is non-positive.
 */
function newRepeatingCardOrganizer (repetitions: number): CardOrganizer {
  if (repetitions < 1) { throw new RangeError('repetitions must be positive') }
  /**
   * Checks if the provided card has been answered correctly the required number of times.
   *
   * @param card The {@link CardStatus} object to check.
   * @return {@code true} if this card has been answered correctly at least {@code this.repetitions} times.
   */
  function hasSufficientSuccess (card: CardStatus): boolean {
    return card.getResults().filter((c) => c).length >= repetitions
  };
  return newCardRepeater(hasSufficientSuccess)
}

export { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer }
