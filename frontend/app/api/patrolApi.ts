// app/api/patrolApi.ts

// Define the interface for the response data based on your server schema
export interface PatrolLocation {
  employee_name: string;
  employee_id: string;
  patrol_time: string; // ISO Date string
  location: string;
  latitude: string;
  longitude: string;
}

export interface PatrolRound {
  s_no: number;
  date: string;
  start_time: string;
  end_time: string;
  table: PatrolLocation[];
}

export interface PatrolReportResponse {
  campus_name: string;
  campus_address: string;
  report_date: string;
  generated_by: string;
  generated_at: string;
  rounds: PatrolRound[];
}

/**
 * Fetches the patrol report from the backend server
 * @param campusCode - The campus code (e.g., "F001")
 * @param date - The date string (e.g., "2026-01-22")
 * @returns The PatrolReportResponse object
 */
export async function getPatrolReport(
  campusCode: string, 
  date: string
): Promise<PatrolReportResponse> {
  // Ensure the URL matches your backend server address (localhost:8000)
  const baseUrl = "http://127.0.0.1:8000"; 
  
  // Construct the query parameters
  const params = new URLSearchParams({
    campus_code: campusCode,
    date: date,
  });

  const url = `${baseUrl}/api/report/patrol?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      // Optional: Add credentials if you have auth cookies
      // credentials: "include", 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to fetch report: ${response.status} ${response.statusText}`);
    }

    const data: PatrolReportResponse = await response.json();
    return data;

  } catch (error) {
    console.error("Network Error:", error);
    throw error;
  }
}