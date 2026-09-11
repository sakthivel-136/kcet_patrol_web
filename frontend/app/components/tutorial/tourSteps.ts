// Tour steps data - each step targets a real element on the page via data-tour attribute

export interface TourStep {
  id: number
  page: string          // route to navigate to
  target: string        // data-tour attribute value
  title: string
  description: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export const TOUR_STEPS: TourStep[] = [
  // ── DASHBOARD ──────────────────────────────────────────
  {
    id: 0,
    page: '/dashboard',
    target: 'dashboard-stats',
    title: '📊 Dashboard Overview',
    description: 'These cards show today\'s patrol summary — Total Scans, Success Rate, Missed Rounds, and Pending scans. Updated in real-time from the database.',
    position: 'bottom',
  },
  {
    id: 1,
    page: '/dashboard',
    target: 'dashboard-filter',
    title: '🔍 Filter Controls',
    description: 'Use these dropdowns to filter dashboard data by Date, Shift, and Guard. Perfect for reviewing a specific officer\'s performance on any day.',
    position: 'bottom',
  },
  {
    id: 2,
    page: '/dashboard',
    target: 'dashboard-charts',
    title: '📈 Performance Charts',
    description: 'Visual breakdown of scan performance. The pie chart shows Success vs Missed, and the bar chart compares each guard\'s performance.',
    position: 'top',
  },
  {
    id: 3,
    page: '/dashboard',
    target: 'dashboard-leaderboard',
    title: '🏆 Guard Leaderboard',
    description: 'Ranks all security guards by their scan success rate. Top performers are shown in green, lower performers in red.',
    position: 'top',
  },
  // ── REPORTS ────────────────────────────────────────────
  {
    id: 4,
    page: '/report-download',
    target: 'report-dates',
    title: '📅 Date Range Selector',
    description: 'Select a start date and end date to generate reports for any period — single day, weekly, or monthly. Switch between Day, Week, and Month tabs.',
    position: 'bottom',
  },
  {
    id: 5,
    page: '/report-download',
    target: 'report-filters',
    title: '🎛️ Report Filters',
    description: 'Narrow down your report by selecting a specific Guard, Round Slot, or Scan Status (Success / Missed / Pending). Mix and match for precise analytics.',
    position: 'bottom',
  },
  {
    id: 6,
    page: '/report-download',
    target: 'report-table',
    title: '📋 Live Report Table',
    description: 'This table shows all scan records for the selected period in real-time. Each row shows the date, time, guard name, QR point scanned, GPS coordinates, and status.',
    position: 'top',
  },
  {
    id: 7,
    page: '/report-download',
    target: 'report-download-btn',
    title: '⬇️ Download Report',
    description: 'Click this to instantly download the full patrol report as a beautifully formatted PDF — with college logo, campus name, guard stats, and color-coded status.',
    position: 'left',
  },
  // ── USERS MANAGEMENT ───────────────────────────────────
  {
    id: 8,
    page: '/user-crud',
    target: 'user-pdf-download',
    title: '📄 Export User List',
    description: 'Select a role (Guard or Supervisor) from the dropdown and click Download to export a formatted PDF list of all users in that role — with Employee ID, Name, and PIN.',
    position: 'bottom',
  },
  {
    id: 9,
    page: '/user-crud',
    target: 'user-add',
    title: '➕ Add Security User',
    description: 'Click this to register a new Guard, Supervisor, or Admin. They will automatically be assigned to all existing shifts.',
    position: 'left',
  },
  {
    id: 10,
    page: '/user-crud',
    target: 'user-table',
    title: '👮 Security User Table',
    description: 'All registered users are listed here with their Employee ID, Name, and masked password. Click the 👁️ eye icon to reveal a password. Admin passwords require the Supreme Passcode.',
    position: 'top',
  },
  // ── QR MANAGEMENT ──────────────────────────────────────
  {
    id: 11,
    page: '/dashboard/qr-crud',
    target: 'qr-list',
    title: '📍 QR Scan Points',
    description: 'This is the full list of all QR code scan checkpoints registered for the campus. Each one represents a physical location guards must visit during their rounds.',
    position: 'top',
  },
  {
    id: 12,
    page: '/dashboard/qr-crud',
    target: 'qr-add',
    title: '➕ Add New QR Point',
    description: 'Click here to register a new QR scan point. Give it a descriptive name (e.g., "Main Gate", "Parking Lot"). A new QR will only appear in reports from the date it was created.',
    position: 'left',
  },
  // ── SHIFTS ─────────────────────────────────────────────
  {
    id: 13,
    page: '/shifts',
    target: 'shift-list',
    title: '🕐 Patrol Shifts',
    description: 'All defined patrol shifts are listed here with their name, start time, and end time. Shifts define when guards are expected to complete their rounds.',
    position: 'top',
  },
  {
    id: 14,
    page: '/shifts',
    target: 'shift-add',
    title: '➕ Add New Shift',
    description: 'Click here to create a new patrol shift. All existing guards will be automatically assigned to the new shift immediately — no manual assignment needed!',
    position: 'left',
  },
]
