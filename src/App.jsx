import React, { useState, useEffect, useCallback } from 'react';

    const App = () => {
      const [password, setPassword] = useState('');
      const [message, setMessage] = useState('');
      const [isUnlocked, setIsUnlocked] = useState(false);
      const [volume, setVolume] = useState(50);
      const [isPoweredOn, setIsPoweredOn] = useState(true);
      const [currentApp, setCurrentApp] = useState(null);
      const [snakeGameScore, setSnakeGameScore] = useState(0);
      const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
      const [food, setFood] = useState({ x: 5, y: 5 });
      const [direction, setDirection] = useState('RIGHT');
      const [gameOver, setGameOver] = useState(false);
      const [ticTacToeBoard, setTicTacToeBoard] = useState(Array(9).fill(null));
      const [isXNext, setIsXNext] = useState(true);
      const [calculatorValue, setCalculatorValue] = useState('0');
      const [calculatorOperator, setCalculatorOperator] = useState(null);
      const [calculatorStoredValue, setCalculatorStoredValue] = useState(null);
      const [messages, setMessages] = useState([]);
      const [newMessage, setNewMessage] = useState('');
      const correctPassword = '8833';

      const flowerImageUrl = 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=300&q=80';

      const handleKeyPress = (num) => {
        if (password.length < 4) {
          setPassword(password + num);
        }
      };

      const handleUnlock = () => {
        if (password === correctPassword) {
          setIsUnlocked(true);
        } else {
          setMessage('Wrong password!');
          setPassword('');
        }
      };

      const handleClear = () => {
        setPassword('');
        setMessage('');
      };

      const handleDelete = () => {
        setPassword(password.slice(0, -1));
      };

      const handleLock = () => {
        setIsUnlocked(false);
        setPassword('');
        setMessage('');
        setCurrentApp(null);
      };

      const handleAppClick = (appName) => {
        setCurrentApp(appName);
        if (appName === 'Snake') {
          setSnake([{ x: 10, y: 10 }]);
          setFood({ x: 5, y: 5 });
          setDirection('RIGHT');
          setGameOver(false);
          setSnakeGameScore(0);
        }
      };

      const handleBack = () => {
        setCurrentApp(null);
        setTicTacToeBoard(Array(9).fill(null));
        setIsXNext(true);
        setCalculatorValue('0');
        setCalculatorOperator(null);
        setCalculatorStoredValue(null);
      };

      const handleVolumeUp = () => {
        if (volume < 100) {
          setVolume(volume + 10);
        }
      };

      const handleVolumeDown = () => {
        if (volume > 0) {
          setVolume(volume - 10);
        }
      };

      const handlePower = () => {
        setIsPoweredOn(!isPoweredOn);
        setIsUnlocked(false);
        setPassword('');
        setMessage('');
        setCurrentApp(null);
      };

      const handleSnakeGameStart = () => {
        setSnake([{ x: 10, y: 10 }]);
        setFood({ x: 5, y: 5 });
        setDirection('RIGHT');
        setGameOver(false);
        setSnakeGameScore(0);
      };

      const handleTicTacToeClick = (index) => {
        if (ticTacToeBoard[index] || calculateWinner(ticTacToeBoard)) return;
        const newBoard = [...ticTacToeBoard];
        newBoard[index] = isXNext ? 'X' : 'O';
        setTicTacToeBoard(newBoard);
        setIsXNext(!isXNext);
      };

      const calculateWinner = (board) => {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let line of lines) {
          const [a, b, c] = line;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
          }
        }
        return null;
      };

      const handleCalculatorInput = (value) => {
        if (value === 'C') {
          setCalculatorValue('0');
          setCalculatorOperator(null);
          setCalculatorStoredValue(null);
        } else if (value === '=') {
          if (calculatorOperator && calculatorStoredValue !== null) {
            const result = calculate(calculatorStoredValue, calculatorValue, calculatorOperator);
            setCalculatorValue(result.toString());
            setCalculatorOperator(null);
            setCalculatorStoredValue(null);
          }
        } else if (['+', '-', '*', '/'].includes(value)) {
          setCalculatorOperator(value);
          setCalculatorStoredValue(calculatorValue);
          setCalculatorValue('0');
        } else {
          setCalculatorValue(calculatorValue === '0' ? value : calculatorValue + value);
        }
      };

      const calculate = (a, b, operator) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        switch (operator) {
          case '+':
            return numA + numB;
          case '-':
            return numA - numB;
          case '*':
            return numA * numB;
          case '/':
            return numA / numB;
          default:
            return 0;
        }
      };

      const handleSendMessage = () => {
        if (newMessage.trim()) {
          setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
          setNewMessage('');
        }
      };

      const moveSnake = useCallback(() => {
        if (gameOver) return;

        const head = { ...snake[0] };
        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
          default:
            break;
        }

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return;
        }

        const newSnake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
          setSnakeGameScore(prevScore => prevScore + 1);
          setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
        } else {
          newSnake.pop();
        }
        setSnake(newSnake);
      }, [snake, direction, food, gameOver]);

      useEffect(() => {
        const handleKeyDown = (e) => {
          if (currentApp === 'Snake') {
            switch (e.key) {
              case 'ArrowUp':
                if (direction !== 'DOWN') setDirection('UP');
                break;
              case 'ArrowDown':
                if (direction !== 'UP') setDirection('DOWN');
                break;
              case 'ArrowLeft':
                if (direction !== 'RIGHT') setDirection('LEFT');
                break;
              case 'ArrowRight':
                if (direction !== 'LEFT') setDirection('RIGHT');
                break;
              default:
                break;
            }
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
      }, [direction, currentApp]);

      useEffect(() => {
        const gameLoop = setInterval(moveSnake, 100);
        return () => clearInterval(gameLoop);
      }, [moveSnake]);

      const renderAppScreen = () => {
        switch (currentApp) {
          case 'Camera':
            return (
              <div className="app-screen">
                <h2>Camera</h2>
                <div className="camera-preview">
                  <img src={flowerImageUrl} alt="Flowers" />
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'Messages':
            return (
              <div className="app-screen">
                <h2>Messages</h2>
                <div className="messages-list">
                  {messages.map((message) => (
                    <p key={message.id}>{message.text}</p>
                  ))}
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'Browser':
            return (
              <div className="app-screen">
                <h2>Browser</h2>
                <div className="browser-content">
                  <p>Welcome to the browser!</p>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'Settings':
            return (
              <div className="app-screen">
                <h2>Settings</h2>
                <div className="settings-list">
                  <p>Volume: {volume}</p>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'Snake':
            return (
              <div className="app-screen">
                <h2>Snake Game</h2>
                <div className="game-content">
                  <p>Score: {snakeGameScore}</p>
                  <div className="snake-game-board">
                    {Array.from({ length: 20 }, (_, y) => (
                      <div key={y} className="snake-game-row">
                        {Array.from({ length: 20 }, (_, x) => {
                          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
                          const isFood = food.x === x && food.y === y;
                          return (
                            <div
                              key={x}
                              className={`snake-game-cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  {gameOver && <p>Game Over!</p>}
                  <button className="game-button" onClick={handleSnakeGameStart}>Restart Game</button>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'TicTacToe':
            const winner = calculateWinner(ticTacToeBoard);
            return (
              <div className="app-screen">
                <h2>Tic Tac Toe</h2>
                <div className="game-content">
                  <p>{winner ? `Winner: ${winner}` : `Next Player: ${isXNext ? 'X' : 'O'}`}</p>
                  <div className="tic-tac-toe-board">
                    {ticTacToeBoard.map((cell, index) => (
                      <button key={index} className="tic-tac-toe-cell" onClick={() => handleTicTacToeClick(index)}>
                        {cell}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          case 'Calculator':
            return (
              <div className="app-screen">
                <h2>Calculator</h2>
                <div className="calculator">
                  <div className="calculator-display">{calculatorValue}</div>
                  <div className="calculator-buttons">
                    <button onClick={() => handleCalculatorInput('7')}>7</button>
                    <button onClick={() => handleCalculatorInput('8')}>8</button>
                    <button onClick={() => handleCalculatorInput('9')}>9</button>
                    <button onClick={() => handleCalculatorInput('+')}>+</button>
                    <button onClick={() => handleCalculatorInput('4')}>4</button>
                    <button onClick={() => handleCalculatorInput('5')}>5</button>
                    <button onClick={() => handleCalculatorInput('6')}>6</button>
                    <button onClick={() => handleCalculatorInput('-')}>-</button>
                    <button onClick={() => handleCalculatorInput('1')}>1</button>
                    <button onClick={() => handleCalculatorInput('2')}>2</button>
                    <button onClick={() => handleCalculatorInput('3')}>3</button>
                    <button onClick={() => handleCalculatorInput('*')}>*</button>
                    <button onClick={() => handleCalculatorInput('0')}>0</button>
                    <button onClick={() => handleCalculatorInput('.')}>.</button>
                    <button onClick={() => handleCalculatorInput('=')}>=</button>
                    <button onClick={() => handleCalculatorInput('/')}>/</button>
                    <button onClick={() => handleCalculatorInput('C')}>C</button>
                  </div>
                </div>
                <button className="back-button" onClick={handleBack}>Back</button>
              </div>
            );
          default:
            return null;
        }
      };

      return (
        <div className="phone">
          <div className="buttons">
            <button className="power-button" onClick={handlePower}>
              {isPoweredOn ? '⏻' : '⏼'}
            </button>
            <div className="volume-buttons">
              <button className="volume-button" onClick={handleVolumeUp}>+</button>
              <button className="volume-button" onClick={handleVolumeDown}>-</button>
            </div>
          </div>
          {isPoweredOn ? (
            <div className={`screen ${isUnlocked ? 'unlocked' : 'locked'}`}>
              {isUnlocked ? (
                currentApp ? (
                  renderAppScreen()
                ) : (
                  <div className="home-screen">
                    <div className="app-grid">
                      <div className="app" onClick={() => handleAppClick('Camera')}>
                        📷
                        <span>Camera</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('Messages')}>
                        💬
                        <span>Messages</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('Browser')}>
                        🌐
                        <span>Browser</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('Settings')}>
                        ⚙️
                        <span>Settings</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('Snake')}>
                        🐍
                        <span>Snake</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('TicTacToe')}>
                        ⭕
                        <span>Tic Tac Toe</span>
                      </div>
                      <div className="app" onClick={() => handleAppClick('Calculator')}>
                        🧮
                        <span>Calculator</span>
                      </div>
                    </div>
                    <button className="lock-button" onClick={handleLock}>Lock</button>
                  </div>
                )
              ) : (
                <>
                  <div className="input">{password}</div>
                  {message && <div className="message">{message}</div>}
                  <div className="keypad">
                    <button className="key" onClick={() => handleKeyPress('1')}>1</button>
                    <button className="key" onClick={() => handleKeyPress('2')}>2</button>
                    <button className="key" onClick={() => handleKeyPress('3')}>3</button>
                    <button className="key" onClick={() => handleKeyPress('4')}>4</button>
                    <button className="key" onClick={() => handleKeyPress('5')}>5</button>
                    <button className="key" onClick={() => handleKeyPress('6')}>6</button>
                    <button className="key" onClick={() => handleKeyPress('7')}>7</button>
                    <button className="key" onClick={() => handleKeyPress('8')}>8</button>
                    <button className="key" onClick={() => handleKeyPress('9')}>9</button>
                    <button className="key" onClick={handleClear}>C</button>
                    <button className="key" onClick={() => handleKeyPress('0')}>0</button>
                    <button className="key" onClick={handleDelete}>⌫</button>
                    <button className="key" onClick={handleUnlock}>U</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="screen off-screen">
              <h2>Phone is off</h2>
            </div>
          )}
        </div>
      );
    };

    export default App;
