<template>
  <div class="fireworks-container" v-if="show">
    <canvas ref="fireworksCanvas" class="fireworks-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '../stores/theme'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const themeStore = useThemeStore()
const fireworksCanvas = ref<HTMLCanvasElement | null>(null)
let animationFrameId: number | null = null
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let fireworks: Firework[] = []
let timerRef: ReturnType<typeof setTimeout> | null = null
let hue = 120

// Particle class
class Particle {
  x: number
  y: number
  speed: number
  velocity: { x: number; y: number }
  size: number
  alpha: number
  shrink: number
  hue: number
  brightness: number

  constructor(x: number, y: number, hue: number) {
    this.x = x
    this.y = y
    this.speed = 2 + Math.random() * 3
    
    // Set velocity based on random direction
    const angle = Math.random() * Math.PI * 2
    this.velocity = {
      x: Math.cos(angle) * this.speed,
      y: Math.sin(angle) * this.speed
    }
    
    this.size = 1 + Math.random() * 2
    this.alpha = 1
    this.shrink = 0.96
    this.hue = hue + Math.random() * 50 - 25
    this.brightness = 50 + Math.random() * 30
  }

  update() {
    // Apply velocity to position
    this.x += this.velocity.x
    this.y += this.velocity.y
    
    // Add gravity
    this.velocity.y += 0.05
    
    // Shrink and fade
    this.size *= this.shrink
    this.alpha -= 0.01
    
    return this.alpha > 0.05 && this.size > 0.3
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.alpha
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    
    ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// Firework class
class Firework {
  x: number
  y: number
  startX: number
  startY: number
  targetX: number
  targetY: number
  distanceToTarget: number
  traveled: number
  angle: number
  speed: number
  acceleration: number
  brightness: number
  hue: number
  
  constructor(startX: number, startY: number, targetX: number, targetY: number, hue: number) {
    this.x = startX
    this.y = startY
    this.startX = startX
    this.startY = startY
    this.targetX = targetX
    this.targetY = targetY
    
    this.distanceToTarget = Math.sqrt(
      Math.pow(targetX - startX, 2) + Math.pow(targetY - startY, 2)
    )
    this.traveled = 0
    
    this.angle = Math.atan2(targetY - startY, targetX - startX)
    this.speed = 5
    this.acceleration = 1.05
    this.brightness = 50 + Math.random() * 30
    this.hue = hue
  }

  update() {
    // Calculate distance traveled
    this.traveled = Math.sqrt(
      Math.pow(this.x - this.startX, 2) + Math.pow(this.y - this.startY, 2)
    )
    
    // Check if firework reached target
    if (this.traveled >= this.distanceToTarget) {
      return false
    }
    
    // Move towards target
    this.x += Math.cos(this.angle) * this.speed
    this.y += Math.sin(this.angle) * this.speed
    
    // Accelerate
    this.speed *= this.acceleration
    
    return true
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.closePath()
    
    ctx.fillStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`
    ctx.fill()
  }

  explode() {
    const particleCount = 50 + Math.round(Math.random() * 30)
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(this.x, this.y, this.hue))
    }
  }
}

const initCanvas = () => {
  if (!fireworksCanvas.value) return
  
  const canvas = fireworksCanvas.value
  const { width, height } = canvas.getBoundingClientRect()
  
  // Set canvas width and height
  canvas.width = width
  canvas.height = height
  
  ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Set composite operation
  ctx.globalCompositeOperation = 'source-over'
}

const resizeCanvas = () => {
  if (!fireworksCanvas.value) return
  
  const canvas = fireworksCanvas.value
  const { width, height } = canvas.getBoundingClientRect()
  
  canvas.width = width
  canvas.height = height
}

const animate = () => {
  if (!ctx || !fireworksCanvas.value) return
  
  // Clear canvas with semi-transparent background
  ctx.fillStyle = themeStore.isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
  ctx.fillRect(0, 0, fireworksCanvas.value.width, fireworksCanvas.value.height)
  
  // Update and draw particles
  particles = particles.filter(particle => {
    if (particle.update()) {
      particle.draw(ctx!)
      return true
    }
    return false
  })
  
  // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--) {
    if (fireworks[i].update()) {
      fireworks[i].draw(ctx!)
    } else {
      fireworks[i].explode()
      fireworks.splice(i, 1)
    }
  }
  
  // Create random fireworks
  if (Math.random() < 0.05) {
    createFirework()
  }
  
  hue += 0.5
  
  animationFrameId = requestAnimationFrame(animate)
}

const createFirework = () => {
  if (!fireworksCanvas.value) return
  
  const canvas = fireworksCanvas.value
  const startX = Math.random() * canvas.width
  const startY = canvas.height
  const targetX = Math.random() * canvas.width
  const targetY = Math.random() * (canvas.height * 0.6)
  
  fireworks.push(new Firework(startX, startY, targetX, targetY, hue))
}

const startFireworks = () => {
  if (!fireworksCanvas.value) return
  
  initCanvas()
  
  for (let i = 0; i < 3; i++) {
    createFirework()
  }
  
  animate()
  
  if (props.duration > 0) {
    timerRef = setTimeout(() => {
      stopFireworks()
    }, props.duration)
  }
}

const stopFireworks = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null;
  }
  
  if (timerRef) {
    clearTimeout(timerRef)
    timerRef = null;
  }
  
  particles = [];
  fireworks = [];
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    startFireworks()
  } else {
    stopFireworks()
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  if (props.show) {
    startFireworks()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  stopFireworks()
})
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
}

.fireworks-canvas {
  width: 100%;
  height: 100%;
}
</style> 