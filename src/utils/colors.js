// utils/colors.js
export function generateColors(count, darkMode = false) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(
      darkMode
        ? `hsl(${hue}, 70%, 40%)` // lebih gelap untuk dark mode
        : `hsl(${hue}, 70%, 60%)` // lebih cerah untuk light mode
    );
  }
  return colors;
}
