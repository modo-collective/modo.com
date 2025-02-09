"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check } from "lucide-react"

interface ApplicationCardProps {
  type: "beta" | "developer"
  onClose: () => void
}

export function ApplicationCard({ type, onClose }: ApplicationCardProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [portfolioLink, setPortfolioLink] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [githubProfile, setGithubProfile] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (type === "developer") {
      if (!firstName) newErrors.firstName = "First name is required"
      if (!lastName) newErrors.lastName = "Last name is required"
      if (!role) newErrors.role = "Role selection is required"
      if (!portfolioLink) {
        newErrors.portfolioLink = "Portfolio link is required"
      } else if (!/^https?:\/\/.+/.test(portfolioLink)) {
        newErrors.portfolioLink = "Invalid URL format"
      }
      if (!resumeFile) newErrors.resumeFile = "Resume file is required"
      if (!githubProfile) {
        newErrors.githubProfile = "GitHub profile is required"
      } else if (!/^https?:\/\/(www\.)?github\.com\/.+/.test(githubProfile)) {
        newErrors.githubProfile = "Invalid GitHub profile URL"
      }
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttemptedSubmit(true)
    const formErrors = validateForm()
    setErrors(formErrors)

    if (Object.keys(formErrors).length === 0) {
      console.log("Submitted:", { type, firstName, lastName, email, role, portfolioLink, resumeFile, githubProfile })
      setIsSubmitted(true)
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
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
                : "Acknowledged! You will be informed when availability has opened up."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md animate-in slide-in-from-bottom duration-300">
        <CardHeader>
          <CardTitle>{type === "beta" ? "Apply for Beta Testing" : "Apply as a Developer"}</CardTitle>
          <CardDescription>
            {type === "beta" ? "Be among the first to experience Modo" : "Join our team and help build Modo"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {type === "developer" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    aria-invalid={attemptedSubmit && errors.firstName ? "true" : "false"}
                  />
                  {attemptedSubmit && errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    aria-invalid={attemptedSubmit && errors.lastName ? "true" : "false"}
                  />
                  {attemptedSubmit && errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </>
            )}
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
              <>
                <div className="space-y-2">
                  <Label>Role</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Link</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://your-portfolio.com"
                    aria-invalid={attemptedSubmit && errors.portfolioLink ? "true" : "false"}
                  />
                  {attemptedSubmit && errors.portfolioLink && (
                    <p className="text-red-500 text-sm">{errors.portfolioLink}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub Profile</Label>
                  <Input
                    id="github"
                    type="url"
                    value={githubProfile}
                    onChange={(e) => setGithubProfile(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    aria-invalid={attemptedSubmit && errors.githubProfile ? "true" : "false"}
                  />
                  {attemptedSubmit && errors.githubProfile && (
                    <p className="text-red-500 text-sm">{errors.githubProfile}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume</Label>
                  <Input id="resume" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                  {attemptedSubmit && errors.resumeFile && <p className="text-red-500 text-sm">{errors.resumeFile}</p>}
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}