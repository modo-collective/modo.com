"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Loader2, Heart } from "lucide-react"
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
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
        <motion.div
          key="main-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{type === "beta" ? "Apply for Beta Testing" : "Developer Positions"}</CardTitle>
              <CardDescription>
                {type === "beta"
                  ? "Be among the first to experience Modo"
                  : "Thank you for your interest in joining our team"}
              </CardDescription>
            </CardHeader>
            {type === "beta" ? (
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
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </CardFooter>
              </form>
            ) : (
              <>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Heart className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-lg font-medium mb-2">All developer positions are currently filled</p>
                    <p className="text-gray-500">
                      We're not hiring at the moment, but we appreciate your interest in joining our team. Thank you for
                      considering Modo!
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={onClose}>Close</Button>
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
