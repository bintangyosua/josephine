import { createCanvas, loadImage, Canvas, Image } from "canvas";
import path from "path";
import fs from "fs";

export interface UserData {
  id: string;
  discordId: string;
  username: string;
  level: number;
  xp: number;
  totalXp: number;
  messages: number;
  createdAt: string;
  updatedAt: string;
}

export interface RankingData {
  discordId: string;
  level: number;
  totalXp: number;
  messages: number;
  rank: number;
  username: string;
  score: number;
}

export function convertToRankingData(users: UserData[]): RankingData[] {
  return users.map((user, index) => ({
    discordId: user.discordId,
    level: user.level,
    totalXp: user.totalXp,
    messages: user.messages,
    rank: index + 1,
    username: user.username,
    score: user.totalXp,
  }));
}

export async function generateRankingImageBuffer(
  data: RankingData[]
): Promise<Buffer> {
  const itemHeight = 40;
  const padding = 5;
  const canvasWidth = 350;
  const canvasHeight = data.length * itemHeight + (data.length + 1) * padding;
  const canvas: Canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "rgba(0, 0, 0, 0)"; // transparan
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Load chat icon with better error handling and path resolution
  let chatIcon: Image | null = null;
  try {
    // Try multiple possible paths to find the chat icon
    const possiblePaths = [
      path.join(__dirname, "../../images/chat.png"),
      path.join(__dirname, "../images/chat.png"),
      path.join(__dirname, "./images/chat.png"),
      path.join(process.cwd(), "images/chat.png"),
      path.join(process.cwd(), "src/images/chat.png"),
    ];

    // Try each path until we find the image
    for (const imagePath of possiblePaths) {
      if (fs.existsSync(imagePath)) {
        chatIcon = await loadImage(imagePath);
        console.log(`Chat icon loaded successfully from: ${imagePath}`);
        break;
      }
    }

    // If icon is still not found, use a fallback approach - create a simple circle
    if (!chatIcon) {
      console.warn(
        "Chat icon not found in any of the expected locations. Creating a fallback icon."
      );
      const iconCanvas = createCanvas(16, 16);
      const iconCtx = iconCanvas.getContext("2d");

      // Draw a message bubble as fallback
      iconCtx.fillStyle = "#99AAB5";
      iconCtx.beginPath();
      iconCtx.arc(8, 8, 7, 0, Math.PI * 2);
      iconCtx.fill();

      // Convert the canvas to a data URL and load it as an image
      const dataURL = iconCanvas.toDataURL("image/png");
      chatIcon = await loadImage(dataURL);
    }
  } catch (error) {
    console.error("Error loading chat icon:", error);
  }

  // Draw each ranking item
  data.forEach((item, index) => {
    const y = index * itemHeight + (index + 1) * padding;

    // Background item
    ctx.fillStyle = "#494C52";
    ctx.beginPath();
    // Use appropriate method based on your canvas version
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(padding, y, canvasWidth - 2 * padding, itemHeight, 5);
    } else {
      // Fallback for older canvas versions that don't have roundRect
      const rectX = padding;
      const rectY = y;
      const rectWidth = canvasWidth - 2 * padding;
      const rectHeight = itemHeight;
      const radius = 15;

      ctx.moveTo(rectX + radius, rectY);
      ctx.lineTo(rectX + rectWidth - radius, rectY);
      ctx.arcTo(
        rectX + rectWidth,
        rectY,
        rectX + rectWidth,
        rectY + radius,
        radius
      );
      ctx.lineTo(rectX + rectWidth, rectY + rectHeight - radius);
      ctx.arcTo(
        rectX + rectWidth,
        rectY + rectHeight,
        rectX + rectWidth - radius,
        rectY + rectHeight,
        radius
      );
      ctx.lineTo(rectX + radius, rectY + rectHeight);
      ctx.arcTo(
        rectX,
        rectY + rectHeight,
        rectX,
        rectY + rectHeight - radius,
        radius
      );
      ctx.lineTo(rectX, rectY + radius);
      ctx.arcTo(rectX, rectY, rectX + radius, rectY, radius);
    }
    ctx.fill();

    // Rank Color based on position
    let rankColor = "#D4AF37"; // Gold for #1
    if (item.rank === 2) rankColor = "#A9A9A9"; // Silver for #2
    else if (item.rank === 3) rankColor = "#CD7F32"; // Bronze for #3
    else if (item.rank > 3) rankColor = "#99AAB5"; // Regular color for others

    // Rank Text
    ctx.fillStyle = rankColor;
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    const rankText = `#${item.rank}`;
    const rankX = padding + 20;
    const rankY = y + itemHeight / 2 + 6; // Center alignment
    ctx.fillText(rankText, rankX, rankY);

    // Username
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px Arial";
    const usernameX = rankX + ctx.measureText(rankText).width + 10;
    ctx.fillText(item.username, usernameX, rankY);

    // Messages + Icon
    if (chatIcon) {
      const iconSize = 20;
      const messagesX = canvasWidth - padding - 10;
      const messagesY = rankY;

      // Draw message count
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "right";
      ctx.font = "bold 14px Arial";
      const messageText = item.messages.toString();
      ctx.fillText(messageText, messagesX, messagesY);

      // Calculate icon position to the left of the message count
      const messageWidth = ctx.measureText(messageText).width;
      const iconX = messagesX - messageWidth - iconSize - 4;
      const iconY = messagesY - iconSize / 2 - 3; // Center align with text

      // Draw the icon
      ctx.drawImage(chatIcon, iconX, iconY, iconSize, iconSize);
    }

    // Optional: Add level or XP information
    ctx.fillStyle = "#99AAB5";
    ctx.textAlign = "left";
    ctx.font = "bold 12px Arial";
    const levelText = `Lvl ${item.level}`;
    const levelX = usernameX + ctx.measureText(item.username).width + 15;
    ctx.fillText(levelText, levelX, rankY);
  });

  return canvas.toBuffer("image/png");
}
