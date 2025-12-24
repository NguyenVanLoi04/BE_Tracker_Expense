import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../auth/services/admin.strategy';

export const Admin = () => UseGuards(AdminGuard);
