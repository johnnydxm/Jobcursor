"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Plus, 
  Trash2, 
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Save,
  AlertCircle,
  Download,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription } from '@/components/ui/Alert'

interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

interface ResumeData {
  contactInfo: ContactInfo
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  summary: string
}

interface ValidationErrors {
  [key: string]: string
}

const STEPS = [
  { id: 'contact', title: 'Contact Information', icon: User },
  { id: 'experience', title: 'Work Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Award },
  { id: 'summary', title: 'Summary', icon: FileText }
]

const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [resumeData, setResumeData] = useState<ResumeData>({
    contactInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    workExperience: [],
    education: [],
    skills: [],
    summary: ''
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showPreview, setShowPreview] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: ValidationErrors = {}
    
    switch (stepIndex) {
      case 0: // Contact Info
        if (!resumeData.contactInfo.firstName) newErrors.firstName = 'First name is required'
        if (!resumeData.contactInfo.lastName) newErrors.lastName = 'Last name is required'
        if (!resumeData.contactInfo.email) {
          newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(resumeData.contactInfo.email)) {
          newErrors.email = 'Email is invalid'
        }
        if (!resumeData.contactInfo.phone) newErrors.phone = 'Phone is required'
        break
      case 1: // Work Experience
        if (resumeData.workExperience.length === 0) {
          newErrors.workExperience = 'At least one work experience is required'
        }
        break
      case 2: // Education
        if (resumeData.education.length === 0) {
          newErrors.education = 'At least one education entry is required'
        }
        break
      case 3: // Skills
        if (resumeData.skills.length === 0) {
          newErrors.skills = 'At least one skill is required'
        }
        break
      case 4: // Summary
        if (!resumeData.summary.trim()) {
          newErrors.summary = 'Summary is required'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const autoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saving')
      // Simulate API call
      setTimeout(() => {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      }, 1000)
    }, 1000)
  }, [])

  useEffect(() => {
    autoSave()
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [resumeData, autoSave])

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp]
    }))
  }

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }))
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: ''
    }
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }))
  }

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Beginner'
    }
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }))
  }

  const removeSkill = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const renderContactInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={resumeData.contactInfo.firstName}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, firstName: e.target.value }
            }))}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.firstName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={resumeData.contactInfo.lastName}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, lastName: e.target.value }
            }))}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={resumeData.contactInfo.email}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, email: e.target.value }
            }))}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            value={resumeData.contactInfo.phone}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, phone: e.target.value }
            }))}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={resumeData.contactInfo.address}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            contactInfo: { ...prev.contactInfo, address: e.target.value }
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={resumeData.contactInfo.city}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, city: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            value={resumeData.contactInfo.state}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, state: e.target.value }
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            value={resumeData.contactInfo.zipCode}
            onChange={(e) => setResumeData(prev => ({
              ...prev,
              contactInfo: { ...prev.contactInfo, zipCode: e.target.value }
            }))}
          />
        </div>
      </div>
    </motion.div>
  )

  const renderWorkExperience = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {errors.workExperience && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.workExperience}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {resumeData.workExperience.map((exp, index) => (
          <Card key={exp.id} className="p-6 border-2 border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 text-gray-400 cursor-move flex items-center justify-center"
                  draggable
                >
                  <GripVertical className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Experience {index + 1}
                </h3>
              </div>
              <Button
                onClick={() => removeWorkExperience(exp.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                  placeholder="Job title"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={4}
              />
            </div>
          </Card>
        ))}
      </div>
      
      <Button
        onClick={addWorkExperience}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-lg py-3 rounded-lg shadow-md border-none hover:bg-blue-700 hover:scale-105 transition-all duration-150"
      >
        <Plus className="w-6 h-6 mr-2" />
        Add Work Experience
      </Button>
    </motion.div>
  )

  const renderEducation = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {errors.education && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.education}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        {resumeData.education.map((edu, index) => (
          <Card key={edu.id} className="p-6 border-2 border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Education {index + 1}
              </h3>
              <Button
                onClick={() => removeEducation(edu.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="University/School name"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree *</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor's, Master's, etc."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Field of Study *</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science, Business, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Graduation Date</Label>
                <Input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>GPA (Optional)</Label>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Button
        onClick={addEducation}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-lg py-3 rounded-lg shadow-md border-none hover:bg-blue-700 hover:scale-105 transition-all duration-150"
      >
        <Plus className="w-6 h-6 mr-2" />
        Add Education
      </Button>
    </motion.div>
  )

  const renderSkills = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {errors.skills && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {errors.skills}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resumeData.skills.map((skill, index) => (
          <Card key={skill.id} className="p-4 border-2 border-gray-100 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                Skill {index + 1}
              </h3>
              <Button
                onClick={() => removeSkill(skill.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Skill Name *</Label>
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="JavaScript, Project Management, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Proficiency Level</Label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              
              <div className="mt-2">
                <Badge>
                  {skill.level}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <Button
        onClick={addSkill}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold text-lg py-3 rounded-lg shadow-md border-none hover:bg-blue-700 hover:scale-105 transition-all duration-150"
      >
        <Plus className="w-6 h-6 mr-2" />
        Add Skill
      </Button>
    </motion.div>
  )

  const renderSummary = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary *</Label>
        <Textarea
          id="summary"
          value={resumeData.summary}
          onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
          placeholder="Write a compelling summary that highlights your key qualifications, experience, and career objectives..."
          rows={8}
          className={errors.summary ? 'border-red-500' : ''}
        />
        {errors.summary && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.summary}
          </p>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for a great summary:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep it concise (3-4 sentences)</li>
          <li>• Highlight your most relevant experience</li>
          <li>• Include key skills and achievements</li>
          <li>• Tailor it to your target role</li>
        </ul>
      </div>
    </motion.div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderContactInfo()
      case 1:
        return renderWorkExperience()
      case 2:
        return renderEducation()
      case 3:
        return renderSkills()
      case 4:
        return renderSummary()
      default:
        return null
    }
  }

  const getCompletionPercentage = () => {
    let completed = 0
    const total = STEPS.length
    
    // Check each step completion
    if (resumeData.contactInfo.firstName && resumeData.contactInfo.lastName && 
        resumeData.contactInfo.email && resumeData.contactInfo.phone) completed++
    if (resumeData.workExperience.length > 0) completed++
    if (resumeData.education.length > 0) completed++
    if (resumeData.skills.length > 0) completed++
    if (resumeData.summary.trim()) completed++
    
    return Math.round((completed / total) * 100)
  }

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleDownload = () => {
    // This would integrate with a PDF generation service
    alert('Download functionality will be implemented with PDF generation service')
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Editor
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
          
          {/* Resume Preview */}
          <Card className="p-8 bg-white shadow-lg">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {resumeData.contactInfo.firstName} {resumeData.contactInfo.lastName}
                </h1>
                <div className="mt-2 text-gray-600 space-y-1">
                  <p>{resumeData.contactInfo.email} • {resumeData.contactInfo.phone}</p>
                  <p>
                    {resumeData.contactInfo.address && `${resumeData.contactInfo.address}, `}
                    {resumeData.contactInfo.city} {resumeData.contactInfo.state} {resumeData.contactInfo.zipCode}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Professional Summary</h2>
                  <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Work Experience */}
              {resumeData.workExperience.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Work Experience</h2>
                  <div className="space-y-4">
                    {resumeData.workExperience.map((exp) => (
                      <div key={exp.id} className="border-l-2 border-blue-200 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Education</h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id}>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                        <p className="text-sm text-gray-600">
                          {edu.graduationDate} {edu.gpa && `• GPA: ${edu.gpa}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Skills</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {resumeData.skills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        <Badge>{skill.level}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Builder</h1>
          <p className="text-gray-600">Create a professional resume in minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{getCompletionPercentage()}%</span>
          </div>
          <Progress value={getCompletionPercentage()} className="h-2" />
        </div>

        {/* Save Status */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-blue-600">
                <Save className="w-4 h-4 animate-spin" />
                <span className="text-sm">Saving...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">Saved</span>
              </div>
            )}
          </div>
          <Button
            onClick={handlePreview}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Eye className="w-4 h-4" />
            Preview Resume
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Steps</h2>
              <div className="space-y-2">
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === index
                  const isCompleted = index < currentStep || 
                    (index === 0 && resumeData.contactInfo.firstName && resumeData.contactInfo.lastName && resumeData.contactInfo.email && resumeData.contactInfo.phone) ||
                    (index === 1 && resumeData.workExperience.length > 0) ||
                    (index === 2 && resumeData.education.length > 0) ||
                    (index === 3 && resumeData.skills.length > 0) ||
                    (index === 4 && resumeData.summary.trim())

                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : isCompleted
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive
                          ? 'bg-blue-200'
                          : isCompleted
                          ? 'bg-green-200'
                          : 'bg-gray-200'
                      }`}>
                        {isCompleted && !isActive ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-xs opacity-75">
                          {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-gray-600">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {STEPS.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : index < currentStep
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === STEPS.length - 1}
                  className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder
