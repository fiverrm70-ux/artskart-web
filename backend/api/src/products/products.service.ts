import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';

export type ImportProductDto = CreateProductDto & {
  galleryImages?: string[];
};

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

  async importProducts(items: ImportProductDto[]) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('No products found to import');
    }

    const results = {
      total: items.length,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const [index, item] of items.entries()) {
      try {
        if (!item.title || !item.slug || !item.categoryId || !item.imageUrl) {
          throw new BadRequestException(
            `Row ${index + 2}: title, slug, categoryId and imageUrl are required`,
          );
        }

        const category = await this.prisma.category.findUnique({
          where: { id: item.categoryId },
        });

        if (!category) {
          throw new BadRequestException(
            `Row ${index + 2}: categoryId not found`,
          );
        }

        const existingProduct = await this.prisma.product.findUnique({
          where: { slug: item.slug },
        });

        const productData = {
          title: item.title,
          slug: item.slug,
          description: item.description,
          shortDescription: item.shortDescription,
          imageUrl: item.imageUrl,
          price: Number(item.price),
          comparePrice:
            item.comparePrice !== undefined && item.comparePrice !== null
              ? Number(item.comparePrice)
              : null,
          stock: Number(item.stock ?? 0),
          sku: item.sku,
          isFeatured: item.isFeatured ?? false,
          isActive: item.isActive ?? true,
          categoryId: item.categoryId,

          artworkSize: item.artworkSize,
          artworkMaterial: item.artworkMaterial,
          printQuality: item.printQuality,
          packaging: item.packaging,
          productStory: item.productStory,
          detailStyle: item.detailStyle,
          detailTheme: item.detailTheme,
          detailSize: item.detailSize,
          detailMaterial: item.detailMaterial,
          craftMaterials: item.craftMaterials,
          certificatePoints: item.certificatePoints,
          careGuidance: item.careGuidance,
          framingSupport: item.framingSupport,
          serviceNotes: item.serviceNotes,
          reviewNotes: item.reviewNotes,
        };

        const product = existingProduct
          ? await this.prisma.product.update({
              where: { id: existingProduct.id },
              data: productData,
            })
          : await this.prisma.product.create({
              data: productData,
            });

        if (existingProduct) {
          results.updated += 1;
          await this.prisma.productImage.deleteMany({
            where: { productId: product.id },
          });
        } else {
          results.created += 1;
        }

        const galleryImages = item.galleryImages ?? [];

        if (galleryImages.length > 0) {
          await this.prisma.productImage.createMany({
            data: galleryImages.map((imageUrl, galleryIndex) => ({
              productId: product.id,
              imageUrl,
              altText: item.title,
              sortOrder: galleryIndex + 1,
            })),
          });
        }
      } catch (error) {
        results.failed += 1;
        results.errors.push(
          error instanceof Error
            ? error.message
            : `Row ${index + 2}: Unknown import error`,
        );
      }
    }

    return results;
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
