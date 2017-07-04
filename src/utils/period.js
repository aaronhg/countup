export function format(p) {
    let sign = p >= 0 ? "+" : "-"
    p = Math.abs(p)
    let h = Math.floor(p / 3600)
    let m = Math.floor((p % 3600) / 60)
    let s = Math.floor(p % 60)
    let str = ""
    if (h)
        str += h + "h"
    if (m)
        str += m + "m"
    if (s)
        str += s + "s"
    if (!str)
        str = "0s"
    return sign + str
}