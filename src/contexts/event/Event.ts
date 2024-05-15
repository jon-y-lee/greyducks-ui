export interface Event {
    id?: string,
    status: string,
    start: EventDateTime,
    end: EventDateTime,
    summary: string,
    recurrence: string,
    description: string
    colorId: number,
    assigneeId: string,
    assigneeColor: string,
    assigneeInitials: string,
}

export interface EventDateTime {
    dateTime: string,
    timeZone: string
}