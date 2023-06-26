import { BASE_URL, HttpResponse, HttpStatus } from "./default";

export const CategoryAPI = {
  getCategoriesByCourse,
  updateCourseCategoriesOrder,
  updateCategory,
  deleteCategory,
  createCategory
}

function isAIntegerArray(arr) {
  return Array.isArray(arr) && arr.every(i => typeof i === 'number');
}

async function getCategoriesByCourse (courseId) {
  try {
    const url = `${BASE_URL}/courses/categories/course/${courseId}?depth=1`

    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      if(data.categories && data.order && isAIntegerArray(data.order))
        data.categories.sort((x, y) => data.order.indexOf(x.id) - data.order.indexOf(y.id));
      else throw new Error("CategoryAPI::getCategoryByCourse() on categories or order: ", data);

      return new HttpResponse(HttpStatus.OK, data)
    }

    throw new Error("CategoryAPI::getCategoryByCourse()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

async function updateCourseCategoriesOrder (courseId, categoriesOrder) {


  try {
    if(!isAIntegerArray(categoriesOrder)) throw new Error('CategoryAPI::updateCourseCategoriesOrder():categoriesOrder is not a interger array: ', categoriesOrder);
    const body = {
      'categories_order': JSON.stringify(categoriesOrder)
    }

    console.log('body: ', body)

    const url = `${BASE_URL}/courses/courses/${courseId}`;
    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return new HttpResponse(HttpStatus.OK, data);
    }
    throw new Error("CategoryAPI::updateCourse()");
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
};


async function updateCategory (categoryId, body) {
  try {
    if(typeof body != 'object') throw new Error('CategoryAPI::updateCategory():body is not a object: ', body);

    const url = `${BASE_URL}/courses/categories/${categoryId}`;

    const options = {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return new HttpResponse(HttpStatus.OK, data);
    }
    throw new Error("CategoryAPI::updateCategory()");
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
};

async function deleteCategory (categoryId) {
  try {
    const url = `${BASE_URL}/courses/categories/${categoryId}`
    const options = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }
    const response = await fetch(url, options)
    if (response.ok)
      return new HttpResponse(HttpStatus.OK, null)
    throw new Error("CategoryAPI::deleteCategory()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}

async function createCategory (courseId, categoryName) {
  try {
    const url = `${BASE_URL}/courses/categories`

    const body = {
      name: categoryName,
      course: courseId,
      lessons_order: []
    }

    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      return new HttpResponse(HttpStatus.OK, data)
    }
    throw new Error("CategoryAPI::createCategory()")
  } catch (error) {
    console.warn(error);
    return new HttpResponse(HttpStatus.ERROR, null);
  }
}