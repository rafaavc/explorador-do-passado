
export const arquivoDateToDate = (arquivoDate: string) => {
    const date = new Date()
    const arquivoDateNum: number = Number(arquivoDate)

    date.setFullYear(Math.floor(arquivoDateNum / Math.pow(10, 10)))
    date.setMonth(Math.floor(arquivoDateNum / Math.pow(10, 8)) % Math.pow(10, 2) - 1)
    date.setDate(Math.floor(arquivoDateNum / Math.pow(10, 6)) % Math.pow(10, 2))
    date.setHours(Math.floor(arquivoDateNum / Math.pow(10, 4)) % Math.pow(10, 2))
    date.setMinutes(Math.floor(arquivoDateNum / Math.pow(10, 2)) % Math.pow(10, 2))
    date.setSeconds(Math.floor(arquivoDateNum % Math.pow(10, 2)))

    return date
}
