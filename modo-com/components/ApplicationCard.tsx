"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ApplicationCardProps {
  type: "beta" | "developer"
  onClose: () => void
}

export function ApplicationCard({ type, onClose }: ApplicationCardProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDeveloperCard, setShowDeveloperCard] = useState(false)

  useEffect(() => {
    if (type === "developer") {
      const timer = setTimeout(() => {
        setShowDeveloperCard(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [type])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (type === "developer" && !role) {
      newErrors.role = "Role selection is required"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAttemptedSubmit(true)
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Submitted:", { type, email, role })
      setIsLoading(false)
      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md animate-in slide-in-from-bottom duration-300">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Check className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg font-semibold text-center">
              {type === "beta"
                ? "Acknowledged! You will be informed when Modo is ready for beta testing."
                : "Thank you for your interest! We'll notify you when the role becomes available."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <AnimatePresence>
        {type === "developer" && !showDeveloperCard ? (
          <motion.div
            key="initial-card"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Join as a Developer</CardTitle>
                <CardDescription>Contribute to building Modo</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center">Please wait while we check available positions...</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="main-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{type === "beta" ? "Apply for Beta Testing" : "Join Developer Waitlist"}</CardTitle>
                <CardDescription>
                  {type === "beta"
                    ? "Be among the first to experience Modo"
                    : "Get notified when developer positions open up"}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      aria-invalid={attemptedSubmit && errors.email ? "true" : "false"}
                    />
                    {attemptedSubmit && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  {type === "developer" && (
                    <div className="space-y-2">
                      <Label>Desired Role</Label>
                      <RadioGroup value={role} onValueChange={setRole}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="frontend" id="frontend" />
                          <Label htmlFor="frontend">Frontend (TypeScript, React, Vercel)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="backend" id="backend" />
                          <Label htmlFor="backend">Backend (FastAPI, Flask, Django, Supabase)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="design" id="design" />
                          <Label htmlFor="design">Design (Figma, Blender, Photo/Video Editing)</Label>
                        </div>
                      </RadioGroup>
                      {attemptedSubmit && errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                    </div>
                  )}
                  {type === "developer" && (
                    <p className="text-sm text-gray-500 italic">
                      Note: Frontend, Backend, and Design roles are currently filled. Join our waitlist to be notified
                      when positions open up.
                    </p>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : type === "beta" ? (
                      "Submit Application"
                    ) : (
                      "Join Waitlist"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}