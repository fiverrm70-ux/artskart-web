import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductImageDto {
  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
