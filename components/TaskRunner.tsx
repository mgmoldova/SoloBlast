
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Task, MatchingPair } from '../types';
import Mascot from './Mascot';

interface FilledBlank {
  value: string;
  optionIndex: number;
}

interface TaskRunnerProps {
  tasks: Task[];
  onFinish: (score: number, livesLost: number) => void;
  onCancel: () => void;
}

const TaskRunner: React.FC<TaskRunnerProps> = ({ tasks, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const codeRef = useRef<HTMLElement>(null);
  
  // Fill blanks state: now storing objects with index to distinguish identical words
  const [filledBlanks, setFilledBlanks] = useState<(FilledBlank | null)[]>([]);

  // Matching pairs state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<boolean>(false);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [livesLost, setLivesLost] = useState(0);
  const [score, setScore] = useState(0);

  const currentTask = tasks[currentIndex];

  // Initialize blanks when task changes
  useEffect(() => {
    if (currentTask?.type === 'fill_blanks' && currentTask.correctAnswers) {
      setFilledBlanks(new Array(currentTask.correctAnswers.length).fill(null));
    }
  }, [currentTask]);

  // Trigger syntax highlighting ONLY for static snippets
  useEffect(() => {
    if (!currentTask) return;
    
    if (currentTask.type !== 'fill_blanks' && codeRef.current && (window as any).hljs) {
      (window as any).hljs.highlightElement(codeRef.current);
    }
  }, [currentTask, currentIndex]);

  // Shuffle logic for matching pairs
  const shuffledLeft = useMemo(() => {
    if (currentTask?.type !== 'matching_pairs' || !currentTask.pairs) return [];
    return [...currentTask.pairs].sort(() => Math.random() - 0.5);
  }, [currentTask]);

  const shuffledRight = useMemo(() => {
    if (currentTask?.type !== 'matching_pairs' || !currentTask.pairs) return [];
    return [...currentTask.pairs].sort(() => Math.random() - 0.5);
  }, [currentTask]);

  // Fill blanks logic updated to use optionIndex
  const handleWordClick = (word: string, optionIndex: number) => {
    if (isCorrect !== null) return;
    const nextEmptyIndex = filledBlanks.indexOf(null);
    if (nextEmptyIndex !== -1) {
      const newBlanks = [...filledBlanks];
      newBlanks[nextEmptyIndex] = { value: word, optionIndex };
      setFilledBlanks(newBlanks);
    }
  };

  const handleBlankRemove = (index: number) => {
    if (isCorrect !== null) return;
    const newBlanks = [...filledBlanks];
    newBlanks[index] = null;
    setFilledBlanks(newBlanks);
  };

  const handlePairClick = (side: 'left' | 'right', id: string) => {
    if (matchedIds.has(id)) return;
    if (wrongMatch) return;

    if (side === 'left') {
      setSelectedLeft(id === selectedLeft ? null : id);
    } else {
      setSelectedRight(id === selectedRight ? null : id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        setMatchedIds(prev => new Set([...prev, selectedLeft]));
        setSelectedLeft(null);
        setSelectedRight(null);
      } else {
        setWrongMatch(true);
        setTimeout(() => {
          setWrongMatch(false);
          setSelectedLeft(null);
          setSelectedRight(null);
          setLivesLost(l => l + 0.25);
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight]);

  useEffect(() => {
    if (currentTask?.type === 'matching_pairs' && currentTask.pairs && matchedIds.size === currentTask.pairs.length) {
      setIsCorrect(true);
      setFeedback('Все пары совпали! Красава.');
      setScore(s => s + 15);
    }
  }, [matchedIds, currentTask]);

  const handleCheck = () => {
    if (isCorrect !== null) return;
    
    if (currentTask.type === 'theory') {
      handleNext();
      return;
    }

    if (currentTask.type === 'multiple_choice') {
      const correct = selectedOption === currentTask.correctAnswer;
      setIsCorrect(correct);
      setFeedback(correct ? 'Красава! Всё чётко.' : `Не-а. Правильный ответ: ${currentTask.correctAnswer}. ${currentTask.explanation || ''}`);
      if (correct) setScore(s => s + 10);
      else setLivesLost(l => l + 1);
    }

    if (currentTask.type === 'fill_blanks') {
      // Compare values only
      const isAllCorrect = filledBlanks.every((val, idx) => val?.value === currentTask.correctAnswers?.[idx]);
      setIsCorrect(isAllCorrect);
      setFeedback(isAllCorrect ? 'Код работает! Красава.' : `Ошибка в синтаксисе. Правильно: ${currentTask.correctAnswers?.join(', ')}`);
      if (isAllCorrect) setScore(s => s + 20);
      else setLivesLost(l => l + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setSelectedLeft(null);
      setSelectedRight(null);
      setMatchedIds(new Set());
      setFilledBlanks([]);
      setIsCorrect(null);
      setFeedback('');
    } else {
      onFinish(score, Math.floor(livesLost));
    }
  };

  // Helper to render code with blanks
  const renderCodeWithBlanks = () => {
    if (!currentTask.codeSnippet) return null;
    
    let renderedCode = currentTask.codeSnippet;
    const parts: (string | React.ReactElement)[] = [];
    
    const regex = /\{\{(\d+)\}\}/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(renderedCode)) !== null) {
      parts.push(renderedCode.substring(lastIndex, match.index));
      
      const blankIndex = parseInt(match[1]);
      const blank = filledBlanks[blankIndex];
      
      parts.push(
        <span 
          key={`blank-${blankIndex}`}
          onClick={() => handleBlankRemove(blankIndex)}
          className={`inline-block min-w-[60px] px-2 py-0.5 mx-1 rounded-md text-center cursor-pointer transition-all border-b-2 ${
            blank 
              ? 'bg-orange-600/30 border-orange-500 text-white font-bold' 
              : 'bg-gray-800/50 border-gray-600 text-transparent'
          }`}
        >
          {blank?.value || '___'}
        </span>
      );
      
      lastIndex = regex.lastIndex;
    }
    parts.push(renderedCode.substring(lastIndex));

    return (
      <pre className="whitespace-pre-wrap leading-relaxed mono text-sm sm:text-base">
        <code className="text-gray-300">
          {parts}
        </code>
      </pre>
    );
  };

  if (!currentTask) return <div className="p-10 text-center">Загрузка тасков...</div>;

  const progress = ((currentIndex) / tasks.length) * 100;
  const isFillBlanksReady = currentTask.type === 'fill_blanks' && !filledBlanks.includes(null);
  
  // Track which indices of options are used
  const usedOptionIndices = filledBlanks.filter(b => b !== null).map(b => b!.optionIndex);

  return (
    <div className="fixed inset-0 bg-[#0d0d0d] z-50 flex flex-col p-4 sm:p-8">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full relative">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={onCancel} className="text-2xl text-gray-500 hover:text-white transition-colors">✕</button>
          <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 rounded-full border border-gray-800">
             <span className="text-red-500">❤️</span>
             <span className="font-bold text-sm">{MAX_HEARTS - Math.floor(livesLost)}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar pb-10">
          <div className="mb-6">
            {currentTask.type === 'theory' ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">📚</span>
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">Немного теории</h2>
                </div>
                <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-6">{currentTask.content}</p>
              </div>
            ) : (
              <h2 className="text-2xl sm:text-3xl font-bold">{currentTask.question}</h2>
            )}
          </div>

          {(currentTask.type === 'multiple_choice' || currentTask.type === 'theory') && currentTask.codeSnippet && (
            <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800 mb-6 shadow-inner relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 text-[10px] font-bold text-gray-600 bg-gray-800/50 rounded-bl-lg z-10">LUA</div>
               <pre className="whitespace-pre-wrap leading-relaxed mono text-sm sm:text-base">
                 <code 
                   key={currentTask.codeSnippet || 'static'} 
                   ref={codeRef} 
                   className="language-lua"
                 >
                   {currentTask.codeSnippet}
                 </code>
               </pre>
            </div>
          )}

          {currentTask.type === 'fill_blanks' && (
            <div className="flex flex-col gap-8">
              <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-gray-800 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-[10px] font-bold text-gray-600 bg-gray-800/50 rounded-bl-lg z-10">LUA EDITOR</div>
                {renderCodeWithBlanks()}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {currentTask.options?.map((word, idx) => {
                  const isUsed = usedOptionIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      disabled={isUsed || isCorrect !== null}
                      onClick={() => handleWordClick(word, idx)}
                      className={`px-5 py-2.5 rounded-xl border-2 font-bold transition-all ${
                        isUsed 
                          ? 'bg-gray-800 border-gray-800 text-gray-700 opacity-30' 
                          : 'bg-gray-900 border-gray-700 hover:border-orange-500 text-white shadow-lg active:scale-95'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentTask.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentTask.options?.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isCorrect !== null}
                  onClick={() => setSelectedOption(option)}
                  className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold ${
                    selectedOption === option ? 'border-orange-500 bg-orange-500/10 text-orange-400' : 'border-gray-800 hover:bg-gray-800 text-gray-400'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg mr-3 text-xs ${selectedOption === option ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-500'}`}>
                    {idx + 1}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentTask.type === 'matching_pairs' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {shuffledLeft.map(pair => (
                  <button key={pair.id} disabled={matchedIds.has(pair.id) || isCorrect !== null} onClick={() => handlePairClick('left', pair.id)}
                    className={`w-full p-4 min-h-[80px] text-sm sm:text-base rounded-2xl border-2 transition-all font-bold ${
                      matchedIds.has(pair.id) ? 'bg-green-600/10 border-green-600/30 text-green-500 opacity-50' :
                      selectedLeft === pair.id ? (wrongMatch ? 'bg-red-600/10 border-red-500 text-red-400' : 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-lg shadow-orange-900/20') :
                      'bg-gray-900 border-gray-800 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    {pair.left}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {shuffledRight.map(pair => (
                  <button key={pair.id} disabled={matchedIds.has(pair.id) || isCorrect !== null} onClick={() => handlePairClick('right', pair.id)}
                    className={`w-full p-4 min-h-[80px] text-sm sm:text-base rounded-2xl border-2 transition-all font-bold ${
                      matchedIds.has(pair.id) ? 'bg-green-600/10 border-green-600/30 text-green-500 opacity-50' :
                      selectedRight === pair.id ? (wrongMatch ? 'bg-red-600/10 border-red-500 text-red-400' : 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-lg shadow-orange-900/20') :
                      'bg-gray-900 border-gray-800 hover:border-gray-600 text-gray-300'
                    }`}
                  >
                    {pair.right}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Mascot isVisible={isCorrect === true} type="success" />

        <div className={`mt-auto pt-6 pb-2 px-2 sm:px-0 rounded-t-3xl transition-all ${isCorrect === true ? 'bg-green-900/10' : isCorrect === false ? 'bg-red-900/10' : 'bg-transparent'}`}>
          {isCorrect !== null && (
            <div className="mb-6 px-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                <h4 className={`font-black text-xl uppercase ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Красава!' : 'Не совсем...'}</h4>
              </div>
              <p className="text-gray-300 font-medium">{feedback}</p>
            </div>
          )}
          
          <button
            onClick={isCorrect === null && currentTask.type !== 'theory' ? handleCheck : handleNext}
            disabled={isCorrect === null && currentTask.type !== 'theory' && currentTask.type !== 'matching_pairs' && (currentTask.type === 'multiple_choice' ? !selectedOption : !isFillBlanksReady)}
            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
              isCorrect === null ? 
                (currentTask.type === 'theory' ? 'bg-orange-600 hover:bg-orange-500 text-white' : 
                 currentTask.type === 'matching_pairs' ? 'bg-gray-800 text-gray-600 cursor-not-allowed hidden' : 
                 ((currentTask.type === 'multiple_choice' ? selectedOption : isFillBlanksReady) ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed')) :
              isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isCorrect === null ? (currentTask.type === 'theory' ? 'ПОНЯЛ' : 'ПРОВЕРИТЬ') : 'ДАЛЕЕ'}
          </button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }`}</style>
    </div>
  );
};

const MAX_HEARTS = 5;

export default TaskRunner;
