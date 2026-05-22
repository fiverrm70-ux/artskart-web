import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  comparePrice?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsString()
  artworkSize?: string;

  @IsOptional()
  @IsString()
  artworkMaterial?: string;

  @IsOptional()
  @IsString()
  printQuality?: string;

  @IsOptional()
  @IsString()
  packaging?: string;

  @IsOptional()
  @IsString()
  productStory?: string;

  @IsOptional()
  @IsString()
  detailStyle?: string;

  @IsOptional()
  @IsString()
  detailTheme?: string;

  @IsOptional()
  @IsString()
  detailSize?: string;

  @IsOptional()
  @IsString()
  detailMaterial?: string;

  @IsOptional()
  @IsString()
  craftMaterials?: string;

  @IsOptional()
  @IsString()
  certificatePoints?: string;

  @IsOptional()
  @IsString()
  careGuidance?: string;

  @IsOptional()
  @IsString()
  framingSupport?: string;

  @IsOptional()
  @IsString()
  serviceNotes?: string;

  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
