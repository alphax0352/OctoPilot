'use client'

import { DataTable } from '@/components/job/data-table'
import { Application, ApplicationStatus } from '@/types/client'
import { useEffect, useState } from 'react'

interface PaginationData {
  total: number
  page: number
  limit: number
  totalPages: number
}

interface Filters {
  company: string
  status: string
}

export default function JobPage() {
  const [data, setData] = useState<Application[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    company: '',
    status: '',
  })

  const fetchData = async (page: number = 1, newFilters?: Filters) => {
    try {
      setIsLoading(true)
      const currentFilters = newFilters || filters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(currentFilters.company && { company: currentFilters.company }),
        ...(currentFilters.status && { status: currentFilters.status }),
      })

      const response = await fetch(`/api/jobs?${queryParams}`)
      const result = await response.json()

      if (response.ok) {
        setData(result.data)
        setPagination(result.pagination)
      } else {
        console.error('Failed to fetch applications:', result.error)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (id: number, status: ApplicationStatus) => {
    setData((prevData) => prevData.map((app) => (app.id === id ? { ...app, status } : app)))
  }

  const handleDataChange = (newData: Application[]) => {
    setData(newData)
    setPagination((prev) => ({
      ...prev,
      total: prev.total - (data.length - newData.length),
      totalPages: Math.ceil((prev.total - (data.length - newData.length)) / prev.limit),
    }))
  }

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
    fetchData(1, newFilters)
  }

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      totalPages: Math.ceil(prev.total / newLimit),
    }))
    fetchData(1)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container">
      <DataTable
        data={data}
        pagination={pagination}
        onPageChange={fetchData}
        onLimitChange={handleLimitChange}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onDataChange={handleDataChange}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  )
}
