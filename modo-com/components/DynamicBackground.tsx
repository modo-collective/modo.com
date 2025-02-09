"use client"

import { useEffect, useRef, useState } from "react"

interface Point {
  x: number
  y: number
}

interface Line {
  points: Point[]
  color: string
  speed: number
  direction: Point
  curveChance: number
  draw: (ctx: CanvasRenderingContext2D) => void
  update: (width: number, height: number) => void
  getRandomDirection: () => Point
}

interface Silhouette {
  x: number
  y: number
  speed: number
  size: number
  direction: number
  draw: (ctx: CanvasRenderingContext2D) => void
  update: (width: number, height: number) => void
}

interface Emoji {
  x: number
  y: number
  emoji: string
  opacity: number
  speed: number
  draw: (ctx: CanvasRenderingContext2D) => void
  update: () => void
}

const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const lines: Line[] = []
    const silhouettes: Silhouette[] = []
    const emojis: Emoji[] = []
    const collisionPairs = new Set<string>()

    class LineClass implements Line {
      points: Point[]
      color: string
      speed: number
      direction: Point
      curveChance: number

      constructor(width: number, height: number) {
        this.points = [{ x: Math.random() * width, y: Math.random() * height }]
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`
        this.speed = Math.random() * 0.5 + 0.1
        this.direction = this.getRandomDirection()
        this.curveChance = 0.1
      }

      getRandomDirection(): Point {
        const angle = Math.random() * Math.PI * 2
        return { x: Math.cos(angle), y: Math.sin(angle) }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
          ctx.lineTo(this.points[i].x, this.points[i].y)
        }
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.stroke()
      }

      update(width: number, height: number) {
        const lastPoint = this.points[this.points.length - 1]
        const newX = lastPoint.x + this.direction.x * this.speed
        const newY = lastPoint.y + this.direction.y * this.speed

        if (Math.random() < this.curveChance) {
          this.direction = this.getRandomDirection()
        }

        if (newX < 0 || newX > width || newY < 0 || newY > height) {
          this.points = [{ x: Math.random() * width, y: Math.random() * height }]
          this.direction = this.getRandomDirection()
        } else {
          this.points.push({ x: newX, y: newY })
          if (this.points.length > 50) {
            this.points.shift()
          }
        }
      }
    }

    class SilhouetteClass implements Silhouette {
      x: number
      y: number
      speed: number
      size: number
      direction: number

      constructor(width: number, height: number) {
        this.direction = Math.random() < 0.5 ? -1 : 1
        this.x = this.direction === 1 ? -50 : width + 50
        this.y = height - Math.random() * (height / 2)
        this.speed = (Math.random() * 0.5 + 0.5) * this.direction
        this.size = Math.random() * 15 + 25
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgba(50, 50, 50, 0.8)"
        ctx.strokeStyle = "rgba(50, 50, 50, 0.8)"

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
        const maxLegSwing = Math.PI / 6

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

      update(width: number, height: number) {
        this.x += this.speed
        if (this.direction === 1 && this.x > width + 50) {
          this.x = -50
          this.y = height - Math.random() * (height / 2) // Randomize y position when resetting
        } else if (this.direction === -1 && this.x < -50) {
          this.x = width + 50
          this.y = height - Math.random() * (height / 2) // Randomize y position when resetting
        }
      }
    }

    class EmojiClass implements Emoji {
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

      getRandomEmoji(): string {
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

      draw(ctx: CanvasRenderingContext2D) {
        ctx.font = "20px Arial"
        ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`
        ctx.fillText(this.emoji, this.x, this.y)
      }

      update() {
        this.y -= this.speed
        this.opacity -= 0.02
      }
    }

    for (let i = 0; i < 40; i++) {
      lines.push(new LineClass(dimensions.width, dimensions.height))
    }

    const silhouetteCount = Math.floor(30 * 1.25)
    for (let i = 0; i < silhouetteCount; i++) {
      silhouettes.push(new SilhouetteClass(dimensions.width, dimensions.height))
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
                emojis.push(new EmojiClass(midX, midY))
                collisionPairs.add(pairId)
              }
            } else if (distance > 20) {
              const pairId = `${Math.min(i, j)}-${Math.max(i, j)}`
              collisionPairs.delete(pairId)
            }
          }
        }
      }
    }

    let animationFrameId: number

    function animate() {
      if (!ctx) return
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      lines.forEach((line) => {
        line.update(dimensions.width, dimensions.height)
        line.draw(ctx)
      })

      silhouettes.forEach((silhouette) => {
        silhouette.update(dimensions.width, dimensions.height)
        silhouette.draw(ctx)
      })

      checkInteractions()

      emojis.forEach((emoji, index, array) => {
        emoji.update()
        emoji.draw(ctx)
        if (emoji.opacity <= 0) {
          array.splice(index, 1)
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
}

export default DynamicBackground

