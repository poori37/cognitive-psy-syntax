import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { levels, quizData } from './constants';
import { Word, Player, Proficiency, GameMode, QuizQuestion, HardQuestion, CardQuestion } from './types';

// Helper function to shuffle arrays
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Word with a unique ID for drag-and-drop
interface IdentifiedWord extends Word {
    id: number;
}


// Global declarations for external libraries
declare const ohm: any;

const App: React.FC = () => {
    // Game State
    const [view, setView] = useState<'menu' | 'game' | 'quiz'>('menu');
    const [modal, setModal] = useState<'mode' | 'single-setup' | 'quiz-setup' | 'multi-setup' | 'multi-proficiency' | 'waiting-room' | 'game-over' | null>('mode');
    const [gameMode, setGameMode] = useState<GameMode>(null);
    const [proficiency, setProficiency] = useState<Proficiency>('easy');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(50);
    const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

    // Card Game State
    const [trayWords, setTrayWords] = useState<IdentifiedWord[]>([]);
    const [poolWords, setPoolWords] = useState<IdentifiedWord[]>([]);
    
    // Typing Game State
    const [typingInput, setTypingInput] = useState('');

    // Quiz Game State
    const [quizProficiency, setQuizProficiency] = useState<Proficiency>('easy');
    const [currentQuizQuestionIndex, setCurrentQuizQuestionIndex] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [shuffledQuizOptions, setShuffledQuizOptions] = useState<string[]>([]);
    const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<{ answer: string; isCorrect: boolean } | null>(null);

    // Multiplayer State
    const [socket, setSocket] = useState<Socket | null>(null);
    const [playerData, setPlayerData] = useState<Player>({ id: '', nickname: '', score: 0 });
    const [groupCode, setGroupCode] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [nickname, setNickname] = useState('');
    const [joinGroupCode, setJoinGroupCode] = useState('');
    const [multiplayerFeedback, setMultiplayerFeedback] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
    const [multiplayerTab, setMultiplayerTab] = useState<'create' | 'join'>('create');

    // UI & Feedback State
    const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' } | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [hasSavedGame, setHasSavedGame] = useState(false);
    const [gameOverMessage, setGameOverMessage] = useState({ title: '', message: '' });

    const grammar = useMemo(() => {
        const grammarScript = document.getElementById('grammar');
        if (grammarScript) {
            return ohm.grammar(grammarScript.textContent);
        }
        return null;
    }, []);

    // --- Game Flow ---

    const startTimer = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        timerInterval.current = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
    }, []);

    const resetTimer = useCallback(() => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        setTimer(50);
    }, []);
    
    const loadQuestion = useCallback((index: number, prof: Proficiency) => {
        setFeedback(null);
        setIsAnswerChecked(false);
        const questionData = levels[prof][index];

        if (prof !== 'hard') {
            const q = questionData as CardQuestion;
            // Create IDs that are unique across the entire level, not just the question
            const wordsWithIds = q.words.map((word, idx) => ({ ...word, id: Number(`${index}${idx}`) }));
            setTrayWords([]);
            setPoolWords(shuffleArray([...wordsWithIds]));
        }
        setTypingInput('');
        
        resetTimer();
        startTimer();
    }, [resetTimer, startTimer]);
    
    const endGame = useCallback((title: string, message: string) => {
        if(timerInterval.current) clearInterval(timerInterval.current);
        setGameOverMessage({ title, message });
        setModal('game-over');
        if (gameMode === 'single') {
            localStorage.removeItem('syntaxGameState');
        }
    }, [gameMode]);
    
    const loadQuizQuestion = useCallback((index: number) => {
      setFeedback(null);
      setSelectedQuizAnswer(null);
      setIsAnswerChecked(false);
      const question = quizData[quizProficiency][index];
      setShuffledQuizOptions(shuffleArray([...question.options]));
    }, [quizProficiency]);
    
    const nextQuestion = useCallback(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < levels[proficiency].length) {
            setCurrentQuestionIndex(nextIndex);
            loadQuestion(nextIndex, proficiency);
        } else {
            endGame(
                `'${proficiency.charAt(0).toUpperCase() + proficiency.slice(1)}' Level Complete!`, 
                "You've answered all questions for this difficulty."
            );
        }
    }, [currentQuestionIndex, proficiency, loadQuestion, endGame]);

    const nextQuizQuestion = useCallback(() => {
      const nextIndex = currentQuizQuestionIndex + 1;
      if (nextIndex < quizData[quizProficiency].length) {
          setCurrentQuizQuestionIndex(nextIndex);
          loadQuizQuestion(nextIndex);
      } else {
          endGame("Quiz Complete!", "You've finished all the quiz questions.");
      }
    }, [currentQuizQuestionIndex, quizProficiency, loadQuizQuestion, endGame]);
    
    const startGame = useCallback((resumedState: any = null, profOverride?: Proficiency) => {
        const prof = profOverride || resumedState?.proficiency || proficiency;
        const qIndex = resumedState?.currentQuestionIndex || 0;
        const initialScore = resumedState?.score || 0;

        setModal(null);
        setView('game');
        setProficiency(prof);
        setCurrentQuestionIndex(qIndex);
        setScore(initialScore);

        loadQuestion(qIndex, prof);

        if (resumedState?.timer) {
            setTimer(resumedState.timer > 0 ? resumedState.timer : 50);
            startTimer();
        }
    }, [proficiency, loadQuestion, startTimer]);

    const startQuiz = useCallback(() => {
      setModal(null);
      setView('quiz');
      setCurrentQuizQuestionIndex(0);
      setQuizScore(0);
      loadQuizQuestion(0);
    }, [loadQuizQuestion]);

    // --- Effects ---
    
    // Timer Effect
    useEffect(() => {
        if (timer <= 0 && view !== 'menu' && !isAnswerChecked) {
            if(timerInterval.current) clearInterval(timerInterval.current);
            setFeedback({ message: "Time's up! Moving to the next question.", type: 'incorrect' });
            const timeoutId = setTimeout(() => gameMode === 'quiz' ? nextQuizQuestion() : nextQuestion(), 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [timer, view, isAnswerChecked, gameMode, nextQuestion, nextQuizQuestion]);

    // Cleanup timer on unmount/view change
    useEffect(() => {
        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, [view]);

    // Save game state on browser close for single player
    useEffect(() => {
        const saveGameState = () => {
            if (gameMode === 'single' && view === 'game') {
                const stateToSave = { proficiency, currentQuestionIndex, score, timer };
                localStorage.setItem('syntaxGameState', JSON.stringify(stateToSave));
            }
        };
        window.addEventListener('beforeunload', saveGameState);
        return () => window.removeEventListener('beforeunload', saveGameState);
    }, [gameMode, proficiency, currentQuestionIndex, score, timer, view]);

    // Check for saved game
    useEffect(() => {
      if (modal === 'single-setup') {
        setHasSavedGame(!!localStorage.getItem('syntaxGameState'));
      }
    }, [modal]);

    const initializeSocket = useCallback(() => {
        if (connectionStatus === 'connecting') return;

        if (socket) {
            socket.disconnect();
        }

        const newSocket = io('https://cognitive-psy-assessment.onrender.com');
        setSocket(newSocket);
        setConnectionStatus('connecting');
        setMultiplayerFeedback('Connecting to server...');

        newSocket.on('connect', () => {
            setPlayerData(prev => ({ ...prev, id: newSocket.id }));
            setConnectionStatus('connected');
            setMultiplayerFeedback('');
        });

        newSocket.on('connect_error', () => {
            setConnectionStatus('failed');
            setMultiplayerFeedback('Failed to connect to server. Please check your connection.');
            newSocket.disconnect();
            setSocket(null);
        });

        newSocket.on('groupCreated', ({ groupCode: code, players: playerList }) => {
            setGroupCode(code);
            setPlayers(playerList);
            setModal('multi-proficiency');
        });

        newSocket.on('joinSuccess', ({ groupCode: code }) => {
            setGroupCode(code);
            setModal('waiting-room');
        });

        newSocket.on('joinError', (message) => {
            setMultiplayerFeedback(message);
        });

        newSocket.on('updatePlayers', (playerList) => {
            setPlayers(playerList);
        });

        newSocket.on('gameStarted', ({ proficiency: prof }) => {
            startGame(null, prof);
        });

        return newSocket;
    }, [socket, connectionStatus, startGame]);

    // Effect to initialize socket connection for multiplayer
    useEffect(() => {
        if (modal === 'multi-setup' && connectionStatus === 'idle') {
            initializeSocket();
        }
    }, [modal, connectionStatus, initializeSocket]);
    
    const resetToMenu = () => {
        if (timerInterval.current) clearInterval(timerInterval.current);
        if (socket) socket.disconnect();
        
        // Reset all state to initial values
        setView('menu');
        setModal('mode');
        setGameMode(null);
        setProficiency('easy');
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimer(50);
        setTrayWords([]);
        setPoolWords([]);
        setTypingInput('');
        setQuizProficiency('easy');
        setCurrentQuizQuestionIndex(0);
        setQuizScore(0);
        setSocket(null);
        setPlayerData({ id: '', nickname: '', score: 0 });
        setGroupCode(null);
        setPlayers([]);
        setNickname('');
        setJoinGroupCode('');
        setFeedback(null);
        setIsAnswerChecked(false);
        setConnectionStatus('idle');
        setMultiplayerFeedback('');

        // Clear saved game when explicitly returning to menu
        localStorage.removeItem('syntaxGameState');
    };

    const checkAnswer = () => {
        let isCorrect = false;
        
        if (proficiency === 'hard') {
            const correctAnswer = (levels[proficiency][currentQuestionIndex] as HardQuestion).answer;
            const normalize = (str: string) => str.toLowerCase().replace(/[.,?]$/, '').trim().replace(/\s+/g, ' ');
            isCorrect = normalize(typingInput) === normalize(correctAnswer);
        } else {
            if (trayWords.length === 0) {
              setFeedback({ message: 'Please build a sentence first.', type: 'incorrect'});
              setTimeout(() => setFeedback(null), 2000);
              return;
            }
            const sentenceTypes = trayWords.map(w => w.type).join(' ');
            const currentRule = (levels[proficiency][currentQuestionIndex] as CardQuestion).rule;
            const match = grammar.match(sentenceTypes, currentRule);
            isCorrect = match.succeeded();
        }

        if (isCorrect) {
            if(timerInterval.current) clearInterval(timerInterval.current);
            setIsAnswerChecked(true);

            const points = 100 + Math.max(0, timer * 2);
            const newScore = score + points;
            setScore(newScore);
            setFeedback({ message: `Correct! +${points} points`, type: 'correct' });
            
            if (gameMode === 'multi' && socket) {
                const updatedPlayerData = { ...playerData, score: newScore };
                setPlayerData(updatedPlayerData);
                socket.emit('updateScore', { ...updatedPlayerData, groupCode });
            }
            setTimeout(nextQuestion, 1500);
        } else {
            setFeedback({ message: "That's not quite right. Try again!", type: 'incorrect' });
            setTimeout(() => setFeedback(null), 2000);
        }
    };
    
    const checkQuizAnswer = (selectedAnswer: string) => {
      setIsAnswerChecked(true);
      const correctAnswer = quizData[quizProficiency][currentQuizQuestionIndex].answer;
      const isCorrect = selectedAnswer === correctAnswer;

      if(isCorrect) {
        setQuizScore(prev => prev + 100);
        setFeedback({ message: 'Correct!', type: 'correct' });
      } else {
        setFeedback({ message: `Incorrect. The correct answer is "${correctAnswer}".`, type: 'incorrect' });
      }
      setSelectedQuizAnswer({ answer: selectedAnswer, isCorrect });
    };

    const resumeGame = () => {
        const savedState = JSON.parse(localStorage.getItem('syntaxGameState') || '{}');
        if (savedState) {
            startGame(savedState);
        }
    };

    // --- Multiplayer ---
    
    const handleCreateGroup = () => {
      if(nickname && socket) {
        const pData = { ...playerData, nickname };
        setPlayerData(pData);
        socket.emit('createGroup', pData);
      }
    };

    const handleJoinGroup = () => {
      if(nickname && joinGroupCode && socket) {
        const pData = { ...playerData, nickname };
        setPlayerData(pData);
        socket.emit('joinGroup', { playerData: pData, groupCode: joinGroupCode });
      }
    };
    
    const handleSetMultiplayerProficiency = (prof: Proficiency) => {
      setProficiency(prof);
      socket?.emit('setProficiency', { groupCode, proficiency: prof });
      setModal('waiting-room');
    };
    
    const handleStartGameRequest = () => {
      socket?.emit('startGameRequest', { groupCode, proficiency });
    }

    // --- Drag and Drop Handlers ---
    const draggedTile = useRef<IdentifiedWord | null>(null);
    const draggedFrom = useRef<'pool' | 'tray' | null>(null);

    const onDragStart = (word: IdentifiedWord, from: 'pool' | 'tray') => {
        draggedTile.current = word;
        draggedFrom.current = from;
    };

    const onDrop = (target: 'pool' | 'tray') => {
        if (!draggedTile.current || !draggedFrom.current) return;
        
        const droppedWord = draggedTile.current;
        const source = draggedFrom.current;

        draggedTile.current = null;
        draggedFrom.current = null;

        if (source === target) {
            // This logic moves the dropped item to the end of its list.
            if (source === 'pool') {
                setPoolWords(prev => [
                    ...prev.filter(w => w.id !== droppedWord.id),
                    droppedWord
                ]);
            } else { // source === 'tray'
                setTrayWords(prev => [
                    ...prev.filter(w => w.id !== droppedWord.id),
                    droppedWord
                ]);
            }
        } else {
            // Move between containers
            if (source === 'pool') { // and target is 'tray'
                setPoolWords(prev => prev.filter(w => w.id !== droppedWord.id));
                setTrayWords(prev => [...prev, droppedWord]);
            } else { // source is 'tray' and target is 'pool'
                setTrayWords(prev => prev.filter(w => w.id !== droppedWord.id));
                setPoolWords(prev => [...prev, droppedWord]);
            }
        }
    };

    const handleWordClick = (wordToMove: IdentifiedWord, from: 'pool' | 'tray') => {
        if (from === 'pool') {
            setPoolWords(prev => prev.filter(word => word.id !== wordToMove.id));
            setTrayWords(prev => [...prev, wordToMove]);
        } else {
            setTrayWords(prev => prev.filter(word => word.id !== wordToMove.id));
            setPoolWords(prev => [...prev, wordToMove]);
        }
    };


    // --- Render Logic ---
    
    const renderModal = () => {
        if (!modal) return null;

        const baseModal = (title: string, children: React.ReactNode) => (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>{title}</h2>
                    {children}
                </div>
            </div>
        );

        switch (modal) {
            case 'mode':
                return baseModal('Welcome to The Syntax Card Game!', <>
                    <h3>Choose Your Mode</h3>
                    <div className="button-group">
                        <button onClick={() => { setGameMode('single'); setModal('single-setup'); }}>Single Player</button>
                        <button onClick={() => { setGameMode('multi'); setModal('multi-setup'); }}>Multiplayer</button>
                        <button onClick={() => { setGameMode('quiz'); setModal('quiz-setup'); }}>Syntax Quiz</button>
                    </div>
                </>);
            case 'single-setup':
                return baseModal('Player Setup', <>
                    <h3>Select Your Proficiency</h3>
                    <div className="button-group">
                        {(['easy', 'medium', 'hard'] as Proficiency[]).map(level => 
                            <button key={level} onClick={() => startGame(null, level)}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                        )}
                    </div>
                    {hasSavedGame && <div style={{ marginTop: 20 }}><p>Or</p><button onClick={resumeGame} className="secondary">Resume Previous Game</button></div>}
                    <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={() => setModal('mode')} className="secondary">Back</button></div>
                </>);
            case 'quiz-setup':
                return baseModal('Syntax Quiz Setup', <>
                  <h3>Select Your Difficulty</h3>
                  <div className="button-group">
                      {(['easy', 'medium', 'hard'] as Proficiency[]).map(level => 
                          <button key={level} onClick={() => { setQuizProficiency(level); startQuiz(); }}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                      )}
                  </div>
                  <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={() => setModal('mode')} className="secondary">Back</button></div>
              </>);
            case 'multi-setup':
                const isNicknameValid = nickname.trim().length > 0;
                return baseModal('Multiplayer Setup', <>
                    <div className="segmented-control">
                        <button className={multiplayerTab === 'create' ? 'active' : ''} onClick={() => setMultiplayerTab('create')}>Create Group</button>
                        <button className={multiplayerTab === 'join' ? 'active' : ''} onClick={() => setMultiplayerTab('join')}>Join Group</button>
                    </div>
                    <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Enter your nickname (max 15 chars)" maxLength={15} />
                    {multiplayerTab === 'join' && <input type="text" value={joinGroupCode} onChange={e => setJoinGroupCode(e.target.value)} placeholder="Enter 3-digit group code" maxLength={3} />}
                    <div id="multiplayer-feedback">{multiplayerFeedback}</div>
                    <div className="button-group">
                        {connectionStatus === 'failed' ? (
                            <button onClick={initializeSocket}>Retry Connection</button>
                        ) : (
                            <>
                                {multiplayerTab === 'create' && <button onClick={handleCreateGroup} disabled={!isNicknameValid || connectionStatus !== 'connected'}>Create Group</button>}
                                {multiplayerTab === 'join' && <button onClick={handleJoinGroup} disabled={!isNicknameValid || joinGroupCode.length !== 3 || connectionStatus !== 'connected'}>Join Group</button>}
                            </>
                        )}
                        <button onClick={resetToMenu} className="secondary">Back</button>
                    </div>
                </>);
            case 'multi-proficiency':
              return baseModal('Choose Game Difficulty', <>
                <h3 style={{ color: 'var(--text-dark)', fontSize: '1rem', marginBottom: '2rem' }}>The host selects the proficiency for all players.</h3>
                <div className="button-group">
                    {(['easy', 'medium', 'hard'] as Proficiency[]).map(level =>
                        <button key={level} onClick={() => handleSetMultiplayerProficiency(level)}>{level.charAt(0).toUpperCase() + level.slice(1)}</button>
                    )}
                </div>
                <div className="button-group" style={{ marginTop: '1rem' }}><button onClick={resetToMenu} className="secondary">Back</button></div>
              </>);
            case 'waiting-room':
              const isHost = players.length > 0 && players[0].id === playerData.id;
              return baseModal('Waiting Room', <>
                <p>Share this code with your friends!</p>
                <div id="group-code-display">Group Code: <strong>{groupCode}</strong></div>
                <h3>Players Joined:</h3>
                <ul id="waiting-room-player-list">
                    {players.map(p => <li key={p.id}>{p.nickname}{p.id === playerData.id ? ' (You)' : ''}</li>)}
                </ul>
                <div className="button-group">
                    {isHost && <button onClick={handleStartGameRequest}>Start Game</button>}
                    <button onClick={resetToMenu} className="secondary">Back</button>
                </div>
              </>);
            case 'game-over':
                return baseModal(gameOverMessage.title, <>
                    <p>{gameOverMessage.message}</p>
                    <h3>Final Score: <span id="final-score">{gameMode === 'quiz' ? quizScore : score}</span></h3>
                    <div className="button-group"><button onClick={resetToMenu}>Back to Menu</button></div>
                </>);
            default: return null;
        }
    };
    
    const renderGameView = () => {
        const totalQuestions = levels[proficiency].length;
        const currentQuestion = levels[proficiency][currentQuestionIndex];

        return (<>
            <header>
                <button onClick={resetToMenu} className="menu-btn btn btn-secondary">Menu</button>
                <h1>The Syntax Card Game</h1>
                <p>{proficiency === 'hard' ? 'Type the sentence based on the prompt below.' : 'Arrange the words to match the target sentence structure.'}</p>
                <div id="timer">Time: {timer}</div>
            </header>
            <main>
                <div className="progress-tracker">
                    <div>Proficiency: {proficiency.charAt(0).toUpperCase() + proficiency.slice(1)}</div>
                    <div>Question: {currentQuestionIndex + 1}/{totalQuestions}</div>
                </div>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                </div>

                {proficiency === 'hard' ? (
                    <div id="typing-challenge-container">
                        <div id="typing-prompt-area">
                            <h3>Prompt:</h3>
                            <p>{(currentQuestion as HardQuestion).prompt}</p>
                        </div>
                        <div id="typing-word-set-area">
                            <h4>Word Set (Hint):</h4>
                            <p>{(currentQuestion as HardQuestion).wordSet.join(', ')}</p>
                        </div>
                        <textarea id="typing-input" rows={3} value={typingInput} onChange={e => setTypingInput(e.target.value)} placeholder="Type your sentence here..."></textarea>
                    </div>
                ) : (
                    <>
                        <div id="challenge-display">
                            <h2>TARGET: <span>{(currentQuestion as CardQuestion).displayRule}</span></h2>
                        </div>
                        <div className="sentence-tray droppable" onDragOver={e => e.preventDefault()} onDrop={() => onDrop('tray')}>
                            {trayWords.map(word => <div key={word.id} className="word-tile" draggable onDragStart={() => onDragStart(word, 'tray')} onClick={() => handleWordClick(word, 'tray')}>{word.word}</div>)}
                        </div>
                        <div className="word-pool droppable" onDragOver={e => e.preventDefault()} onDrop={() => onDrop('pool')}>
                            {poolWords.map(word => <div key={word.id} className="word-tile" draggable onDragStart={() => onDragStart(word, 'pool')} onClick={() => handleWordClick(word, 'pool')}>{word.word}</div>)}
                        </div>
                    </>
                )}

                <div className={`feedback-area ${feedback ? `feedback-${feedback.type}` : ''}`}>{feedback?.message}</div>
                <div id="action-buttons">
                    <button onClick={() => loadQuestion(currentQuestionIndex, proficiency)} className="btn btn-secondary">Reset</button>
                    <button onClick={checkAnswer} className="btn btn-primary" disabled={isAnswerChecked}>Check Answer</button>
                </div>

                {gameMode === 'multi' && (
                    <div id="multiplayer-scoreboard">
                        <h3>Scoreboard</h3>
                        <ul id="player-scores">
                            {[...players].sort((a,b) => b.score - a.score).map(p => (
                                <li key={p.id}>
                                    <span className="player-name">{p.nickname}{p.id === playerData.id ? ' (You)' : ''}</span>
                                    <span className="player-score">{p.score}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>
        </>);
    };

    const renderQuizView = () => {
      const totalQuestions = quizData[quizProficiency].length;
      const currentQuestion = quizData[quizProficiency][currentQuizQuestionIndex];

      const getButtonClass = (option: string) => {
        if (!selectedQuizAnswer) return 'quiz-option-btn';
        if (option === currentQuestion.answer) return 'quiz-option-btn correct';
        if (option === selectedQuizAnswer.answer && !selectedQuizAnswer.isCorrect) return 'quiz-option-btn incorrect';
        return 'quiz-option-btn';
      };

      return (<>
          <header>
              <button onClick={resetToMenu} className="menu-btn btn btn-secondary">Menu</button>
              <h1>Syntax Quiz</h1>
              <p>Test your grammar knowledge.</p>
          </header>
          <main>
              <div className="progress-tracker">
                  <div>Difficulty: {quizProficiency.charAt(0).toUpperCase() + quizProficiency.slice(1)}</div>
                  <div>Question: {currentQuizQuestionIndex + 1}/{totalQuestions}</div>
              </div>
              <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${((currentQuizQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
              </div>
              <div id="quiz-question-area">
                  <h2 id="quiz-question-text">{currentQuestion.question}</h2>
              </div>
              <div id="quiz-options-area">
                {shuffledQuizOptions.map(option => (
                  <button 
                    key={option} 
                    className={getButtonClass(option)}
                    onClick={() => checkQuizAnswer(option)}
                    disabled={isAnswerChecked}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div id="quiz-feedback-area" style={{ color: feedback?.type === 'correct' ? 'var(--success)' : 'var(--error)'}}>{feedback?.message}</div>
              <div id="quiz-action-buttons">
                  {isAnswerChecked && <button onClick={nextQuizQuestion} className="btn btn-primary">Next Question</button>}
              </div>
          </main>
      </>);
    };

    return (
        <>
            {renderModal()}
            {(view === 'game' || view === 'quiz') && (
                <div id="game-container">
                    {view === 'game' && renderGameView()}
                    {view === 'quiz' && renderQuizView()}
                </div>
            )}
        </>
    );
};

export default App;