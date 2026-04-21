import { AchievementType } from './achievementtype.js'

/**
 * Represents an achievement that can be awarded to the user upon completing a round.
 */
interface Achievement {
  /**
   * Retrieves the type of this achievement.
   *
   * @return The {@link AchievementType} of this achievement.
   */
  getType: () => AchievementType
  /**
   * Retrieves a human-readable description of this achievement.
   *
   * @return A string describing the achievement.
   */
  getDescription: () => string
}

/**
 * Creates a new {@link Achievement} instance.
 *
 * @param type        The {@link AchievementType} of this achievement.
 * @param description A human-readable description of this achievement.
 */
function newAchievement (type: AchievementType, description: string): Achievement {
  return {
    getType: function (): AchievementType { return type },
    getDescription: function (): string { return description }
  }
}

export { Achievement, newAchievement }