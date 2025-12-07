/**
 * @typedef {Object} TimeBlock
 * @property {string} start
 * @property {string} end
 * @property {string} focus
 * @property {string} goal
 *
 * @typedef {Object} SectionChecklistItem
 * @property {string} title
 * @property {string} description
 * @property {boolean} [gentle]
 *
 * @typedef {Object} LearningItem
 * @property {string} topic
 * @property {string} difficulty
 * @property {string} duration
 * @property {string} resourceType
 *
 * @typedef {Object} Dua
 * @property {string} arabic
 * @property {string} translation
 * @property {string} theme
 *
 * @typedef {Object} KidsCard
 * @property {string} title
 * @property {string} idea
 * @property {string} tone
 *
 * @typedef {Object} DailyProgram
 * @property {Object} userProfile
 * @property {string} date
 * @property {string} language
 * @property {{
 *  timeAndFocus: { timeline: TimeBlock[] },
 *  nutritionAndEnergy: { tips: SectionChecklistItem[] },
 *  learningAndSelfDevelopment: { activities: LearningItem[] },
 *  financeAndWisdom: { steps: SectionChecklistItem[] },
 *  entertainmentAndRecharge: { options: SectionChecklistItem[] },
 *  spiritualContent: { duas: Dua[] },
 *  kidsContent?: { cards: KidsCard[] },
 * }} sections
 */
export const types = {};
