"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const DynamicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const lines: Line[] = []
    const silhouettes: Silhouette[] = []
    const emojis: Emoji[] = []
    const collisionPairs = new Set<string>()

    class Line {
      points: { x: number; y: number }[]
      color: string
      speed: number
      direction: { x: number; y: number }
      curveChance: number

      constructor() {
        this.points = [{ x: Math.random() * canvas.width, y: Math.random() * canvas.height }]
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`
        this.speed = Math.random() * 0.5 + 0.1
        this.direction = this.getRandomDirection()
        this.curveChance = 0.1 // 10% chance to curve at each point
      }

      getRandomDirection() {
        const angle = Math.random() * Math.PI * 2
        return { x: Math.cos(angle), y: Math.sin(angle) }
      }

      draw() {
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.stroke()
      }

      update() {
        const lastPoint = this.points[this.points.length - 1]
        const newX = lastPoint.x + this.direction.x * this.speed
        const newY = lastPoint.y + this.direction.y * this.speed

        // Occasionally curve
        if (Math.random() < this.curveChance) {
          this.direction = this.getRandomDirection()
        }

        if (newX < 0 || newX > canvas.width || newY < 0 || newY > canvas.height) {
          // Reset the line if it goes off-screen
          this.points = [{ x: Math.random() * canvas.width, y: Math.random() * canvas.height }]
          this.direction = this.getRandomDirection()
        } else {
          this.points.push({ x: newX, y: newY })
          if (this.points.length > 50) {
            this.points.shift()
          }
        }

        this.draw()
      }
    }

    class Silhouette {
      x: number
      y: number
      speed: number
      size: number
      direction: number

      constructor() {
        this.direction = Math.random() < 0.5 ? -1 : 1 // -1 for left, 1 for right
        this.x = this.direction === 1 ? -50 : canvas.width + 50 // Start off-screen
        this.y = canvas.height - Math.random() * (canvas.height / 2) // Bottom half of the screen
        this.speed = (Math.random() * 0.5 + 0.5) * this.direction
        this.size = Math.random() * 15 + 25 // Random size between 25 and 40
      }

      draw() {
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)" // Dark gray with some transparency
        ctx.strokeStyle = "rgba(50, 50, 50, 0.8)" // Match stroke color to fill color

        // Head
        ctx.beginPath()
        ctx.arc(this.x, this.y - this.size / 2, this.size / 8, 0, Math.PI * 2)
        ctx.fill()

        // Body
        ctx.fillRect(this.x - this.size / 6, this.y - this.size / 3, this.size / 3, this.size / 2)

        // Legs
        const legPhase = (Date.now() / 200) % (Math.PI * 2)
        const legLength = this.size / 3
        const hipWidth = this.size / 4
        const maxLegSwing = Math.PI / 6 // Reduced from default PI/2 for more realistic movement

        // Left leg
        ctx.beginPath()
        ctx.moveTo(this.x - hipWidth / 2, this.y + this.size / 6)
        ctx.lineTo(
          this.x - hipWidth / 2 + Math.sin(legPhase) * legLength * Math.sin(maxLegSwing),
          this.y + this.size / 6 + Math.abs(Math.cos(legPhase)) * legLength,
        )
        ctx.lineWidth = 4
        ctx.stroke()

        // Right leg
        ctx.beginPath()
        ctx.moveTo(this.x + hipWidth / 2, this.y + this.size / 6)
        ctx.lineTo(
          this.x + hipWidth / 2 + Math.sin(legPhase + Math.PI) * legLength * Math.sin(maxLegSwing),
          this.y + this.size / 6 + Math.abs(Math.cos(legPhase + Math.PI)) * legLength,
        )
        ctx.lineWidth = 4
        ctx.stroke()
      }

      update() {
        this.x += this.speed
        if (this.direction === 1 && this.x > canvas.width + 50) {
          this.x = -50 // Reset to the left when it goes off-screen
        } else if (this.direction === -1 && this.x < -50) {
          this.x = canvas.width + 50 // Reset to the right when it goes off-screen
        }
        this.draw()
      }
    }

    class Emoji {
      x: number
      y: number
      emoji: string
      opacity: number
      speed: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.emoji = this.getRandomEmoji()
        this.opacity = 1
        this.speed = Math.random() * 0.5 + 0.5
      }

      getRandomEmoji() {
        const emojis = [
          "😊",
          "👋",
          "🎉",
          "💡",
          "🌟",
          "🤔",
          "👍",
          "🙌",
          "💪",
          "🚀",
          "😂",
          "🤣",
          "❤️",
          "😍",
          "🙏",
          "😭",
          "😎",
          "😅",
          "🔥",
          "🥰",
          "😁",
          "🤗",
          "😆",
          "🤩",
          "😘",
          "🥳",
          "🤔",
          "🤷",
          "🙄",
          "😏",
          "😋",
          "😜",
          "😇",
          "🥺",
          "💖",
          "💞",
          "💘",
          "✨",
          "🎶",
          "🎵",
          "🤝",
          "👏",
          "🤞",
          "🤙",
          "💃",
          "🕺",
          "👀",
          "💁",
          "🙆",
          "🙅",
          "🎊",
          "🎁",
          "🍕",
          "🍔",
          "🍟",
          "🍩",
          "☕",
          "🍷",
          "🍺",
          "🎂",
          "🐶",
          "🐱",
          "🐼",
          "🐨",
          "🐸",
          "🐰",
          "🦊",
          "🐻",
          "🐥",
          "🦄",
          "🌍",
          "🌞",
          "🌈",
          "⛄",
          "🌊",
          "🌸",
          "🌻",
          "🎨",
          "🎭",
          "🎮",
          "🏆",
          "🥇",
          "🎯",
          "🕹️",
          "📱",
          "💻",
          "⌚",
          "🎧",
          "📸",
          "🎥",
          "🚗",
          "🚲",
          "🚄",
          "🚢",
          "✈️",
          "🛸",
          "🚦",
          "🏠",
          "🏖️",
          "🏰",
          "🗺️",
          "🌆",
          "🛒",
          "🔑",
          "💰",
          "💎",
          "📚",
          "📝",
          "✍️",
          "📢",
          "🔔",
          "🔊",
          "🎙️",
          "📅",
          "🕰️",
          "⏳",
          "💣",
          "⚡",
          "💀",
          "👻",
          "🎃",
          "🤡",
          "👑",
          "🎩",
          "🕶️",
          "👓",
          "🥽",
          "🥼",
          "🎽",
          "👜",
          "👠",
          "👟",
          "🧥",
          "👗",
          "🎸",
          "🎺",
          "🥁",
          "🎻",
          "🎷",
          "🎹",
          "🖥️",
          "🖨️",
          "📡",
          "🔭",
          "🛠️",
          "🔧",
          "🔨",
          "⛏️",
          "⚙️",
          "🧲",
          "🛎️",
          "🚪",
          "🛏️",
          "🚿",
          "🛁",
          "🍽️",
          "🍴",
          "🥄",
          "🔪",
          "🏹",
        ]
        return emojis[Math.floor(Math.random() * emojis.length)]
      }

      draw() {
        ctx.font = "20px Arial"
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`
        ctx.fillText(this.emoji, this.x, this.y)
      }

      update() {
        this.y -= this.speed
        this.opacity -= 0.02
        this.draw()
      }
    }

    // Increase the number of lines from 20 to 40
    for (let i = 0; i < 40; i++) {
      lines.push(new Line())
    }

    // Create silhouettes (25% more than before, which was 30)
    const silhouetteCount = Math.floor(30 * 1.25)
    for (let i = 0; i < silhouetteCount; i++) {
      silhouettes.push(new Silhouette())
    }

    function checkInteractions() {
      for (let i = 0; i < silhouettes.length; i++) {
        for (let j = i + 1; j < silhouettes.length; j++) {
          const s1 = silhouettes[i]
          const s2 = silhouettes[j]
          if (s1.direction !== s2.direction) {
            const distance = Math.abs(s1.x - s2.x)
            if (distance < 10) {
              const pairId = `${Math.min(i, j)}-${Math.max(i, j)}`
              if (!collisionPairs.has(pairId) && Math.random() < 0.5) {
                const midX = (s1.x + s2.x) / 2
                const midY = Math.min(s1.y, s2.y) - 20
                emojis.push(new Emoji(midX, midY))
                collisionPairs.add(pairId)
              }
            } else if (distance > 20) {
              // Reset collision pair when silhouettes are far apart
              const pairId = `${Math.min(i, j)}-${Math.max(i, j)}`
              collisionPairs.delete(pairId)
            }
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      lines.forEach((line) => line.update())
      silhouettes.forEach((silhouette) => silhouette.update())
      checkInteractions()
      emojis.forEach((emoji, index) => {
        emoji.update()
        if (emoji.opacity <= 0) {
          emojis.splice(index, 1)
        }
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
}

export default DynamicBackground