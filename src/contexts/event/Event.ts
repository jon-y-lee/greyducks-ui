export interface Event {
    id?: string,
    status: string,
    start: EventDateTime,
    end: EventDateTime,
    summary: string,
    recurrence: string,
    description: string
    colorId: number
}

export interface EventDateTime {
    dateTime: string,
    timeZone: string
}