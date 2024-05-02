
export interface Task {
    taskListId: String,
    id: String,
    title?: String,
    notes?: String,
    status?: String,
    completed?: String,
    deleted?: String,
    hidden?: Boolean,
    userId?: String
}

export interface TaskList {
    taskListId: string,
    id: string,
    title: string,
    assignedProfileId?: string,
    assignedProfileColor?: string,
    assignedProfileInitial?: string,
}