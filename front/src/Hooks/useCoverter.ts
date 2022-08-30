const SECONDS_IN_MINUTE = 60
const MAX_PERCENTAGE = 100

export default function useConverter() {
  const covertSecondsToTime = (seconds: number) => {
    let minutes = Math.floor(seconds / SECONDS_IN_MINUTE)
    let sec = Math.floor(seconds - minutes * SECONDS_IN_MINUTE)

    return typeof seconds === 'number' && !isNaN(sec) ? `${minutes}:${sec < 10 ? '0' + sec : sec}` : '--:--'
  }

  const getPercentageFromValues = (min: number, max: number) => {
    return (min / max) * MAX_PERCENTAGE
  }

  return { covertSecondsToTime, getPercentageFromValues }
}
