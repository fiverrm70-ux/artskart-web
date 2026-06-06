import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { UploadModule } from './upload/upload.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { AddressModule } from './address/address.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UploadModule,
    WishlistModule,
    CartModule,
    AddressModule,
    OrdersModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
