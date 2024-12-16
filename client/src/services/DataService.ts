import axios from 'axios'
import {UpdateBody} from './moduls'

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

export const updateCourse = async(data: UpdateBody) => {
  try {
    const url = '/api/courses/e71053e5-f2cb-4961-85a2-4117d7a9e9f7/exercises/'
    const response = await axios.put(url, data)
    return response
  } catch(error) {
    console.error('Error update exercise:', error);
  }
}