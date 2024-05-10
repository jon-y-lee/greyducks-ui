
export interface Task {
    taskListId: string,
    id: string,
    title: string,
    notes?: string,
    status?: string,
    completed?: string,
    deleted?: string,
    hidden?: Boolean,
    userId?: string
}

export interface TaskList {
    taskListId: string,
    id: string,
    title: string,
    assignedProfileId?: string,
    assignedProfileColor?: string,
    assignedProfileInitial?: string,
}