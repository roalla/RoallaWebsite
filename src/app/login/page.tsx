import { redirect } from 'next/navigation'

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const suffix = query ? `?${query}` : ''
  redirect(`/en/login${suffix}`)
}
