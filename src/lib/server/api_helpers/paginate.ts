export default function paginate<T>(data: T[]): Map<string, T[]> {
    let finalData: Map<string, T[]> = new Map()
    let i = 1;
    while (data.length > 5) {
        finalData.set(`${i}`, data.splice(0, 5))
        i++
    }
    finalData.set(`${i}`, data)
    return finalData
} 