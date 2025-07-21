import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import * as XLSX from 'xlsx'

// Helper to extract title and description from pasted jobDescription
function extractTitleAndDescription(input: string): { title: string; description: string } {
  const lines = input.split('\n').map((l) => l.trim())
  const title = lines[0] || ''
  // Find the first occurrence of 'Summary' (case-insensitive)
  const summaryIndex = lines.findIndex((line) => line.toLowerCase().startsWith('summary'))
  let description = ''
  if (summaryIndex !== -1) {
    description = lines.slice(summaryIndex + 1).join(' ')
  }
  return { title, description }
}

const XLSX_PATH = join(process.cwd(), 'public', 'upwork_tasks.xlsx')

export async function POST(req: Request) {
  try {
    const { jobDescription } = await req.json()
    if (!jobDescription || typeof jobDescription !== 'string') {
      return NextResponse.json({ error: 'Invalid jobDescription' }, { status: 400 })
    }
    const { title, description } = extractTitleAndDescription(jobDescription)
    if (!title || !description) {
      return NextResponse.json({ error: 'Could not extract title/description' }, { status: 400 })
    }
    // Read or create XLSX file
    let workbook: XLSX.WorkBook
    let worksheet: XLSX.WorkSheet
    let data: unknown[][]
    try {
      const fileBuffer = await readFile(XLSX_PATH)
      workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      worksheet = workbook.Sheets['Sheet1']
      if (!worksheet) {
        // If Sheet1 does not exist, create it
        data = [['Number', 'Title', 'Description']]
        worksheet = XLSX.utils.aoa_to_sheet(data)
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
      } else {
        data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]
      }
    } catch {
      // File does not exist, create new
      data = [['Number', 'Title', 'Description']]
      workbook = XLSX.utils.book_new()
      worksheet = XLSX.utils.aoa_to_sheet(data)
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    }
    let nextNumber = 1
    if (data.length > 1) {
      const lastRow = data[data.length - 1] as string[]
      const lastNum = parseInt((lastRow && lastRow[0]) || '0', 10)
      if (!isNaN(lastNum)) nextNumber = lastNum + 1
    }
    data.push([nextNumber, title, description])
    // Update Sheet1 worksheet in place
    const updatedWorksheet = XLSX.utils.aoa_to_sheet(data)
    workbook.Sheets['Sheet1'] = updatedWorksheet
    const xlsxBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
    await writeFile(XLSX_PATH, xlsxBuffer)
    return NextResponse.json({ success: true, number: nextNumber, title, description })
  } catch (error) {
    console.error('Error saving upwork task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
