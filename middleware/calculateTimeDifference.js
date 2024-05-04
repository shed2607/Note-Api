const calculateTimeDifference = (date) => {
  const now = new Date();
  const difference = (now - date) / 1000; // Difference in seconds

  if (difference < 60) {
    return `${Math.floor(difference)} seconds ago`;
  }

  const minutes = Math.floor(difference / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

module.exports = calculateTimeDifference;
