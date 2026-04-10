"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"

interface SplashScreenProps {
  onComplete: () => void
  minimumDuration?: number
}

export function SplashScreen({ onComplete, minimumDuration = 3500 }: SplashScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // Three.js setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#030712')
    
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    // Create stars
    const starCount = 300
    const positions = new Float32Array(starCount * 3)
    const initialPositions = new Float32Array(starCount * 3)
    const targetPositions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)
    const colors = new Float32Array(starCount * 3)
    
    // Colors for stars: mix of white, cyan, and teal
    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#67e8f9'),
      new THREE.Color('#22d3ee'),
      new THREE.Color('#14b8a6'),
      new THREE.Color('#5eead4'),
    ]
    
    // Initial scattered positions and target sphere positions
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      
      // Random scattered positions (far away)
      const scatterRadius = 15 + Math.random() * 10
      const scatterTheta = Math.random() * Math.PI * 2
      const scatterPhi = Math.random() * Math.PI
      
      initialPositions[i3] = scatterRadius * Math.sin(scatterPhi) * Math.cos(scatterTheta)
      initialPositions[i3 + 1] = scatterRadius * Math.sin(scatterPhi) * Math.sin(scatterTheta)
      initialPositions[i3 + 2] = scatterRadius * Math.cos(scatterPhi)
      
      // Copy to current positions
      positions[i3] = initialPositions[i3]
      positions[i3 + 1] = initialPositions[i3 + 1]
      positions[i3 + 2] = initialPositions[i3 + 2]
      
      // Target positions on sphere surface (Fibonacci sphere distribution)
      const phi = Math.acos(1 - 2 * (i + 0.5) / starCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const sphereRadius = 3
      
      targetPositions[i3] = sphereRadius * Math.sin(phi) * Math.cos(theta)
      targetPositions[i3 + 1] = sphereRadius * Math.sin(phi) * Math.sin(theta)
      targetPositions[i3 + 2] = sphereRadius * Math.cos(phi)
      
      // Random sizes
      sizes[i] = Math.random() * 8 + 4
      
      // Random colors from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Custom shader material for glowing stars
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uPixelRatio;
        
        void main() {
          vColor = color;
          
          // Twinkling effect
          float twinkle = 0.7 + 0.3 * sin(uTime * 3.0 + position.x * 2.0 + position.y * 3.0);
          vAlpha = twinkle;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Create circular star with soft glow
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Core brightness
          float core = 1.0 - smoothstep(0.0, 0.15, dist);
          // Glow
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          
          float alpha = (core * 1.0 + glow * 0.6) * vAlpha;
          vec3 finalColor = vColor * (core + 0.5);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    const stars = new THREE.Points(geometry, material)
    scene.add(stars)

    camera.position.z = 12

    // Animation state
    let startTime = Date.now()
    const gatherDuration = 2000 // 2 seconds to gather
    let animationFrame: number

    // Animation loop
    const animate = () => {
      animationFrame = requestAnimationFrame(animate)
      
      const elapsed = Date.now() - startTime
      const positionArray = geometry.attributes.position.array as Float32Array
      
      if (elapsed < gatherDuration) {
        // Gathering phase - stars converge to sphere
        const progress = elapsed / gatherDuration
        // Ease out cubic for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3
          positionArray[i3] = initialPositions[i3] + (targetPositions[i3] - initialPositions[i3]) * easeProgress
          positionArray[i3 + 1] = initialPositions[i3 + 1] + (targetPositions[i3 + 1] - initialPositions[i3 + 1]) * easeProgress
          positionArray[i3 + 2] = initialPositions[i3 + 2] + (targetPositions[i3 + 2] - initialPositions[i3 + 2]) * easeProgress
        }
        geometry.attributes.position.needsUpdate = true
      } else {
        // Sphere formed - rotate
        stars.rotation.y += 0.015
        stars.rotation.x += 0.003
      }

      // Update time uniform for twinkling
      material.uniforms.uTime.value = elapsed * 0.001

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio()
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
      geometry.dispose()
      material.dispose()
    }
  }, [onComplete, minimumDuration])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Three.js container - only stars animation */}
          <div ref={containerRef} className="absolute inset-0" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
