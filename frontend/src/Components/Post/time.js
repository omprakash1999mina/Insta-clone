export const time = (seconds) => {
    if (seconds < 60) {
        return "Just Now"
    } else if (seconds >= 60 && seconds < 3600) {
        return Math.floor(seconds / 60) + " minutes ago"
    } else if (seconds >= 3600 && seconds < 86400) {
        return Math.floor(seconds / 3600) + " hours ago"
    } else if (seconds >= 86400 && seconds < 30 * 86400) {
        return Math.floor(seconds / 86400) + " days ago"
    } else if (seconds >= 30 * 86400 && seconds < 365 * 86400) {
        return Math.floor(seconds / (86400 * 30)) + " month ago"
    } else {
        return Math.floor(seconds / (365 * 86400)) + " years ago"
    }
}