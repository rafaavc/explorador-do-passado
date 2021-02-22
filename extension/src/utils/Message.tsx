interface Message<T=any> {
    type: string,
    content?: T
}

export type { Message }
