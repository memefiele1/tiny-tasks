import API_BASE_URL from "./config";
export async function fetchAfternoonTasks(userId: string, date?: string) {
  const baseUrl = API_BASE_URL
  let url = `${baseUrl}/api/tasks/afternoon/${userId}`;
  if (date) url += `?date=${encodeURIComponent(date)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Unknown error");
    return data.tasks;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch afternoon tasks");
  }
}
// API utility for Tiny Tasks
export async function fetchMorningTasks(userId: string, date?: string) {
  const baseUrl =  API_BASE_URL;
  let url = `${baseUrl}/api/tasks/morning/${userId}`;
  if (date) url += `?date=${encodeURIComponent(date)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Unknown error");
    return data.tasks;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch morning tasks");
  }
}

export async function fetchTaskEstimate(taskId: string) {
  const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/estimate`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to estimate task");
  }

  return data;
}