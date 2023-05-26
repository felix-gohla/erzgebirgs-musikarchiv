export const secondsToTimeString = (seconds: number): string => {
  if (Number.isNaN(seconds)) {
    return '--:--';
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = Math.floor(seconds % 60);


  const minutesString = minutes < 10 ? `0${minutes}`: `${minutes}`;
  const secondsString = restSeconds < 10 ? `0${restSeconds}`: `${restSeconds}`;
  return `${minutesString}:${secondsString}`;
};
