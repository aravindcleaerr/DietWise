// ============================================================================
// DietWise - Full Data Backup & Restore (JSON)
// ============================================================================

const STORAGE_KEY = "dietwise-storage";

/** Export all DietWise data as a JSON file download */
export function exportFullBackup() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  const data = JSON.parse(raw);
  const backup = {
    _type: "dietwise-backup",
    _version: 1,
    _exportedAt: new Date().toISOString(),
    state: data.state,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dietwise-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/** Validate and import a backup file, returning the parsed state or an error */
export function parseBackupFile(file: File): Promise<{ success: true; state: Record<string, unknown> } | { success: false; error: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (data._type !== "dietwise-backup" || !data.state) {
          resolve({ success: false, error: "Invalid backup file format" });
          return;
        }

        if (!data.state.profile) {
          resolve({ success: false, error: "Backup file is missing profile data" });
          return;
        }

        resolve({ success: true, state: data.state });
      } catch {
        resolve({ success: false, error: "Could not parse backup file" });
      }
    };
    reader.onerror = () => resolve({ success: false, error: "Could not read file" });
    reader.readAsText(file);
  });
}

/** Apply a parsed backup state to localStorage and reload */
export function applyBackup(state: Record<string, unknown>) {
  const existing = localStorage.getItem(STORAGE_KEY);
  const parsed = existing ? JSON.parse(existing) : {};
  parsed.state = state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  window.location.reload();
}
