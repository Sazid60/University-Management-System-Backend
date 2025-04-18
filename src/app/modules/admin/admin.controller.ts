import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is retrieved successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admins are retrieved successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;

  const adminExists = await Admin.isUserExists(id);
  // console.log(studentExists)
  if (adminExists === null) {
    throw new AppError(status.NOT_FOUND, 'Admin not found');
  }

  const result = await AdminServices.updateAdminIntoDB(id, admin);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;

  const adminExists = await Admin.isUserExists(id);
  // console.log(studentExists)
  if (adminExists === null) {
    throw new AppError(status.NOT_FOUND, 'Admin not found');
  }

  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Admin is deleted successfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
