import { IsString, IsIn, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsIn(['user', 'support'])
  sender: 'user' | 'support';

  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  body: string;
}
