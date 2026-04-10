"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles, Grid3X3, HelpCircle, MessageSquare, LogIn, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DyoLogo } from "@/components/dyo-logo"

const navLinks = [
  { href: "#features", label: "Fonctionnalités", icon: Sparkles },
  { href: "#categories", label: "Catégories", icon: Grid3X3 },
  { href: "#how-it-works", label: "Comment ça marche", icon: HelpCircle },
  { href: "#testimonials", label: "Témoignages", icon: MessageSquare },
]

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-3 mt-3 sm:mx-4 sm:mt-4"
      >
        <nav 
          className={`
            mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-6 sm:py-4
            transition-all duration-300 ease-out
            ${scrolled 
              ? "glass-premium shadow-lg shadow-primary/5" 
              : "glass-premium"
            }
          `}
        >
          <Link href="/" className="z-10 flex items-center gap-2">
            <DyoLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground"
              >
                <link.icon className="h-4 w-4 text-primary/60 transition-colors group-hover:text-primary" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            <Button 
              variant="ghost" 
              asChild 
              className="gap-2 rounded-xl px-4 hover:bg-primary/5"
            >
              <Link href="/auth/login">
                <LogIn className="h-4 w-4" />
                <span>Connexion</span>
              </Link>
            </Button>
            <Button 
              asChild 
              className="btn-glow gap-2 rounded-xl px-5 shadow-lg shadow-primary/20"
            >
              <Link href="/auth/sign-up">
                <Rocket className="h-4 w-4" />
                <span>Commencer</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-premium mx-3 mt-2 overflow-hidden rounded-2xl shadow-xl shadow-primary/5 sm:mx-4 lg:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground active:scale-[0.98]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon className="h-5 w-5 text-primary/70" />
                  <span>{link.label}</span>
                </motion.a>
              ))}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-4"
              >
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full justify-center gap-2 rounded-xl py-5"
                >
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4" />
                    <span>Connexion</span>
                  </Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center gap-2 rounded-xl py-5 shadow-lg shadow-primary/20"
                >
                  <Link href="/auth/sign-up">
                    <Rocket className="h-4 w-4" />
                    <span>Commencer</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
