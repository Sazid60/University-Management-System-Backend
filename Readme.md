# University Management System Part-5

### What We Will Learn Here?

1. Course and PreRequisiteCourse
2. Dynamically Update Course with PreRequisite Course
3. Faculty With Course Relation
4. Semester Registration
5. Business Logic Validation

![alt text](<WhatsApp Image 2025-04-07 at 16.10.58_05f57a85.jpg>)
![alt text](<WhatsApp Image 2025-04-07 at 16.11.56_34de699f.jpg>)

- FindOne will be used for others fields
- FindById will be used when mongoose id used to find
  ![alt text](<WhatsApp Image 2025-04-07 at 16.13.25_2df4a0b8.jpg>)
- Where There is mongodb Id We will use mongoose id.
- Using Both is right but using same pattern in entire project is required

## 15-2 Create Course Interface and Model

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-4.png)

- We have Kept Model so that we can keep array array of Object and object. or we can keep nested type inside the preRequisiteCourses
  ![alt text](image-5.png)
- We will keep embedding courses fields inside array. but inside the array the data will be referencing data. That means inside a preRequisiteCourse there will be data of the referenced courses data. These are called sub-schema or embedding fields

![alt text](image-6.png)

- For This No Collection Will be created
- Here Id Will be referenced to the course Id since preRequisiteCourse is itself a course
- One Course Might Have many preRequisiteCourses

![alt text](image-7.png)

- id is renamed as Course

### Time To Code

- course.interface.ts

```ts
import { Types } from 'mongoose';

<!-- sub interface  -->
export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};
export type TCourses = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses: [];
};

```

- course.model.ts

```ts
import { model, Schema } from 'mongoose';
import { TCourses, TPreRequisiteCourses } from './course.interface';

// This is a sub Schema
const preRequisiteCourses = new Schema<TPreRequisiteCourses>({
  course: {
    type: Schema.Types.ObjectId,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
// Why Use a Sub-Schema?
// By creating a separate schema for preRequisiteCourses, you gain more flexibility:

// You can add fields like isDeleted, notes, addedBy, etc.

// You can embed more metadata with each prerequisite reference.

// You can still populate the referenced Course data using Mongoose.

const courseSchema = new Schema<TCourses>({
  title: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  prefix: {
    type: String,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    trim: true,
    required: true,
  },
  credits: {
    type: Number,
    trim: true,
    required: true,
  },
  preRequisiteCourses: [preRequisiteCourses],
  // array of the preRequisite Courses
});

export const Course = model<TCourses>('Course', courseSchema);
```

- we have to go inside preRequisiteCourses and populate the filed Course.find().populate('preRequisiteCourses.course'),

- course.services.ts

```ts
import QueryBuilder from '../../../builder/QueryBuilder';
import { courseSearchableFields } from './course.constants';
import { TCourses } from './course.interface';
import { Course } from './course.model';

const createCourseIntoDB = async (payload: TCourses) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};
const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id);
  return result;
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  deleteCourseFromDB,
};
```

- course.controller.ts

```ts
import status from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import { CourseServices } from './course.services';
import sendResponse from '../../../utils/sendResponse';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is created successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course are retrieved successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getSingleCourse,
  getAllCourses,
  deleteCourse,
};
```

## Dynamically Updating Multiple Fields

![alt text](<WhatsApp Image 2025-04-09 at 11.11.57_ac084e10.jpg>)

![alt text](<WhatsApp Image 2025-04-09 at 11.13.54_3975c1bb.jpg>)

- First Of All we will separate prerequisite updates and regular info updates. both will be done sedately.

  ![alt text](<WhatsApp Image 2025-04-09 at 11.16.35_5cc6ab00.jpg>)

![alt text](<WhatsApp Image 2025-04-09 at 11.37.39_befe64e7.jpg>)

- we have to filter which one will be deleted and which one will be added
- first of all we have to clear the deleted course from the database then we will add

  ![alt text](<WhatsApp Image 2025-04-09 at 11.17.33_414bcf4b.jpg>)

- In zod we can make partial for making all optional

![alt text](<WhatsApp Image 2025-04-09 at 11.39.10_af8953b3.jpg>)
