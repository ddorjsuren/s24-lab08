enum AchievementType {
  /** Completed a round with an average time of less than 5 seconds per question. */
  FAST = 'FAST',
  /** All questions were answered correctly in the latest round. */
  CORRECT = 'CORRECT',
  /** At least one card has been answered more than 5 times. */
  REPEAT = 'REPEAT',
  /** At least one card has been answered correctly at least 3 times. */
  CONFIDENT = 'CONFIDENT'
}

export { AchievementType }