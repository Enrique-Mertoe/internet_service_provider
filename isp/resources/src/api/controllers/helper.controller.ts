export type QueryData<T> = {
    single: () => T | null,
    all: () => T[]
}

export function filtered<T>(data: T[] | null): QueryData<T> {
    return {
        single: function (): T | null {
            return data?.[0] ?? null
        },
        all: function (): T[] {
            return data ?? []
        }
    }
}