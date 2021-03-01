
export const arquivoDateToDate = (arquivoDate: string) => {
    const date = new Date()
    const arquivoDateNum: number = Number(arquivoDate)

    const year = Math.floor(arquivoDateNum / Math.pow(10, 10))

    date.setFullYear(year)
    date.setMonth(Math.floor(arquivoDateNum / Math.pow(10, 8)) % Math.pow(10, 2) - 1)
    date.setDate(Math.floor(arquivoDateNum / Math.pow(10, 6)) % Math.pow(10, 2))
    date.setHours(Math.floor(arquivoDateNum / Math.pow(10, 4)) % Math.pow(10, 2))
    date.setMinutes(Math.floor(arquivoDateNum / Math.pow(10, 2)) % Math.pow(10, 2))
    date.setSeconds(Math.floor(arquivoDateNum % Math.pow(10, 2)))

    return date
}

export const getYearFromTimestamp = (timestamp: string): number => {
    const timestampNum: number = Number(timestamp)
    return Math.floor(timestampNum / Math.pow(10, 10))
}
