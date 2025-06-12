export type BreadcrumbItem = {
  label: string
  href: string
  isCurrentPage?: boolean
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Remove leading slash and split into segments
  const segments = pathname.split('/').filter(Boolean)

  // Generate breadcrumb items
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isCurrentPage = index === segments.length - 1

    // Format the label (capitalize and replace hyphens with spaces)
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      label,
      href,
      isCurrentPage,
    }
  })
}
