import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { password, student: studentData } = req.body;

    // const zodParseData = studentValidationSchema.parse(studentData);

    //  will call service function to send this data
    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    //  send response
    res.status(200).json({
      success: true,
      message: 'Student is Created Successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Something Went Wrong',
      error: error,
    });
  }
};

export const UserController = {
  createStudent,
};
