
export interface CourseInput {
    days: DaysInput,
    uuid: string;
}

export interface DaysInput {
    [key: number]: ExerciseInput[]
}


export type DayInput = ExerciseInput[]

export interface ExerciseInput {
    uuid: string;
    title: string;
    video_url: string;
    img?: string;
    instructions: string[]
}

export interface UpdateExerciseInput {
    day_number: number,
    exercise_uuid: string,
    insert: boolean,
    order_in_day: number
}

export interface SearchInput {
    search:string,
    idx: number
}

export interface OpenInput {
    id?: string,
    exerciseIdx: string;
    dayIdx: string
}

export enum Status {
    COURSE = "course",
    EXERCISES = "exercise",
    UPDATE = "update"
}