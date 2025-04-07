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
