import { FlashCard } from './cards/flashcard.js'
import { CardDeck } from './ordering/cardproducer.js'
import { checkAchievements } from './achievements/achievementchecker.js'
import readline from 'readline-sync'

interface UI {
  studyCards: (producer: CardDeck) => void
};

function newUI (): UI {
  function cueAllCards (producer: CardDeck): number[] {
    const timingsMs: number[] = []
    for (const cardStatus of producer.getCards()) {
      const card = cardStatus.getCard()
      const start = Date.now()
      const correctAnswer = cueCard(card)
      timingsMs.push(Date.now() - start)
      cardStatus.recordResult(correctAnswer)
    }
    return timingsMs
  };

  function cueCard (card: FlashCard): boolean {
    console.log('\nNext cue: ' + card.getQuestion())
    const line = readline.question('answer> ')
    const success = card.checkSuccess(line)
    if (success) {
      console.log("That's correct!")
    } else {
      console.log('That is incorrect; the correct response was: ' +
                card.getAnswer())
    }
    return success
  };

  function displayAchievements (producer: CardDeck, timingsMs: number[]): void {
    const earned = checkAchievements(producer.getCards(), timingsMs)
    if (earned.length > 0) {
      console.log('\nAchievements earned this round:')
      for (const achievement of earned) {
        console.log(` ${achievement.getType()}: ${achievement.getDescription()}`)
      }
    }
  };

  return {
    /**
     * Prompts the user with {@link FlashCard} cards until the {@link CardProducer} is exhausted.
     * @param producer The {@link CardDeck} to use for organizing cards.
     */
    studyCards (producer: CardDeck): void {
      while (!producer.isComplete()) {
        console.log(`${producer.countCards()} cards to go...`)
        const timingsMs = cueAllCards(producer)
        displayAchievements(producer, timingsMs)
        console.log('Reached the end of the card deck, reorganizing...')
        producer.reorganize()
      };
      console.log('Finished all cards. Yay.')
    }
  }
};

export { newUI }