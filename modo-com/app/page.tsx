"use client"

import { useEffect, useState, useRef } from "react"
import DynamicBackground from "@/components/DynamicBackground"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { ApplicationCard } from "@/components/ApplicationCard"
import Image from "next/image"

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [showBetaCard, setShowBetaCard] = useState(false)
  const [showDeveloperCard, setShowDeveloperCard] = useState(false)
  const aboutSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="relative min-h-screen pb-16">
      <div className="fixed inset-0 z-0">
        <DynamicBackground />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 ${scrolled ? "bg-black bg-opacity-70 py-2" : "bg-transparent py-4"}`}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Modo</h1>
        </div>
      </header>

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-white px-4">
          <div className="mb-8 w-64 h-64 relative">
            <Image
              src="https://raw.githubusercontent.com/modo-collective/modo.com/refs/heads/main/modo-com/public/modo-no-background.png"
              alt="Modo Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4">Stop scrolling. Start creating.</h2>
          <p className="text-xl md:text-2xl text-center mb-8">A social media app for the distracted artist</p>
          <button
            onClick={scrollToAbout}
            className="animate-bounce cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-2"
            aria-label="Scroll to About section"
          >
            <ChevronDown size={48} />
          </button>
        </section>

        <section id="about" ref={aboutSectionRef} className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">About Modo</h2>
            <h3 className="text-2xl font-semibold mb-4">An app for artists, by artists</h3>
            <p className="mb-4">
              Modern social media apps are broken. Feeds are defined by algorithms, mindless scrolling and constant 
              consumption of disposable media. 
            </p>
            <p className="mb-4">
              Modo calls its users to find the quiet within the noise.
            </p>
            <p className="mb-4">
              Modo is the ethical social networking platform for artists to showcase their work, connect with 
              fellow creatives, and find inspiration. 
            </p>
            <p className="mb-4">
               Modo's mission is to be your space where creativity thrives and artists can focus on what fulfills them the most -
               creating. We are the sum of what we consume. Mindfully consume allows us to rekindle your love for creation.
            </p>
            <h4 className="text-xl font-semibold mb-2">Key Features:</h4>
            <ul className="list-disc list-inside mb-4">
              <li>Customizable portfolios</li>
              <li>Collaboration-first tools</li>
              <li>Invite-only, small social network by design</li>
              <li>Art-oriented distraction-free feed</li>
              <li>Opportunities to connect with artists and clients</li>
              <li>Committed to data minimisation</li>
              <li>Transparent personal data policies</li>
            </ul>
            <p className="mb-2">
              Join us in changing the way artists interact online. Stop scrolling, start creating with Modo.
            </p>
            <p className="italic text-gray-600">~ Gabriel</p>
          </div>
        </section>

        <section id="join" className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Join Modo</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Join as a Beta Tester</CardTitle>
                  <CardDescription>Be the first to experience Modo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Shape the future of Modo by providing valuable feedback during our beta testing phase.
                  </p>
                  <Button className="w-full" onClick={() => setShowBetaCard(true)}>
                    Apply for Beta Testing
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Join as a Developer</CardTitle>
                  <CardDescription>Help us build Modo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Are you passionate about creating tools for artists? Join our development team and make an impact.
                  </p>
                  <Button className="w-full" onClick={() => setShowDeveloperCard(true)}>
                    Apply as a Developer
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-black bg-opacity-70 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            {(() => {
              const startYear = 2025
              const currentYear = new Date().getFullYear()
              if (currentYear > startYear) {
                return `© ${startYear}-${currentYear} Modo. All rights reserved.`
              } else {
                return `© ${startYear} Modo. All rights reserved.`
              }
            })()}
          </p>
        </div>
      </footer>

      {showBetaCard && <ApplicationCard type="beta" onClose={() => setShowBetaCard(false)} />}
      {showDeveloperCard && <ApplicationCard type="developer" onClose={() => setShowDeveloperCard(false)} />}
    </div>
  )
}