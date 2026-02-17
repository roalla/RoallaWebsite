'use client'

import React, { useState, useEffect } from 'react'
import { signIn, getProviders } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const oauthProviderIds = ['google', 'azure-ad', 'apple', 'sso'] as const
const oauthLabels: Record<string, string> = {
  google: 'Google',
  'azure-ad': 'Microsoft',
  apple: 'Apple',
  sso: 'Single Sign-On',
}

export default function LoginForm() {
  const t = useTranslations('login')
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [oauthProviders, setOauthProviders] = useState<Record<string, { id: string; name: string }>>({})

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return
      const next: Record<string, { id: string; name: string }> = {}
      oauthProviderIds.forEach((id) => {
        if (p[id]) next[id] = { id, name: (p[id] as { name?: string }).name || oauthLabels[id] || id }
      })
      setOauthProviders(next)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    try {
      const res = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      })
      if (res?.error) {
        try {
          const data = JSON.parse(res.error) as { code?: string; token?: string }
          if (data.code === 'Needs2FA' && data.token) {
            window.location.href = `/auth/2fa?token=${encodeURIComponent(data.token)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
            return
          }
        } catch {
          // not JSON
        }
        setMessage(t('invalidCredentials'))
        setIsLoading(false)
        return
      }
      if (res?.url) {
        window.location.href = res.url
        return
      }
    } catch {
      setMessage(t('somethingWrong'))
    }
    setIsLoading(false)
  }

  const oauthError =
    error === 'OAuthCallback' ||
    error === 'OAuthCallbackError' ||
    error === 'Callback' ||
    error === 'OAuthSignin' ||
    error === 'OAuthAccountNotLinked' ||
    error === 'OAuthCreateAccount' ||
    error === 'AccessDenied'
  const errorMessage =
    message ||
    (error === 'CredentialsSignin' ? t('invalidCredentials') : null) ||
    (error === 'OAuthAccountNotLinked' ? t('oauthErrorAccountNotLinked') : null) ||
    (oauthError ? `${t('oauthErrorMicrosoft')} [${error}]` : error ? `${t('signInFailed')} (${error})` : t('signInFailed'))

  const isRedirecting = !!oauthLoading

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 relative">
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm" aria-live="polite">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-white font-medium">{t('redirecting')}</p>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <Link href="/" className="block">
            <Image src="/logo.svg" alt="ROALLA" width={120} height={40} className="h-10 w-auto" priority />
          </Link>
        </div>
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('backToHome')}
        </Link>

        <div className="bg-surface-card rounded-2xl shadow-xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 id="login-title" className="text-2xl font-bold text-white">{t('signIn')}</h1>
            <p id="login-desc" className="text-gray-400 mt-1">{t('accessDashboard')}</p>
          </div>

          {(error || message) && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="login-title" aria-describedby="login-desc">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t('email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-lg bg-black/50 text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? t('signingIn') : t('signInButton')}
            </button>

            {Object.keys(oauthProviders).length > 0 && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-surface-card px-4 text-gray-400">{t('orSignInWith')}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(oauthProviders).map(([id, provider]) => (
                    <button
                      key={id}
                      type="button"
                      disabled={!!oauthLoading}
                      onClick={() => {
                        setOauthLoading(id)
                        signIn(id, { callbackUrl })
                      }}
                      className="w-full py-3 px-4 border border-white/20 rounded-lg font-medium text-gray-300 bg-white/5 hover:bg-white/10 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      {oauthLoading === id ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                          {t('redirecting')}
                        </>
                      ) : (
                        <>
                          {id === 'google' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                          )}
                          {id === 'azure-ad' && (
                            <svg className="w-5 h-5" viewBox="0 0 23 23" aria-hidden>
                              <path fill="#f35325" d="M1 1h10v10H1z" />
                              <path fill="#81bc06" d="M12 1h10v10H12z" />
                              <path fill="#05a6f0" d="M1 12h10v10H1z" />
                              <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                          )}
                          {id === 'apple' && (
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                          )}
                          {provider.name}
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            <p className="text-center text-sm text-gray-400 mt-4">
              <a href="/login/forgot-password" className="text-primary hover:text-primary-dark font-medium">
                {t('forgotPassword')}
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
