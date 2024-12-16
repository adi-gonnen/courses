import axios from 'axios'
import {UpdateExerciseInput, ExerciseInput} from './moduls'

export const fetchDays = async() => {
  try {
    const url = '/api/courses/'
    const response = await axios.get(url);
    const courseList = []
    for (const course of response.data) {
      console.log("course", course)
      const courseUrl = `${url}/${course.uuid}`
      const res = await axios.get(courseUrl)
      courseList.push(res.data)
    }
    console.log('service', courseList[0] )
    return courseList[0]  // in this case, got 1 item
  } catch (error) {
    console.error('Error fetching days:', error);
    return null
  }
}

export const fetchExercises = async() => {
  try {
    const url = '/api/exercises/'
    const response = await axios.get(url);
    return response.data
  } catch(error) {
    console.error('Error fetching exercises:', error);
  }
}

export const updateCourse = async(courseId: string, data: UpdateExerciseInput) => {
  try {
    const url = `/api/courses/${courseId}/exercises/`
    const response = await axios.put(url, data)
    return response
  } catch(error) {
    console.error('Error update exercise:', error);
  }
}
export const mapExercises = (exercises: ExerciseInput[]) => {
  return exercises?.map((exercise: ExerciseInput) => {
    const url = exercise.video_url.split(".");
    url.splice(url.length - 1, 1, "jpg");
    return { ...exercise, img: url.join(".") };
  });
};