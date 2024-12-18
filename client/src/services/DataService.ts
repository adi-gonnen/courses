import axios from 'axios'
import { UpdateExerciseInput, ExerciseInput } from './moduls'

export const fetchDays = async() => {
  try {
    const url = '/api/courses/'
    const response = await axios.get(url);
    const courseList = []
    for (const course of response.data) {
      const courseUrl = `${url}/${course.uuid}`
      const res = await axios.get(courseUrl)
      courseList.push(res.data)
    }
    return courseList 
  } catch (error) {
    console.error('Error fetching days:', error);
    return {error}
  }
}

export const fetchExercises = async() => {
  try {
    const url = '/api/exercises/'
    const response = await axios.get(url);
    return response.data
  } catch(error) {
    console.error('Error fetching exercises:', error);
    return {error}
  }
}

export const updateCourse = async(courseId: string, data: UpdateExerciseInput) => {
  try {
    const url = `/courses/${courseId}/exercises/`
    const response = await axios.put(url, data)
    return response
  } catch(error) {
    console.error('Error update exercise:', error);
    return {error}
  }
}

// add image url ends with jpg
export const mapExercises = (exercises: ExerciseInput[]) => {
  return exercises?.map((exercise: ExerciseInput) => {
    const url = exercise.video_url.split(".");
    url.splice(url.length - 1, 1, "jpg");
    return { ...exercise, img: url.join(".") };
  });
};