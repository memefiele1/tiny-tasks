export async function fetchAfternoonTasks(userId: string, date?: string) {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
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
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
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