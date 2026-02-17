import { redirect } from 'next/navigation'

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }

export default async function DashboardRedirectPage({ searchParams }: Props) {
  const params = await searchParams
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const suffix = query ? `?${query}` : ''
  redirect(`/en/dashboard${suffix}`)
}
