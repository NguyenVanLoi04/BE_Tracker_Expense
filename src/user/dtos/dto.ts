import { IsEmail } from 'class-validator';
import { IsValidText } from '../../common/decorators/custom-validator.decorator';

export class GetListUserDto {
  @IsValidText({ required: false })
  name?: string;

  @IsValidText({ required: false })
  @IsEmail()
  email?: string;
}
