// Function to get initials from name & convert to uppercase
export const getInitials = (name: string, maxLetters = 2) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials.slice(0, maxLetters);
};
