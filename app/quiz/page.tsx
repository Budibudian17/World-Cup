'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageTransition } from '@/components/page-transition'
import { SectionTag } from '@/components/section-tag'
import quizData from '@/lib/data/quiz-worldcup.json'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, Share2, RotateCcw, Trophy } from 'lucide-react'

const QUESTION_TIME = 15 // seconds per question

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer: string
  difficulty: Difficulty
}

export default function QuizPage() {
  const [gameState, setGameState] = useState<'idle' | 'selecting' | 'playing' | 'finished'>('idle')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [filteredQuestions, setFilteredQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState<(boolean | null)[]>([])

  const question = filteredQuestions[currentQuestion]

  const handleTimeout = useCallback(() => {
    if (!showFeedback) {
      setShowFeedback(true)
      setAnswers((prev) => [...prev, null])
      setTimeout(() => moveToNext(), 1500)
    }
  }, [showFeedback])

  useEffect(() => {
    if (gameState !== 'playing' || showFeedback) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, showFeedback, handleTimeout])

  const selectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty)
    const allQuestions = (quizData as QuizQuestion[]).filter(q => q.difficulty === difficulty)
    // Randomly select 10 questions
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 10)
    setFilteredQuestions(selected)
    setGameState('playing')
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setTimeLeft(QUESTION_TIME)
    setShowFeedback(false)
    setAnswers([])
  }

  const startGame = () => {
    setGameState('selecting')
  }

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const correctAnswerIndex = question.options.indexOf(question.answer)
    const isCorrect = answerIndex === correctAnswerIndex
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    setAnswers((prev) => [...prev, isCorrect])

    setTimeout(() => moveToNext(), 1500)
  }

  const moveToNext = () => {
    if (currentQuestion < filteredQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(QUESTION_TIME)
      setShowFeedback(false)
    } else {
      setGameState('finished')
    }
  }

  const getTimerColor = () => {
    if (timeLeft > 10) return 'bg-wc-gold'
    if (timeLeft > 5) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const shareResult = async () => {
    const text = `I scored ${score}/${filteredQuestions.length} on the FIFA World Cup 2026 Quiz (${selectedDifficulty} difficulty)! Can you beat my score?`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'WC26 Quiz Result', text })
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(text)
      alert('Result copied to clipboard!')
    }
  }

  const difficulties: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'hard', label: 'Hard', color: 'bg-orange-500' },
    { value: 'expert', label: 'Expert', color: 'bg-red-500' },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen py-12 md:py-20">
        <div className="max-w-[600px] mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionTag>Test Your Knowledge</SectionTag>
            <h1 className="mt-4 font-[family-name:var(--font-barlow-condensed)] font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground">
              WC26 Trivia
            </h1>
          </div>

          {/* Game States */}
          {gameState === 'idle' && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Trophy className="w-16 h-16 text-wc-gold mx-auto mb-6" />
              <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-2xl uppercase text-foreground mb-4">
                Ready to Play?
              </h2>
              <p className="font-sans text-muted-foreground mb-6">
                Test your FIFA World Cup knowledge with 100 questions across different difficulty levels. Each session features 10 random questions. You have {QUESTION_TIME} seconds per question.
              </p>
              <button
                onClick={startGame}
                className="w-full py-4 bg-wc-gold text-wc-black rounded-lg font-[family-name:var(--font-barlow-condensed)] font-black text-lg uppercase tracking-wider hover:bg-wc-gold-light transition-colors"
              >
                Start Quiz
              </button>
            </div>
          )}

          {gameState === 'selecting' && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-2xl uppercase text-foreground mb-6">
                Select Difficulty
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => selectDifficulty(diff.value)}
                    className={`
                      p-6 rounded-xl border-2 transition-all duration-200
                      hover:scale-105 active:scale-95
                      ${diff.color} border-transparent
                      hover:border-white/20
                    `}
                  >
                    <div className="text-white font-(family-name:--font-barlow-condensed) font-black text-2xl uppercase mb-2">
                      {diff.label}
                    </div>
                    <div className="text-white/80 font-sans text-sm">
                      {(quizData as QuizQuestion[]).filter(q => q.difficulty === diff.value).length} questions
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {filteredQuestions.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                    {selectedDifficulty}
                  </span>
                  <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg text-wc-gold">
                    Score: {score}
                  </span>
                </div>
              </div>

              {/* Timer Bar */}
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full transition-all duration-1000 ease-linear', getTimerColor())}
                  style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                <h2 className="font-[family-name:var(--font-barlow-condensed)] font-bold text-xl sm:text-2xl text-foreground mb-6 text-center">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === index
                    const correctAnswerIndex = question.options.indexOf(question.answer)
                    const isCorrect = index === correctAnswerIndex
                    const showCorrect = showFeedback && isCorrect
                    const showWrong = showFeedback && isSelected && !isCorrect

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={showFeedback}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 text-left transition-all duration-200 flex items-center justify-between',
                          !showFeedback && 'hover:border-wc-gold hover:bg-secondary/50 cursor-pointer',
                          showFeedback && 'cursor-default',
                          showCorrect && 'border-green-500 bg-green-500/10',
                          showWrong && 'border-red-500 bg-red-500/10',
                          !showCorrect && !showWrong && 'border-border'
                        )}
                      >
                        <span className="font-sans text-foreground">{option}</span>
                        {showCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={cn(
                    'mt-6 p-4 rounded-lg text-center',
                    selectedAnswer === question.options.indexOf(question.answer)
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  )}>
                    <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-lg uppercase">
                      {selectedAnswer === question.options.indexOf(question.answer) ? 'Correct!' : selectedAnswer === null ? 'Time\'s up!' : 'Wrong!'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              {/* Result Card */}
              <div className="mb-8">
                <Trophy className={cn(
                  'w-20 h-20 mx-auto mb-4',
                  score >= filteredQuestions.length * 0.7 ? 'text-wc-gold' : score >= filteredQuestions.length * 0.5 ? 'text-gray-400' : 'text-amber-700'
                )} />
                <h2 className="font-[family-name:var(--font-barlow-condensed)] font-black text-3xl uppercase text-foreground mb-2">
                  Quiz Complete!
                </h2>
                <p className="font-[family-name:var(--font-barlow-condensed)] font-black text-5xl text-wc-gold">
                  {score}/{filteredQuestions.length}
                </p>
                <p className="font-sans text-muted-foreground mt-2">
                  {score === filteredQuestions.length
                    ? 'Perfect score! You\'re a true football expert!'
                    : score >= filteredQuestions.length * 0.7
                    ? 'Great job! You know your World Cup facts!'
                    : score >= filteredQuestions.length * 0.5
                    ? 'Not bad! Keep learning about WC26!'
                    : 'Keep studying! The World Cup awaits!'}
                </p>
              </div>

              {/* Answer Summary */}
              <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {answers.map((correct, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      correct === true && 'bg-green-500',
                      correct === false && 'bg-red-500',
                      correct === null && 'bg-gray-500'
                    )}
                  >
                    <span className="font-[family-name:var(--font-barlow-condensed)] font-bold text-sm text-white">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setGameState('selecting')}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold uppercase tracking-wider hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  Change Difficulty
                </button>
                <button
                  onClick={() => selectDifficulty(selectedDifficulty!)}
                  className="flex-1 py-3 bg-wc-gold text-wc-black rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold uppercase tracking-wider hover:bg-wc-gold-light transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </button>
                <button
                  onClick={shareResult}
                  className="flex-1 py-3 bg-secondary text-foreground rounded-lg font-[family-name:var(--font-barlow-condensed)] font-bold uppercase tracking-wider hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
