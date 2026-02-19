// ============================================================================
// DietWise - Notification Reminder System
// Uses browser Notification API to remind users about meals and water
// ============================================================================

export interface ReminderConfig {
  enabled: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  mealTimes: string[]; // HH:MM format
  waterIntervalMinutes: number;
}

const STORAGE_KEY = "dietwise-reminders";
const DEFAULT_MEAL_TIMES = ["07:30", "10:30", "13:00", "16:00", "19:00", "21:00"];

export function getDefaultReminderConfig(): ReminderConfig {
  return {
    enabled: false,
    mealReminders: true,
    waterReminders: true,
    mealTimes: DEFAULT_MEAL_TIMES,
    waterIntervalMinutes: 60,
  };
}

export function loadReminderConfig(): ReminderConfig {
  if (typeof window === "undefined") return getDefaultReminderConfig();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...getDefaultReminderConfig(), ...JSON.parse(stored) };
  } catch {}
  return getDefaultReminderConfig();
}

export function saveReminderConfig(config: ReminderConfig): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function hasNotificationSupport(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!hasNotificationSupport()) return "unsupported";
  return Notification.permission;
}

export function sendNotification(title: string, body: string, tag?: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: tag || "dietwise-reminder",
    requireInteraction: false,
  });
}

// Meal-type-specific reminder messages
const MEAL_MESSAGES: Record<string, { title: string; body: string }> = {
  "07:30": { title: "Breakfast Time!", body: "Start your day right - log your breakfast" },
  "10:30": { title: "Mid-Morning Snack", body: "Time for a healthy snack - fruits or sprouts" },
  "13:00": { title: "Lunch Time!", body: "Your biggest meal of the day - eat mindfully" },
  "16:00": { title: "Evening Snack", body: "Have a light snack - makhana, green tea, or nuts" },
  "19:00": { title: "Dinner Time!", body: "Keep dinner lighter than lunch" },
  "21:00": { title: "Post-Dinner", body: "Just warm milk or herbal tea - kitchen is closed!" },
};

/** Start meal reminders. Returns cleanup function. */
export function startMealReminders(mealTimes: string[]): () => void {
  const checkInterval = setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (mealTimes.includes(currentTime)) {
      const msg = MEAL_MESSAGES[currentTime] || {
        title: "Meal Reminder",
        body: "Don't forget to log your meal!",
      };
      sendNotification(msg.title, msg.body, `meal-${currentTime}`);
    }
  }, 60_000); // Check every minute

  return () => clearInterval(checkInterval);
}

/** Start water reminders. Returns cleanup function. */
export function startWaterReminders(intervalMinutes: number): () => void {
  const intervalMs = intervalMinutes * 60_000;

  const waterInterval = setInterval(() => {
    const hour = new Date().getHours();
    // Only remind between 7am and 9pm
    if (hour >= 7 && hour <= 21) {
      sendNotification(
        "Hydration Reminder",
        "Time for a glass of water! Stay hydrated.",
        "water-reminder"
      );
    }
  }, intervalMs);

  return () => clearInterval(waterInterval);
}
