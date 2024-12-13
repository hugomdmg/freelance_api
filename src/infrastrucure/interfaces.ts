export interface Project {
    name: string
    status: string
    link: string
    dates: string[]
    missingPayment: number
    totalPaid: number
    trelloLink: string
}

export interface User {
    username: string
    password: string
    projects: Project[]
    chats: string[]
}

