import * as XLSX from 'xlsx';

export interface TestCaseExcelRow {
  TC_ID: string;
  Category: string;
  Summary: string;
  'Test Description': string;
  'Test Steps': string;
  'Expected Result': string;
  Status?: string;
}

export const EXCEL_TEMPLATE_HEADERS: (keyof TestCaseExcelRow)[] = [
  'TC_ID',
  'Category',
  'Summary',
  'Test Description',
  'Test Steps',
  'Expected Result',
  'Status',
];

export const VALID_CATEGORIES = [
  'Positive',
  'Negative',
  'Validation',
  'Validation checks',
  'Edge',
  'Edge cases',
];

export const VALID_STATUSES = ['draft', 'reviewed', 'approved'];

export function createTemplateWorkbook(): XLSX.WorkBook {
  const headers = [...EXCEL_TEMPLATE_HEADERS];
  const exampleRow = {
    TC_ID: 'TC-0001',
    Category: 'Positive',
    Summary: 'User logs in with valid credentials',
    'Test Description': 'Verify login flow with correct username and password',
    'Test Steps': '1. Navigate to login page\n2. Enter valid username\n3. Enter valid password\n4. Click login',
    'Expected Result': 'User is redirected to dashboard',
    Status: 'draft',
  };
  const worksheet = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
  worksheet['!cols'] = [
    { wch: 12 },
    { wch: 18 },
    { wch: 34 },
    { wch: 48 },
    { wch: 64 },
    { wch: 48 },
    { wch: 12 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCases');
  return workbook;
}

export function downloadTemplate(): void {
  const workbook = createTemplateWorkbook();
  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `forgeqa-test-case-template-${date}.xlsx`);
}

function normalizeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function splitSteps(value: string): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n/)
    .map((step) => step.replace(/^\d+\.?\s*/, '').trim())
    .filter(Boolean);
}

export interface ParseExcelResult {
  valid: TestCaseExcelRow[];
  errors: string[];
}

export function parseExcelFile(file: File): Promise<ParseExcelResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          resolve({ valid: [], errors: ['The Excel file contains no sheets.'] });
          return;
        }
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
          defval: '',
          raw: false,
        });
        if (!rows.length) {
          resolve({ valid: [], errors: ['The Excel file is empty.'] });
          return;
        }
        const valid: TestCaseExcelRow[] = [];
        const errors: string[] = [];
        rows.forEach((row, index) => {
          const lineNumber = index + 2;
          const category = normalizeString(row.Category);
          const summary = normalizeString(row.Summary);
          const description = normalizeString(row['Test Description']);
          const stepsRaw = normalizeString(row['Test Steps']);
          const expected = normalizeString(row['Expected Result']);
          const tcId = normalizeString(row.TC_ID) || `TC-${String(index).padStart(4, '0')}`;
          const status = normalizeString(row.Status).toLowerCase();

          const rowErrors: string[] = [];
          if (!summary) rowErrors.push('Summary is required');
          if (!description) rowErrors.push('Test Description is required');
          if (!stepsRaw) rowErrors.push('Test Steps is required');
          if (!expected) rowErrors.push('Expected Result is required');
          if (category && !VALID_CATEGORIES.includes(category)) {
            rowErrors.push(`Category "${category}" is not valid`);
          }
          if (status && !VALID_STATUSES.includes(status)) {
            rowErrors.push(`Status "${status}" is not valid (use draft, reviewed, or approved)`);
          }

          if (rowErrors.length) {
            errors.push(`Row ${lineNumber}: ${rowErrors.join('; ')}`);
            return;
          }

          valid.push({
            TC_ID: tcId,
            Category: (category as TestCaseExcelRow['Category']) || 'Positive',
            Summary: summary,
            'Test Description': description,
            'Test Steps': stepsRaw,
            'Expected Result': expected,
            Status: (status as TestCaseExcelRow['Status']) || undefined,
          });
        });
        resolve({ valid, errors });
      } catch (parseError) {
        reject(parseError instanceof Error ? parseError : new Error('Failed to parse Excel file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
}