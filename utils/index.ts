export const getInitials = (name: string, maxLetters = 2) => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, maxLetters)
    .join("")
}
