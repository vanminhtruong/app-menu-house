<template>
  <Transition name="background-fade">
    <div v-if="isVisible" class="animated-background">
    <!-- Sky Background - LA City Sky -->
    <div :class="[
      'absolute inset-0',
      isTransitioning ? 'transition-colors duration-500' : 'transition-colors duration-1000',
      isDarkMode
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black'
        : 'bg-gradient-to-b from-blue-500 via-blue-300 to-orange-200'
    ]"></div>

    <!-- Sun/Moon -->
    <div :class="[
      'absolute w-20 h-20 rounded-full',
      isTransitioning ? 'transition-all duration-300' : 'transition-all duration-1000',
      isDarkMode
        ? 'bg-gray-100 shadow-2xl shadow-gray-100/30 top-20 right-20'
        : 'bg-yellow-300 shadow-2xl shadow-yellow-300/80 top-12 right-12',
      !isTransitioning && !isDarkMode ? 'animate-pulse' : ''
    ]">
      <!-- Sun rays for day mode -->
      <div v-if="!isDarkMode && !isTransitioning" class="absolute inset-0">
        <div
          v-for="ray in 8"
          :key="`ray-${ray}`"
          class="absolute w-1 h-8 bg-yellow-200 rounded-full animate-spin"
          :style="{
            top: '-16px',
            left: '50%',
            transformOrigin: '50% 56px',
            transform: `translateX(-50%) rotate(${ray * 45}deg)`,
            animationDuration: '8s'
          }"
        ></div>
      </div>
    </div>

    <!-- Stars for night sky -->
    <div v-if="isDarkMode && !isTransitioning" class="absolute inset-0">
      <div
        v-for="star in stars"
        :key="`star-${star.id}`"
        :class="[
          'absolute w-1 h-1 bg-white rounded-full animate-pulse',
          star.brightness === 'bright' ? 'opacity-100' : 'opacity-60'
        ]"
        :style="{
          top: star.y + '%',
          left: star.x + '%',
          animationDelay: star.delay + 's',
          animationDuration: star.duration + 's'
        }"
      ></div>
    </div>

    <!-- Clouds -->
    <div v-if="!isTransitioning" class="absolute inset-0 overflow-hidden">
      <div
        v-for="(cloud, index) in clouds"
        :key="`cloud-${index}`"
        :class="[
          'absolute rounded-full opacity-80 animate-float-cloud transition-colors duration-500',
          isDarkMode ? 'bg-gray-600' : 'bg-white'
        ]"
        :style="{
          width: cloud.size + 'px',
          height: cloud.size * 0.6 + 'px',
          top: cloud.y + '%',
          left: cloud.x + '%',
          animationDelay: cloud.delay + 's',
          animationDuration: cloud.duration + 's'
        }"
      >
        <!-- Cloud parts for more realistic shape -->
        <div 
          :class="[
            'absolute rounded-full',
            isDarkMode ? 'bg-gray-600' : 'bg-white'
          ]"
          :style="{
            width: cloud.size * 0.7 + 'px',
            height: cloud.size * 0.7 + 'px',
            top: '-20%',
            left: '10%'
          }"
        ></div>
        <div 
          :class="[
            'absolute rounded-full',
            isDarkMode ? 'bg-gray-600' : 'bg-white'
          ]"
          :style="{
            width: cloud.size * 0.5 + 'px',
            height: cloud.size * 0.5 + 'px',
            top: '-10%',
            right: '15%'
          }"
        ></div>
      </div>
    </div>

    <!-- Hollywood Hills - Full width -->
    <div class="absolute bottom-16 left-0 right-0 h-1/2 w-screen overflow-hidden">
      <svg viewBox="0 0 1200 300" class="w-full h-full" preserveAspectRatio="none">
        <!-- Far mountains - Extended width -->
        <path
          :fill="isDarkMode ? '#1f2937' : '#a3a3a3'"
          d="M-100,300 L-100,150 Q100,120 300,140 Q500,100 700,130 Q900,90 1100,120 Q1300,100 1500,130 L1500,300 Z"
          opacity="0.4"
        />
        <!-- Middle hills - Extended width -->
        <path
          :fill="isDarkMode ? '#374151' : '#737373'"
          d="M-100,300 L-100,180 Q100,150 300,170 Q500,140 700,160 Q900,130 1100,150 Q1300,140 1500,160 L1500,300 Z"
          opacity="0.6"
        />
        <!-- Near hills - Extended width -->
        <path
          :fill="isDarkMode ? '#4b5563' : '#525252'"
          d="M-100,300 L-100,220 Q100,200 300,210 Q500,190 700,200 Q900,180 1100,190 Q1300,200 1500,210 L1500,300 Z"
          opacity="0.8"
        />

        <!-- Vegetation on hills for day mode -->
        <g v-if="!isDarkMode">
          <!-- Small trees/bushes scattered on hills -->
          <circle cx="200" cy="180" r="3" fill="#22c55e" opacity="0.7"/>
          <circle cx="250" cy="190" r="2" fill="#16a34a" opacity="0.8"/>
          <circle cx="300" cy="175" r="4" fill="#22c55e" opacity="0.6"/>
          <circle cx="400" cy="185" r="3" fill="#16a34a" opacity="0.7"/>
          <circle cx="500" cy="170" r="2" fill="#22c55e" opacity="0.8"/>
          <circle cx="600" cy="195" r="3" fill="#16a34a" opacity="0.6"/>
          <circle cx="700" cy="180" r="4" fill="#22c55e" opacity="0.7"/>
          <circle cx="800" cy="175" r="2" fill="#16a34a" opacity="0.8"/>
          <circle cx="900" cy="190" r="3" fill="#22c55e" opacity="0.6"/>
          <circle cx="1000" cy="185" r="3" fill="#16a34a" opacity="0.7"/>
        </g>
      </svg>

      <!-- Hollywood Sign - Repositioned and larger -->
      <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2">
        <div class="flex gap-1">
          <div
            v-for="(letter, index) in ['H','O','L','L','Y','W','O','O','D']"
            :key="`letter-${index}`"
            :class="[
              'relative font-bold text-sm px-1 py-1.5',
              isDarkMode
                ? 'text-white bg-white/10 border border-white/20 shadow-lg'
                : 'text-gray-800 bg-white border border-gray-300 shadow-md'
            ]"
            :style="{
              transform: `perspective(100px) rotateY(${(index - 4) * 2}deg)`
            }"
          >
            {{ letter }}
            <!-- Letter support structure -->
            <div :class="[
              'absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-3',
              isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
            ]"></div>
          </div>
        </div>

        <!-- Sign base/foundation -->
        <div :class="[
          'absolute -bottom-6 left-0 right-0 h-2',
          isDarkMode ? 'bg-gray-600' : 'bg-gray-500'
        ]"></div>
      </div>

      <!-- Second Hollywood Sign (smaller, in distance) -->
      <div class="absolute bottom-24 left-3/4 transform -translate-x-1/2 scale-75 opacity-80">
        <div class="flex gap-0.5">
          <div
            v-for="(letter, index) in ['H','O','L','L','Y','W','O','O','D']"
            :key="`letter2-${index}`"
            :class="[
              'relative font-bold text-xs px-0.5 py-1',
              isDarkMode
                ? 'text-white bg-white/10 border border-white/20 shadow-lg'
                : 'text-gray-800 bg-white border border-gray-300 shadow-md'
            ]"
            :style="{
              transform: `perspective(100px) rotateY(${(index - 4) * 2}deg)`
            }"
          >
            {{ letter }}
            <!-- Letter support structure -->
            <div :class="[
              'absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0.5 h-2',
              isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
            ]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Los Angeles Skyline -->
    <div class="absolute bottom-16 left-0 right-0 h-2/3">
      <!-- Background buildings (far) -->
      <div class="absolute bottom-0 left-0 right-0 h-full">
        <div
          v-for="(building, index) in backgroundBuildings"
          :key="`bg-building-${index}`"
          :class="[
            'absolute bottom-0',
            isTransitioning ? 'transition-colors duration-300' : 'transition-colors duration-1000',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-400'
          ]"
          :style="{
            left: building.x + '%',
            width: building.width + 'px',
            height: building.height + 'px',
            opacity: 0.6
          }"
        >
          <!-- Building windows -->
          <div
            v-for="floor in Math.floor(building.height / 15)"
            :key="`bg-floor-${floor}`"
            class="absolute left-1 right-1 h-2 flex gap-1"
            :style="{ bottom: (floor * 15) + 'px' }"
          >
            <div
              v-for="window in Math.floor(building.width / 8)"
              :key="`bg-window-${window}`"
              :class="[
                'flex-1 h-full',
                isDarkMode
                  ? (Math.random() > 0.7 ? 'bg-yellow-300' : 'bg-gray-800')
                  : (Math.random() > 0.5 ? 'bg-blue-100' : 'bg-gray-200')
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main buildings (middle) -->
      <div class="absolute bottom-0 left-0 right-0 h-full">
        <div
          v-for="(building, index) in mainBuildings"
          :key="`main-building-${index}`"
          :class="[
            'absolute bottom-0',
            isTransitioning ? 'transition-colors duration-300' : 'transition-colors duration-1000',
            isDarkMode ? 'bg-gray-600' : 'bg-gray-500'
          ]"
          :style="{
            left: building.x + '%',
            width: building.width + 'px',
            height: building.height + 'px'
          }"
        >
          <!-- Building windows -->
          <div
            v-for="floor in Math.floor(building.height / 20)"
            :key="`main-floor-${floor}`"
            class="absolute left-2 right-2 h-3 flex gap-1"
            :style="{ bottom: (floor * 20) + 'px' }"
          >
            <div
              v-for="window in Math.floor(building.width / 12)"
              :key="`main-window-${window}`"
              :class="[
                'flex-1 h-full',
                isDarkMode
                  ? (Math.random() > 0.6 ? 'bg-yellow-200' : 'bg-gray-800')
                  : (Math.random() > 0.5 ? 'bg-yellow-100' : 'bg-gray-300')
              ]"
            ></div>
          </div>

          <!-- Building antenna/spire -->
          <div
            v-if="building.hasAntenna"
            :class="[
              'absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8',
              isDarkMode ? 'bg-red-500' : 'bg-gray-600'
            ]"
          >
            <!-- Blinking light -->
            <div :class="[
              'absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full animate-pulse',
              isDarkMode ? 'bg-red-500' : 'bg-red-400'
            ]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Foreground buildings (close) -->
    <div class="absolute bottom-16 left-0 right-0 h-1/2 overflow-hidden z-2">
      <div
        v-for="(building, index) in foregroundBuildings"
        :key="`fg-building-${index}`"
        :class="[
          'absolute bottom-0',
          isTransitioning ? 'transition-colors duration-300' : 'transition-colors duration-1000',
          isDarkMode ? 'bg-gray-800' : 'bg-gray-700'
        ]"
        :style="{
          left: building.x + '%',
          width: building.width + 'px',
          height: building.height + 'px'
        }"
      >
        <!-- Building windows -->
        <div
          v-for="floor in Math.floor(building.height / 25)"
          :key="`fg-floor-${floor}`"
          class="absolute left-3 right-3 h-4 flex gap-2"
          :style="{ bottom: (floor * 25) + 'px' }"
        >
          <div
            v-for="window in Math.floor(building.width / 15)"
            :key="`fg-window-${window}`"
            :class="[
              'flex-1 h-full',
              isDarkMode
                ? (Math.random() > 0.5 ? 'bg-yellow-100' : 'bg-gray-900')
                : (Math.random() > 0.5 ? 'bg-yellow-200' : 'bg-gray-400')
            ]"
          ></div>
        </div>

        <!-- Building rooftop details -->
        <div
          v-if="building.hasRooftop"
          :class="[
            'absolute -top-4 left-2 right-2 h-4',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-500'
          ]"
        >
          <!-- Air conditioning units -->
          <div :class="[
            'absolute top-1 left-2 w-3 h-2',
            isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
          ]"></div>
          <div :class="[
            'absolute top-1 right-2 w-3 h-2',
            isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
          ]"></div>
        </div>
      </div>
    </div>

    <!-- LA Palm Trees -->
    <div class="absolute bottom-16 left-0 right-0 h-3/4 overflow-hidden z-3">
      <div
        v-for="(palm, index) in palmTrees"
        :key="`palm-${index}`"
        class="absolute bottom-0 animate-sway"
        :style="{
          left: palm.x + '%',
          animationDelay: palm.delay + 's',
          animationDuration: palm.duration + 's'
        }"
      >
        <!-- Palm trunk -->
        <div
          :class="[
            'absolute bottom-0 rounded-t-lg',
            isDarkMode ? 'bg-amber-800' : 'bg-amber-600'
          ]"
          :style="{
            width: palm.trunkWidth + 'px',
            height: palm.trunkHeight + 'px',
            left: '50%',
            transform: 'translateX(-50%)'
          }"
        >
          <!-- Trunk texture lines -->
          <div
            v-for="line in Math.floor(palm.trunkHeight / 8)"
            :key="`trunk-line-${line}`"
            :class="[
              'absolute left-0 right-0 h-0.5',
              isDarkMode ? 'bg-amber-900' : 'bg-amber-700'
            ]"
            :style="{ bottom: (line * 8) + 'px' }"
          ></div>
        </div>

        <!-- Palm fronds (leaves) -->
        <div
          class="absolute"
          :style="{
            bottom: palm.trunkHeight + 'px',
            left: '50%',
            transform: 'translateX(-50%)'
          }"
        >
          <!-- Multiple fronds in different directions -->
          <div
            v-for="frond in 8"
            :key="`frond-${frond}`"
            :class="[
              'absolute w-12 h-2 rounded-full origin-left',
              isDarkMode ? 'bg-green-700' : 'bg-green-500'
            ]"
            :style="{
              transform: `rotate(${(frond * 45) - 180}deg)`,
              transformOrigin: 'left center'
            }"
          >
            <!-- Frond segments for realistic look -->
            <div
              v-for="segment in 3"
              :key="`segment-${segment}`"
              :class="[
                'absolute h-full rounded-full',
                isDarkMode ? 'bg-green-800' : 'bg-green-600'
              ]"
              :style="{
                left: (segment * 3) + 'px',
                width: (4 - segment) + 'px'
              }"
            ></div>
          </div>
        </div>

        <!-- Coconuts (optional) -->
        <div
          v-if="palm.hasCoconuts"
          class="absolute"
          :style="{
            bottom: (palm.trunkHeight - 5) + 'px',
            left: '50%',
            transform: 'translateX(-50%)'
          }"
        >
          <div
            v-for="coconut in 2"
            :key="`coconut-${coconut}`"
            :class="[
              'absolute w-2 h-3 rounded-full',
              isDarkMode ? 'bg-amber-600' : 'bg-amber-500'
            ]"
            :style="{
              left: (coconut * 3 - 3) + 'px',
              top: (coconut * 2) + 'px'
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- City Street -->
    <div class="absolute bottom-0 left-0 right-0 h-16 z-5">
      <div :class="[
        'w-full h-full relative',
        isDarkMode ? 'bg-gray-900' : 'bg-gray-700'
      ]">
        <!-- Road markings -->
        <div class="absolute top-1/2 left-0 right-0 h-1 flex justify-center">
          <div
            v-for="i in 20"
            :key="`road-mark-${i}`"
            :class="[
              'h-full mx-8 animate-road-marking',
              isDarkMode ? 'bg-yellow-400' : 'bg-yellow-300'
            ]"
            :style="{
              width: '40px',
              animationDelay: (i * 0.1) + 's'
            }"
          ></div>
        </div>

        <!-- Sidewalk -->
        <div :class="[
          'absolute bottom-0 left-0 right-0 h-3',
          isDarkMode ? 'bg-gray-700' : 'bg-gray-400'
        ]">
          <!-- Small vegetation on sidewalk -->
          <div
            v-for="i in 15"
            :key="`vegetation-${i}`"
            class="absolute bottom-3"
            :style="{ left: ((i * 7) - 5) + '%' }"
          >
            <!-- Small plants/grass -->
            <div
              v-for="plant in 3"
              :key="`plant-${plant}`"
              :class="[
                'absolute bottom-0 w-0.5 rounded-t-full',
                isDarkMode ? 'bg-green-800' : 'bg-green-600'
              ]"
              :style="{
                height: (plant * 2) + 'px',
                left: (plant * 1 - 1) + 'px'
              }"
            ></div>
          </div>
        </div>

        <!-- Street lights -->
        <div
          v-for="i in 5"
          :key="`street-light-${i}`"
          class="absolute bottom-3"
          :style="{ left: ((i * 20) - 10) + '%' }"
        >
          <!-- Light pole -->
          <div :class="[
            'absolute bottom-0 w-1 h-10',
            isDarkMode ? 'bg-gray-600' : 'bg-gray-500'
          ]"></div>
          <!-- Light fixture -->
          <div :class="[
            'absolute bottom-10 -left-1 w-3 h-2',
            isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
          ]">
            <!-- Light glow -->
            <div :class="[
              'absolute -bottom-1 left-1 w-1 h-1 rounded-full',
              isDarkMode ? 'bg-yellow-300 shadow-lg shadow-yellow-300/50' : 'bg-yellow-200'
            ]"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Car -->
    <div v-if="!isTransitioning" class="absolute bottom-16 animate-drive-car z-10">
      <div class="relative">
        <!-- Car shadow -->
        <div :class="[
          'absolute top-8 left-1 w-18 h-2 rounded-full opacity-40 blur-sm',
          isDarkMode ? 'bg-black' : 'bg-gray-600'
        ]"></div>

        <!-- Car body -->
        <div :class="[
          'w-20 h-8 rounded-lg relative border-2 transition-all duration-300 z-10',
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-400 to-blue-600 border-cyan-300 shadow-2xl shadow-cyan-400/40'
            : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400 shadow-lg shadow-red-500/20'
        ]">
          <!-- Car roof -->
          <div :class="[
            'absolute top-0 left-3 right-3 h-3 rounded-t-lg',
            isDarkMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-700'
              : 'bg-gradient-to-r from-red-600 to-red-700'
          ]"></div>

          <!-- Car windows -->
          <div :class="[
            'absolute top-1 left-2 right-2 h-4 rounded border',
            isDarkMode
              ? 'bg-gradient-to-b from-white to-gray-200 border-gray-300'
              : 'bg-gradient-to-b from-blue-100 to-blue-300 border-blue-200'
          ]">
            <!-- Window divider -->
            <div :class="[
              'absolute top-0 bottom-0 left-1/2 w-0.5 transform -translate-x-1/2',
              isDarkMode ? 'bg-gray-400' : 'bg-blue-300'
            ]"></div>
          </div>

          <!-- Car headlights -->
          <div :class="[
            'absolute top-2 -right-1 w-2 h-2 rounded-full',
            isDarkMode
              ? 'bg-yellow-200 shadow-2xl shadow-yellow-200/80 border border-yellow-100'
              : 'bg-yellow-200 shadow-md shadow-yellow-200/50'
          ]"></div>
          <div :class="[
            'absolute bottom-2 -right-1 w-2 h-2 rounded-full',
            isDarkMode
              ? 'bg-yellow-200 shadow-2xl shadow-yellow-200/80 border border-yellow-100'
              : 'bg-yellow-200 shadow-md shadow-yellow-200/50'
          ]"></div>

          <!-- Car door handles -->
          <div :class="[
            'absolute top-3 left-1 w-1 h-2 rounded-full',
            isDarkMode ? 'bg-white' : 'bg-gray-100'
          ]"></div>
          <div :class="[
            'absolute top-3 right-1 w-1 h-2 rounded-full',
            isDarkMode ? 'bg-white' : 'bg-gray-100'
          ]"></div>

          <!-- Car wheels -->
          <div :class="[
            'absolute -bottom-2 left-2 w-4 h-4 rounded-full animate-spin-wheel border-2',
            isDarkMode
              ? 'bg-gray-900 border-gray-500 shadow-xl shadow-gray-900/50'
              : 'bg-gray-900 border-gray-700 shadow-md'
          ]">
            <!-- Wheel rim -->
            <div :class="[
              'absolute inset-1 rounded-full border',
              isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-700 border-gray-600'
            ]"></div>
          </div>
          <div :class="[
            'absolute -bottom-2 right-2 w-4 h-4 rounded-full animate-spin-wheel border-2',
            isDarkMode
              ? 'bg-gray-900 border-gray-500 shadow-xl shadow-gray-900/50'
              : 'bg-gray-900 border-gray-700 shadow-md'
          ]">
            <!-- Wheel rim -->
            <div :class="[
              'absolute inset-1 rounded-full border',
              isDarkMode ? 'bg-gray-700 border-gray-500' : 'bg-gray-700 border-gray-600'
            ]"></div>
          </div>

          <!-- Car glow effect for dark mode -->
          <div v-if="isDarkMode" :class="[
            'absolute inset-0 rounded-lg opacity-20 blur-sm',
            'bg-gradient-to-r from-cyan-400 to-blue-600'
          ]"></div>
        </div>
      </div>
    </div>

    <!-- Aircraft (Planes/Helicopters) -->
    <div v-if="!isTransitioning" class="absolute inset-0 overflow-hidden">
      <div
        v-for="(aircraft, index) in birds"
        :key="`aircraft-${index}`"
        class="absolute animate-fly-bird"
        :style="{
          top: aircraft.y + '%',
          left: aircraft.x + '%',
          animationDelay: aircraft.delay + 's',
          animationDuration: aircraft.duration + 's'
        }"
      >
        <!-- Aircraft body -->
        <div :class="[
          'w-4 h-1 rounded-full',
          isDarkMode ? 'bg-gray-300' : 'bg-gray-600'
        ]"></div>
        <!-- Aircraft wings -->
        <div :class="[
          'absolute top-0 left-1 w-2 h-0.5',
          isDarkMode ? 'bg-gray-400' : 'bg-gray-500'
        ]"></div>
        <!-- Blinking lights -->
        <div :class="[
          'absolute top-0 left-0 w-1 h-1 rounded-full animate-pulse',
          'bg-red-500'
        ]"></div>
        <div :class="[
          'absolute top-0 right-0 w-1 h-1 rounded-full animate-pulse',
          'bg-green-500'
        ]" :style="{ animationDelay: '0.5s' }"></div>
      </div>
    </div>
  </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, withDefaults } from 'vue'

interface Props {
  isDarkMode: boolean
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isVisible: true
})

// Debug: Log khi isVisible thay đổi
watch(() => props.isVisible, (newValue) => {
  console.log('AnimatedBackground - isVisible changed:', newValue)
}, { immediate: true })

// Debounced theme change to prevent lag
const isTransitioning = ref(false)
let themeChangeTimeout: number | null = null

watch(() => props.isDarkMode, (newValue) => {
  console.log('AnimatedBackground - isDarkMode changed:', newValue)

  // Set transitioning state to reduce animations during theme change
  isTransitioning.value = true

  // Clear existing timeout
  if (themeChangeTimeout) {
    clearTimeout(themeChangeTimeout)
  }

  // Reset transitioning state after theme change completes
  themeChangeTimeout = setTimeout(() => {
    isTransitioning.value = false
  }, 1000) // Match the transition duration
}, { immediate: true })

// Stars data for night sky - reduced for better performance
const stars = ref(Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 50,
  brightness: Math.random() > 0.7 ? 'bright' : 'dim',
  delay: Math.random() * 3,
  duration: 1 + Math.random() * 2
})))

// Cloud data - fewer clouds for city sky
const clouds = ref([
  { x: 20, y: 15, size: 60, delay: 0, duration: 30 },
  { x: 60, y: 10, size: 80, delay: 5, duration: 35 },
  { x: 85, y: 20, size: 50, delay: 10, duration: 25 }
])

// Building data for LA skyline
const backgroundBuildings = ref([
  { x: 5, width: 40, height: 120 },
  { x: 15, width: 35, height: 100 },
  { x: 25, width: 45, height: 140 },
  { x: 35, width: 30, height: 90 },
  { x: 45, width: 50, height: 160 },
  { x: 55, width: 25, height: 80 },
  { x: 65, width: 40, height: 110 },
  { x: 75, width: 35, height: 130 },
  { x: 85, width: 30, height: 95 },
  { x: 92, width: 25, height: 85 }
])

const mainBuildings = ref([
  { x: 8, width: 60, height: 200, hasAntenna: true },
  { x: 20, width: 55, height: 180, hasAntenna: false },
  { x: 32, width: 70, height: 250, hasAntenna: true },
  { x: 45, width: 50, height: 170, hasAntenna: false },
  { x: 58, width: 65, height: 220, hasAntenna: true },
  { x: 70, width: 45, height: 160, hasAntenna: false },
  { x: 80, width: 55, height: 190, hasAntenna: true },
  { x: 90, width: 40, height: 150, hasAntenna: false }
])

const foregroundBuildings = ref([
  { x: 10, width: 80, height: 120, hasRooftop: true },
  { x: 25, width: 70, height: 100, hasRooftop: false },
  { x: 40, width: 90, height: 140, hasRooftop: true },
  { x: 60, width: 75, height: 110, hasRooftop: true },
  { x: 78, width: 85, height: 130, hasRooftop: false },
  { x: 92, width: 60, height: 95, hasRooftop: true }
])

// LA Palm Trees data
const palmTrees = ref([
  { x: 5, trunkWidth: 6, trunkHeight: 60, delay: 0, duration: 8, hasCoconuts: true },
  { x: 15, trunkWidth: 5, trunkHeight: 50, delay: 1, duration: 7, hasCoconuts: false },
  { x: 30, trunkWidth: 7, trunkHeight: 70, delay: 2, duration: 9, hasCoconuts: true },
  { x: 45, trunkWidth: 5, trunkHeight: 55, delay: 3, duration: 8, hasCoconuts: false },
  { x: 65, trunkWidth: 6, trunkHeight: 65, delay: 4, duration: 7, hasCoconuts: true },
  { x: 80, trunkWidth: 7, trunkHeight: 75, delay: 5, duration: 9, hasCoconuts: false },
  { x: 95, trunkWidth: 5, trunkHeight: 60, delay: 6, duration: 8, hasCoconuts: true }
])

// Bird data - helicopters and planes for city
const birds = ref([
  { x: 30, y: 20, delay: 0, duration: 25 },
  { x: 70, y: 15, delay: 8, duration: 30 }
])

onMounted(() => {
  // Add some randomness to animations
  clouds.value.forEach(cloud => {
    cloud.delay += Math.random() * 2
  })

  birds.value.forEach(bird => {
    bird.delay += Math.random() * 5
  })
})
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  /* Performance optimizations */
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

@keyframes float-cloud {
  0% { transform: translate3d(-100px, 0, 0); }
  100% { transform: translate3d(calc(100vw + 100px), 0, 0); }
}

@keyframes sway {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(2deg); }
}

@keyframes drive-car {
  0% { transform: translate3d(-100px, 0, 0); }
  100% { transform: translate3d(calc(100vw + 100px), 0, 0); }
}

@keyframes spin-wheel {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes road-marking {
  0% { transform: translateX(-100px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(100px); opacity: 0; }
}

@keyframes fly-bird {
  0% { transform: translate3d(-50px, 0px, 0); }
  25% { transform: translate3d(25vw, -10px, 0); }
  50% { transform: translate3d(50vw, 5px, 0); }
  75% { transform: translate3d(75vw, -5px, 0); }
  100% { transform: translate3d(calc(100vw + 50px), 0px, 0); }
}

.animate-float-cloud {
  animation: float-cloud linear infinite;
}

.animate-sway {
  animation: sway ease-in-out infinite;
}

.animate-drive-car {
  animation: drive-car 15s linear infinite;
}

.animate-spin-wheel {
  animation: spin-wheel 0.5s linear infinite;
}

.animate-road-marking {
  animation: road-marking 2s linear infinite;
}

.animate-fly-bird {
  animation: fly-bird linear infinite;
}

/* Background fade transition */
.background-fade-enter-active,
.background-fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.background-fade-enter-from,
.background-fade-leave-to {
  opacity: 0;
}
</style>
