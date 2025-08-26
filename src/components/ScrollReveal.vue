<template>
  <div ref="revealContainer" class="reveal-container" :class="{ 'revealed': isRevealed }">
    <slot></slot>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ScrollReveal',
  props: {
    threshold: {
      type: Number,
      default: 0.1
    },
    rootMargin: {
      type: String,
      default: '0px'
    },
    delay: {
      type: Number,
      default: 100
    },
    duration: {
      type: Number,
      default: 800
    },
    distance: {
      type: Number,
      default: 50
    },
    direction: {
      type: String,
      default: 'up',
      validator: (value) => ['up', 'down', 'left', 'right'].includes(value)
    },
    once: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    },
    rotate: {
      type: Number,
      default: 0
    },
    opacity: {
      type: Number,
      default: 0
    },
    easing: {
      type: String,
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      validator: (value) => [
        'ease',
        'ease-in',
        'ease-out',
        'ease-in-out',
        'linear',
        'cubic-bezier(0.4, 0, 0.2, 1)',
        'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bounce
        'cubic-bezier(0.68, -0.55, 0.265, 1.55)' // Spring
      ].includes(value)
    },
    blur: {
      type: Number,
      default: 2
    },
    hideDelay: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const revealContainer = ref(null)
    const isRevealed = ref(false)
    let observer = null
    let showTimer = null
    let hideTimer = null

    const clearTimers = () => {
      if (showTimer) {
        clearTimeout(showTimer)
        showTimer = null
      }
      if (hideTimer) {
        clearTimeout(hideTimer)
        hideTimer = null
      }
    }

    const checkVisibility = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Any intersection: keep revealed until fully out of view
          if (hideTimer) {
            clearTimeout(hideTimer)
            hideTimer = null
          }
          if (!isRevealed.value) {
            if (showTimer) clearTimeout(showTimer)
            showTimer = setTimeout(() => {
              isRevealed.value = true
              showTimer = null
            }, props.delay)
          }

          // If once is true, disconnect the observer after revealing
          if (props.once && observer) {
            observer.disconnect()
          }
        } else if (!props.once) {
          // No intersection (100% out of view): hide
          if (showTimer) {
            clearTimeout(showTimer)
            showTimer = null
          }
          if (hideTimer) clearTimeout(hideTimer)
          hideTimer = setTimeout(() => {
            isRevealed.value = false
            hideTimer = null
          }, props.hideDelay)
        }
      })
    }

    onMounted(() => {
      if (!revealContainer.value) return

      observer = new IntersectionObserver(checkVisibility, {
        root: null,
        rootMargin: props.rootMargin,
        // Trigger when becoming visible past the configured threshold and when fully out (0)
        threshold: [0, props.threshold]
      })

      observer.observe(revealContainer.value)
    })

    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
      clearTimers()
    })

    // Function for dynamic transform styles
    const getInitialTransform = () => {
      const distance = props.distance;
      const scale = props.scale !== 1 ? props.scale : 1;
      const rotate = props.rotate !== 0 ? props.rotate : 0;
      
      let transform = '';
      
      // Add translation based on direction
      switch (props.direction) {
        case 'up':
          transform += `translate3d(0, ${distance}px, 0) `;
          break;
        case 'down':
          transform += `translate3d(0, -${distance}px, 0) `;
          break;
        case 'left':
          transform += `translate3d(${distance}px, 0, 0) `;
          break;
        case 'right':
          transform += `translate3d(-${distance}px, 0, 0) `;
          break;
        default:
          transform += `translate3d(0, ${distance}px, 0) `;
      }
      
      // Add scale if different from 1
      if (scale !== 1) {
        transform += `scale(${scale}) `;
      }
      
      // Add rotation if not 0
      if (rotate !== 0) {
        transform += `rotate(${rotate}deg)`;
      }
      
      return transform.trim();
    };

    // Get CSS variables for dynamic styling
    const getCssVariables = () => {
      return {
        '--reveal-duration': `${props.duration}ms`,
        '--reveal-easing': props.easing,
        '--reveal-blur': `${props.blur}px`,
        '--reveal-opacity': props.opacity
      };
    };

    return {
      revealContainer,
      isRevealed,
      getInitialTransform,
      getCssVariables
    }
  }
}
</script>

<style scoped>
.reveal-container {
  opacity: var(--reveal-opacity, 0);
  will-change: transform, opacity, filter;
  transition-property: transform, opacity, filter;
  transition-timing-function: var(--reveal-easing, cubic-bezier(0.4, 0, 0.2, 1));
  transition-duration: var(--reveal-duration, 800ms);
  filter: blur(var(--reveal-blur, 2px));
  transform-origin: center;
  backface-visibility: hidden;
  perspective: 1000px;
  position: relative;
}

.reveal-container.revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1) rotate(0deg) !important;
  filter: blur(0);
}

/* Direction-specific transforms */
.reveal-container:not(.revealed) {
  transform: v-bind('getInitialTransform()');
}

/* Apply dynamic CSS variables */
.reveal-container {
  transition-property: transform, opacity, filter;
}
</style> 