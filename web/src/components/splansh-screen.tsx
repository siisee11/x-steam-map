"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function SplashScreen({ onAnimationComplete }: { onAnimationComplete: (completed: boolean) => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const overlayVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.2,
      transition: { 
        duration: 0.5,
        ease: "easeIn"
      }
    }
  }

  const handleAnimationComplete = () => {
    console.log("Splash screen animation completed")
    // You can add any additional logic here
    onAnimationComplete(true);
  }

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial="visible"
      animate={isVisible ? "visible" : "hidden"}
      variants={overlayVariants}
      transition={{ duration: 0.5 }}
      onAnimationComplete={handleAnimationComplete}
    >
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "exit"}
        variants={logoVariants}
      >
        <Image
          src="/cnn_logo.svg"
          alt="CNN Logo"
          width={300}
          height={150}
          priority
        />
      </motion.div>
    </motion.div>
  )
}
