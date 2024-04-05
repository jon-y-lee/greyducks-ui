export interface Event {
    status: string,
    start: EventDateTime,
    end: EventDateTime,
    summary: string,
    recurrence: string,
    description: string
}

export interface EventDateTime {
    dateTime: string,
    timeZone: string
}