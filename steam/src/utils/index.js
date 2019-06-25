function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date, detail, type) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join(type)
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return detail ? `${t1} ${t2}` : t1
}

export default {
  formatNumber,
  formatTime
}
