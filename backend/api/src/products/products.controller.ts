import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ImportProductDto, ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post('import')
  importProducts(@Body() products: ImportProductDto[]) {
    return this.productsService.importProducts(products);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.productsService.findFeatured();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':productId/images')
  getProductImages(@Param('productId') productId: string) {
    return this.productsService.getProductImages(productId);
  }

  @Post(':productId/images')
  addProductImage(
    @Param('productId') productId: string,
    @Body() dto: CreateProductImageDto,
  ) {
    return this.productsService.addProductImage(productId, dto);
  }
}
