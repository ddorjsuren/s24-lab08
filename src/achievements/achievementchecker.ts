import { CardStatus } from '../cards/cardstatus.js'
import { Achievement, newAchievement } from './achievement.js'
import { AchievementType } from './achievementtype.js'

const FAST_THRESHOLD_MS = 5000
const REPEAT_THRESHOLD = 5
const CONFIDENT_THRESHOLD = 3

/**
 * Checks which achievements were earned at the end of a round.
 *
 * @param cards           The {@link CardStatus} objects from the completed round.
 * @param timingsMs       The time taken per question in milliseconds, in the same order as {@code cards}.
 *                        If omitted, the {@link AchievementType.FAST} achievement will not be evaluated.
 * @return The list of {@link Achievement} instances earned this round.
 */
function checkAchievements (cards: CardStatus[], timingsMs?: number[]): Achievement[] {
  const earned: Achievement[] = []

  if (timingsMs !== undefined && timingsMs.length > 0) {
    const avgMs = timingsMs.reduce((a, b) => a + b, 0) / timingsMs.length
    if (avgMs < FAST_THRESHOLD_MS) {
      earned.push(newAchievement(AchievementType.FAST, 'Answered all questions in under 5 seconds on average.'))
    }
  }

  const allCorrect = cards.every(card => {
    const results = card.getResults()
    return results.length > 0 && results[results.length - 1]
  })
  if (allCorrect) {
    earned.push(newAchievement(AchievementType.CORRECT, 'Answered every question correctly in the latest round.'))
  }

  const hasRepeat = cards.some(card => card.getResults().length > REPEAT_THRESHOLD)
  if (hasRepeat) {
    earned.push(newAchievement(AchievementType.REPEAT, 'Answered at least one card more than 5 times.'))
  }

  const hasConfident = cards.some(card =>
    card.getResults().filter(r => r).length >= CONFIDENT_THRESHOLD
  )
  if (hasConfident) {
    earned.push(newAchievement(AchievementType.CONFIDENT, 'Answered at least one card correctly 3 or more times.'))
  }

  return earned
}

export { checkAchievements }