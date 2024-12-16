
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

export interface UpdateBody {
    day_number: number,
    exercise_uuid: string,
    insert: boolean,
    order_in_day: number
}