export const info = (process, status) => {
    console.info(new Date().toISOString(), `${process}: ${status}`)
}
