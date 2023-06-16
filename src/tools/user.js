const getEnrolledCourseFromUser = (user, courseId) => {
  if(typeof user === 'object' && user.hasOwnProperty('enrolled_courses'))
    return user.enrolled_courses.find((c) => c.id === courseId) ?? null;
  else
    console.warn("tools::user::getEnrolledCourseFromUser - usuário não possui propriedade 'enrolled_courses'");

  return null;
}

export const UserTools = {
  getEnrolledCourseFromUser
}