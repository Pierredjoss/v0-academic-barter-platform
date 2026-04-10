"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

interface SplashScreenProps {
  onComplete: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 3000 }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create stars
    const starCount = 200
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    const starSizes = new Float32Array(starCount)
    const targetPositions = new Float32Array(starCount * 3)
    
    // Initial random positions (scattered)
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      // Random scattered positions
      starPositions[i3] = (Math.random() - 0.5) * 20
      starPositions[i3 + 1] = (Math.random() - 0.5) * 20
      starPositions[i3 + 2] = (Math.random() - 0.5) * 20
      starSizes[i] = Math.random() * 3 + 1
      
      // Target positions on sphere surface
      const phi = Math.acos(-1 + (2 * i) / starCount)
      const theta = Math.sqrt(starCount * Math.PI) * phi
      const radius = 2.5
      targetPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      targetPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      targetPositions[i3 + 2] = radius * Math.cos(phi)
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

    // Custom shader material for stars
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('#14b8a6') },
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vAlpha = 0.5 + 0.5 * sin(time * 3.0 + position.x * 2.0);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(color, alpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    camera.position.z = 8

    // Animation variables
    let animationPhase = 0 // 0: gathering, 1: rotating sphere
    let phaseStartTime = Date.now()
    const gatherDuration = 1500 // 1.5 seconds to gather
    const rotateDuration = 1000 // 1 second rotation
    let animationFrame: number

    // Animation loop
    const animate = () => {
      animationFrame = requestAnimationFrame(animate)
      
      const currentTime = Date.now()
      const elapsed = currentTime - phaseStartTime
      const positions = starGeometry.attributes.position.array as Float32Array

      if (animationPhase === 0) {
        // Gathering phase - stars move towards sphere positions
        const progress = Math.min(elapsed / gatherDuration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3) // ease out cubic
        
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3
          const startX = (Math.random() - 0.5) * 20 * (1 - easeProgress * 0.1)
          positions[i3] = positions[i3] + (targetPositions[i3] - positions[i3]) * 0.05
          positions[i3 + 1] = positions[i3 + 1] + (targetPositions[i3 + 1] - positions[i3 + 1]) * 0.05
          positions[i3 + 2] = positions[i3 + 2] + (targetPositions[i3 + 2] - positions[i3 + 2]) * 0.05
        }
        starGeometry.attributes.position.needsUpdate = true
        
        if (progress >= 1) {
          animationPhase = 1
          phaseStartTime = currentTime
        }
      } else if (animationPhase === 1) {
        // Rotating sphere phase
        stars.rotation.y += 0.02
        stars.rotation.x += 0.005
      }

      // Update shader time uniform
      starMaterial.uniforms.time.value = currentTime * 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Exit timer
    const exitTimer = setTimeout(() => {
      setIsExiting(true)
    }, minimumDuration - 500)

    const completeTimer = setTimeout(() => {
      onComplete()
    }, minimumDuration)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrame)
      clearTimeout(exitTimer)
      clearTimeout(completeTimer)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      starGeometry.dispose()
      starMaterial.dispose()
    }
  }, [onComplete, minimumDuration])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background overflow-hidden"
        >
          {/* Three.js container */}
          <div ref={containerRef} className="absolute inset-0" />
          
          {/* Logo overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
              <span className="text-4xl font-bold text-primary-foreground">ɖ</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="flex flex-col items-center gap-1"
            >
              <h1 className="text-3xl font-bold tracking-tight gradient-text">ɖyɔ̌</h1>
              <p className="text-sm text-muted-foreground">Plateforme de Troc Académique</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
