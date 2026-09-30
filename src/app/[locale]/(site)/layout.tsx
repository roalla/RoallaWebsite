import '../../site.css'

type Props = {
  children: React.ReactNode
}

/** Inner routes only. The homepage stays outside this group so it skips site.css. */
export default function SiteLayout({ children }: Props) {
  return children
}
