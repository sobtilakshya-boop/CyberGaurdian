'use client';

import { useState } from 'react';
import { QuizQuestion } from '@/lib/courseData';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizComponentProps {
  title?: string;
  questions: QuizQuestion[];
  onComplete: () => void;
  isCompleted: boolean;
}

export function QuizComponent({ title, questions, onComplete, isCompleted }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const question = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === question.correctAnswer;

  const handleSelectAnswer = (index: number) => {
    if (!showResults) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (currentQuestion === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
  const score = (correctCount / questions.length) * 100;
  const passScore = 70;
  const passed = score >= passScore;

  if (showResults) {
    return (
      <div>
        {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}

        <div className="bg-slate-700 rounded-lg p-8 text-center mb-6">
          <div className="text-6xl mb-4">{passed ? '🎉' : '📝'}</div>
          <h3 className="text-2xl font-bold text-white mb-2">{passed ? 'Great Job!' : 'Try Again'}</h3>
          <p className={`text-3xl font-bold mb-4 ${passed ? 'text-green-400' : 'text-yellow-400'}`}>
            {Math.round(score)}%
          </p>
          <p className="text-slate-300 mb-6">
            You got {correctCount} out of {questions.length} questions correct
          </p>

          {!isCompleted && passed && (
            <button
              onClick={onComplete}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors mr-3"
            >
              Complete & Continue
            </button>
          )}

          <button
            onClick={handleRestart}
            className="px-6 py-2 rounded-lg bg-slate-600 text-white font-semibold hover:bg-slate-500 transition-colors"
          >
            Review Answers
          </button>
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx];
            const correct = userAnswer === q.correctAnswer;

            return (
              <div key={q.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  {correct ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-white">Q{idx + 1}: {q.question}</p>
                    <p className="text-sm text-slate-300 mt-2">Your answer: {q.options[userAnswer]}</p>
                    {!correct && (
                      <p className="text-sm text-green-400 mt-1">Correct answer: {q.options[q.correctAnswer]}</p>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-400 bg-slate-800 rounded p-3">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">{question.question}</h3>
          <span className="text-sm text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === idx
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === idx ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                  }`}
                >
                  {selectedAnswer === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-white font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={!isAnswered}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
