// ============================================================================
// DietWise - Social Sharing Utilities
// Generate shareable progress cards for WhatsApp
// ============================================================================

interface ShareData {
  name: string;
  date: string;
  calories: { consumed: number; target: number };
  protein: { consumed: number; target: number };
  streak: number;
  weightLost: number;
  waterMl: number;
}

/** Generate a shareable text for WhatsApp */
export function generateShareText(data: ShareData): string {
  const calPct = Math.round((data.calories.consumed / data.calories.target) * 100);
  const protPct = Math.round((data.protein.consumed / data.protein.target) * 100);

  let lines = [
    `🥗 *DietWise Daily Progress*`,
    `📅 ${data.date}`,
    ``,
    `🔥 Calories: ${data.calories.consumed} / ${data.calories.target} kcal (${calPct}%)`,
    `💪 Protein: ${data.protein.consumed}g / ${data.protein.target}g (${protPct}%)`,
    `💧 Water: ${(data.waterMl / 1000).toFixed(1)}L`,
  ];

  if (data.streak > 0) {
    lines.push(`🔥 Streak: ${data.streak} day${data.streak > 1 ? "s" : ""}`);
  }

  if (data.weightLost > 0) {
    lines.push(`⬇️ Lost: ${data.weightLost.toFixed(1)} kg`);
  }

  lines.push(``);
  lines.push(`Track your diet free → dietwise-guide.vercel.app`);

  return lines.join("\n");
}

/** Generate a progress card as a canvas image and return as blob */
export async function generateProgressCard(data: ShareData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "#1B5E20");
  gradient.addColorStop(1, "#2E7D32");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // White rounded card
  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  roundRect(ctx, 30, 30, 540, 340, 20);
  ctx.fill();

  // Title
  ctx.fillStyle = "#1B5E20";
  ctx.font = "bold 24px system-ui, sans-serif";
  ctx.fillText("🥗 DietWise Progress", 50, 72);

  // Date & name
  ctx.fillStyle = "#666";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(`${data.name} • ${data.date}`, 50, 95);

  // Divider
  ctx.strokeStyle = "#E0E0E0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 110);
  ctx.lineTo(550, 110);
  ctx.stroke();

  // Stats
  const calPct = Math.round((data.calories.consumed / data.calories.target) * 100);
  const y = 140;

  // Calorie circle
  ctx.fillStyle = "#1B5E20";
  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`${calPct}%`, 120, y + 45);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#888";
  ctx.fillText("calories", 120, y + 65);
  ctx.fillText(`${data.calories.consumed}/${data.calories.target}`, 120, y + 80);

  // Protein
  ctx.fillStyle = "#5C6BC0";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillText(`${data.protein.consumed}g`, 300, y + 35);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#888";
  ctx.fillText(`protein (${Math.round((data.protein.consumed / data.protein.target) * 100)}%)`, 300, y + 55);

  // Water
  ctx.fillStyle = "#2196F3";
  ctx.font = "bold 28px system-ui, sans-serif";
  ctx.fillText(`${(data.waterMl / 1000).toFixed(1)}L`, 480, y + 35);
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillStyle = "#888";
  ctx.fillText("water", 480, y + 55);

  // Bottom stats row
  ctx.textAlign = "left";
  const by = 290;

  if (data.streak > 0) {
    ctx.fillStyle = "#FF6D00";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`🔥 ${data.streak} day streak`, 50, by);
  }

  if (data.weightLost > 0) {
    ctx.fillStyle = "#4CAF50";
    ctx.font = "bold 18px system-ui, sans-serif";
    ctx.fillText(`⬇️ ${data.weightLost.toFixed(1)} kg lost`, 280, by);
  }

  // Footer
  ctx.fillStyle = "#AAA";
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Track your diet free → dietwise-guide.vercel.app", 300, 350);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, "image/png");
  });
}

/** Share via Web Share API or WhatsApp fallback */
export async function shareProgress(data: ShareData) {
  const text = generateShareText(data);

  // Try Web Share API with image
  if (navigator.share) {
    try {
      const blob = await generateProgressCard(data);
      const file = new File([blob], "dietwise-progress.png", { type: "image/png" });
      await navigator.share({
        text,
        files: [file],
      });
      return;
    } catch {
      // Fallback to text-only share
      try {
        await navigator.share({ text });
        return;
      } catch {
        // User cancelled or API not available
      }
    }
  }

  // WhatsApp fallback
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, "_blank");
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
