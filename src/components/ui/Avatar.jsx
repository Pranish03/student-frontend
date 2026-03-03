export function Avatar({ name, id, size = 40 }) {
  const bgColor = stringToColor(id);

  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor,
      }}
      className="rounded-full flex items-center justify-center text-white font-semibold"
    >
      {getInitials(name)}
    </div>
  );
}

function stringToColor(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

function getInitials(name) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();

  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}
