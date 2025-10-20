import config from '../config';
import { USER_ROLE } from '../modules/user/user_interface';
import { User } from '../modules/user/user_schema_model';

const super_admin = {
  id: 'super_admin_001',
  email: config.super_admin_email,
  password: config.super_admin_password,
  needPasswordChange: false,
  role: USER_ROLE.super_admin,
  status: 'in_progress',
  isDeleted: false,
};

export const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExists = await User.findOne({
    role: USER_ROLE.super_admin,
  });
  if (!isSuperAdminExists) {
    await User.create(super_admin);
  }
};
