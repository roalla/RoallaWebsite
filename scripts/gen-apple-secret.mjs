#!/usr/bin/env node
/**
 * Generate Apple Sign in with Apple client secret (JWT).
 * Required for APPLE_SECRET in NextAuth. JWT is valid 6 months by default.
 *
 * Set these env vars (or add to .env.local):
 *   APPLE_TEAM_ID   - Your Apple Developer Team ID (top right in developer.apple.com)
 *   APPLE_KEY_ID   - Key ID from the Keys page (after creating Sign in with Apple key)
 *   APPLE_CLIENT_ID - Your Services ID (e.g. com.roalla.website.signin)
 *   APPLE_PRIVATE_KEY - Path to .p8 file OR the full key content (-----BEGIN PRIVATE KEY----- ...)
 *
 * Example (PowerShell):
 *   $env:APPLE_TEAM_ID="ABCD1234"; $env:APPLE_KEY_ID="XYZ789"; $env:APPLE_CLIENT_ID="com.roalla.website.signin"; $env:APPLE_PRIVATE_KEY=".\AuthKey_XYZ789.p8"; node scripts/gen-apple-secret.mjs
 *
 * Example (bash):
 *   APPLE_TEAM_ID=ABCD1234 APPLE_KEY_ID=XYZ789 APPLE_CLIENT_ID=com.roalla.website.signin APPLE_PRIVATE_KEY=./AuthKey.p8 node scripts/gen-apple-secret.mjs
 */

import { SignJWT } from 'jose'
import { createPrivateKey } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const teamId = process.env.APPLE_TEAM_ID
const keyId = process.env.APPLE_KEY_ID
const clientId = process.env.APPLE_CLIENT_ID
let privateKeyInput = process.env.APPLE_PRIVATE_KEY

if (!teamId || !keyId || !clientId || !privateKeyInput) {
  console.error('Missing required env vars: APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_CLIENT_ID, APPLE_PRIVATE_KEY')
  console.error('See docs/APPLE_SIGNIN_SETUP.md for step-by-step setup.')
  process.exit(1)
}

// If it looks like a file path (no BEGIN), try to read the file
let privateKeyPem = privateKeyInput
if (!privateKeyInput.includes('BEGIN PRIVATE KEY')) {
  const keyPath = resolve(process.cwd(), privateKeyInput)
  try {
    privateKeyPem = readFileSync(keyPath, 'utf8')
  } catch (e) {
    console.error('Could not read private key file:', keyPath, e.message)
    process.exit(1)
  }
}

const key = createPrivateKey(privateKeyPem.replace(/\\n/g, '\n'))
const expiresInSeconds = 86400 * 180 // 6 months
const expirationTime = Math.ceil(Date.now() / 1000) + expiresInSeconds

const jwt = await new SignJWT({})
  .setProtectedHeader({ alg: 'ES256', kid: keyId })
  .setIssuer(teamId)
  .setSubject(clientId)
  .setAudience('https://appleid.apple.com')
  .setIssuedAt()
  .setExpirationTime(expirationTime)
  .sign(key)

console.log('Apple client secret (JWT). Valid until:', new Date(expirationTime * 1000).toISOString())
console.log('')
console.log('Add to .env or your host as APPLE_SECRET=')
console.log(jwt)
console.log('')
console.log('(Copy the single line above, no line breaks.)')
