import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

function FloatingHearts() {
  const [hearts, setHearts] = useState([])

  useEffect(() => {
    const createHeart = () => {
      const heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: 4 + Math.random() * 4,
        size: 10 + Math.random() * 20,
        opacity: 0.2 + Math.random() * 0.3,
      }
      setHearts(prev => [...prev, heart])

      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== heart.id))
      }, heart.animationDuration * 1000)
    }

    const interval = setInterval(createHeart, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="floating-hearts">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.animationDuration}s`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            opacity: heart.opacity,
          }}
        />
      ))}
    </div>
  )
}

function Confetti({ active }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (active) {
      const newParticles = []
      for (let i = 0; i < 100; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          size: 8 + Math.random() * 12,
          rotation: Math.random() * 360,
        })
      }
      setParticles(newParticles)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="confetti-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-heart"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  )
}

const teasingMessages = [
  "Haha, you thought!",
  "Nice try!",
  "Not gonna happen!",
  "Keep trying!",
  "Nope nope nope!",
  "Can't catch me!",
  "Wrong choice anyway!",
]

function App() {
  const [accepted, setAccepted] = useState(false)
  const [noButtonPos, setNoButtonPos] = useState({ x: null, y: null })
  const [teasingMessage, setTeasingMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const noButtonRef = useRef(null)

  const moveNoButton = useCallback((mouseX, mouseY) => {
    if (!noButtonRef.current) return

    const button = noButtonRef.current.getBoundingClientRect()
    const buttonCenterX = button.left + button.width / 2
    const buttonCenterY = button.top + button.height / 2

    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    )

    if (distance < 150) {
      const padding = 50
      const safeWidth = Math.max(window.innerWidth - 200, 200)
      const safeHeight = Math.max(window.innerHeight - 100, 200)

      let newX, newY

      // Simple approach: move to a random position on the opposite half of the screen
      if (mouseX < window.innerWidth / 2) {
        // Mouse on left, button goes right
        newX = (window.innerWidth / 2) + padding + Math.random() * (safeWidth / 2 - padding)
      } else {
        // Mouse on right, button goes left
        newX = padding + Math.random() * (safeWidth / 2 - padding)
      }

      if (mouseY < window.innerHeight / 2) {
        // Mouse on top, button goes bottom
        newY = (window.innerHeight / 2) + padding + Math.random() * (safeHeight / 2 - padding)
      } else {
        // Mouse on bottom, button goes top
        newY = padding + Math.random() * (safeHeight / 2 - padding)
      }

      // Ensure values are valid numbers and within bounds
      newX = Math.max(padding, Math.min(Number(newX) || padding, window.innerWidth - 150))
      newY = Math.max(padding, Math.min(Number(newY) || padding, window.innerHeight - 80))

      setNoButtonPos({ x: newX, y: newY })

      const randomMessage = teasingMessages[Math.floor(Math.random() * teasingMessages.length)]
      setTeasingMessage(randomMessage)
      setShowMessage(true)

      setTimeout(() => setShowMessage(false), 1500)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      moveNoButton(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [moveNoButton])

  const noButtonStyle = noButtonPos.x !== null ? {
    position: 'fixed',
    left: `${noButtonPos.x}px`,
    top: `${noButtonPos.y}px`,
    transition: 'all 0.3s ease-out',
    zIndex: 1000,
  } : {}

  const handleYes = () => {
    setAccepted(true)
  }

  const handleBack = () => {
    setAccepted(false)
    setNoButtonPos({ x: null, y: null })
  }

  if (accepted) {
    return (
      <div className="app success-bg">
        <FloatingHearts />
        <Confetti active={true} />
        <div className="success-container">
          <div className="big-heart pulse" />
          <h1 className="success-title">Yay!</h1>
          <p className="success-text">I knew you&apos;d say yes!</p>
          <p className="love-message">I love you, Sanika!</p>
          <div className="hearts-row">
            <div className="small-heart" />
            <div className="small-heart" />
            <div className="small-heart" />
            <div className="small-heart" />
            <div className="small-heart" />
          </div>
          <button className="btn letter-btn" onClick={() => setShowLetter(true)}>
            Read Letter
          </button>
          <button className="btn back-btn" onClick={handleBack}>
            Go Back
          </button>
        </div>

        {showLetter && (
          <div className="letter-overlay" onClick={() => setShowLetter(false)}>
            <div className="letter-container" onClick={(e) => e.stopPropagation()}>
              <button className="letter-close" onClick={() => setShowLetter(false)}>×</button>
              <div className="letter-content">
                <p>Hello,</p>
                <p>Happy Valentine&apos;s Day Sanika. I&apos;m so grateful for you, you make my life so fun and exciting. All the conversations, the laughs, the way we understand each other without needing to explain everything. I always want to be with you. You have been my comfort on the bad days, and my favorite person to celebrate with on my good days.</p>
                <p>I love how much we both have grown as people in our relationship and how much stronger our bond has gotten over the year and 2 months. Thank you for always believing in me and loving me unconditionally. I promise I will be better going forward, and become the best possible version of myself for you.</p>
                <p>I love you sooooo much. And thanks for letting me be your valentine this year! Lob u</p>
                <p className="letter-signature">-Prady<br />02/01/2026</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="app">
      <FloatingHearts />
      <div className="card">
        <div className="heart-icon pulse" />
        <h1 className="title">Sanika</h1>
        <h2 className="question">Will you be my Valentine?</h2>
        <div className="button-container">
          <button className="btn yes-btn" onClick={handleYes}>
            Yes!
          </button>
          <button
            ref={noButtonRef}
            className="btn no-btn"
            style={noButtonStyle}
          >
            No
          </button>
        </div>
        <p className="hint">(Try hovering over the No button)</p>
        {showMessage && (
          <div className="teasing-message">{teasingMessage}</div>
        )}
      </div>
    </div>
  )
}

export default App
