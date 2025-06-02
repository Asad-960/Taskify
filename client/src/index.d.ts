type Register = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
}

type Login = {
    email: string,
    password: string
}

type TabProps = {
    active? : string
}

type Category = {
    name: string,
    color: string
}

type TaskRequest = {
    title: string,
    categoryName?: string,
    priority: string,
    description: string,
    dueDate: string | number
}
type TaskResponse = {
    title: string,
    categoryName?: string,
    priority: string,
    description: string,
    dueDate: string | number
    id: string
    color?: string | null
}
type TaskMap = {
    [key: string]: TaskResponse[]
}

type CategoryData = {
    name: string | null,
    color: string | null,
    id: string
}