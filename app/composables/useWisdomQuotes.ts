/**
 * Wisdom Quotes Composable
 * 
 * Provides random wisdom quotes to display during loading states
 */

const wisdomQuotes = [
  'Patience is a virtue, especially when learning new languages.',
  'Every word you translate brings you closer to understanding the world.',
  'Language is the road map of a culture. It tells you where its people come from and where they are going.',
  'The limits of my language mean the limits of my world.',
  'To have another language is to possess a second soul.',
  'Language is the blood of the soul into which thoughts run and out of which they grow.',
  'One language sets you in a corridor for life. Two languages open every door along the way.',
  'Learning another language is not only learning different words for the same things, but learning another way to think about things.',
  'Knowledge of languages is the doorway to wisdom.',
  'The more languages you know, the more you are human.',
  'Language is the most massive and inclusive art we know, a mountainous and anonymous work of unconscious generations.',
  'A different language is a different vision of life.',
  'Language shapes the way we think, and determines what we can think about.',
  'Translation is not a matter of words only; it is a matter of making intelligible a whole culture.',
  'Words are, of course, the most powerful drug used by mankind.',
  'The beautiful thing about learning is that no one can take it away from you.',
  'Education is the most powerful weapon which you can use to change the world.',
  'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.',
  'Live as if you were to die tomorrow. Learn as if you were to live forever.',
  'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.',
  'Learning never exhausts the mind.',
  'Wisdom is not a product of schooling but of the lifelong attempt to acquire it.',
  'The only way to do great work is to love what you do.',
  'Success is the sum of small efforts repeated day in and day out.',
  'The future belongs to those who learn more skills and combine them in creative ways.',
  'Every expert was once a beginner.',
  'The journey of a thousand miles begins with one step.',
  'You don\'t have to be great to start, but you have to start to be great.',
  'The only impossible journey is the one you never begin.',
  'In learning you will teach, and in teaching you will learn.',
  'The beautiful thing about learning is nobody can take it away from you.',
]

/**
 * Get a random wisdom quote
 */
export const useWisdomQuotes = () => {
  const getRandomQuote = (): string => {
    const randomIndex = Math.floor(Math.random() * wisdomQuotes.length)
    return wisdomQuotes[randomIndex]
  }

  return {
    getRandomQuote,
    quotes: wisdomQuotes
  }
}
