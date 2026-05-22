import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException('Product slug already exists');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        shortDescription: dto.shortDescription,
        imageUrl: dto.imageUrl,
        price: dto.price,
        comparePrice: dto.comparePrice,
        stock: dto.stock ?? 0,
        sku: dto.sku,
        isFeatured: dto.isFeatured ?? false,
        isActive: dto.isActive ?? true,
        categoryId: dto.categoryId,

        artworkSize: dto.artworkSize,
        artworkMaterial: dto.artworkMaterial,
        printQuality: dto.printQuality,
        packaging: dto.packaging,
        productStory: dto.productStory,
        detailStyle: dto.detailStyle,
        detailTheme: dto.detailTheme,
        detailSize: dto.detailSize,
        detailMaterial: dto.detailMaterial,
        craftMaterials: dto.craftMaterials,
        certificatePoints: dto.certificatePoints,
        careGuidance: dto.careGuidance,
        framingSupport: dto.framingSupport,
        serviceNotes: dto.serviceNotes,
        reviewNotes: dto.reviewNotes,
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async getProductImages(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async addProductImage(productId: string, dto: CreateProductImageDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return this.prisma.productImage.create({
      data: {
        productId,
        imageUrl: dto.imageUrl,
        altText: dto.altText,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }
}
