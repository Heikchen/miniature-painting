import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { User as UserModel, Product as ProductModel, Wishlist as WishlistModel } from '@prisma/client'
import { userInfo } from 'os'


@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

//User Endpoints
  @Get('users')
  async getAllUsers(
    @Query('take') take?: number,
    @Query('skip') skip?: number): Promise<UserModel[]> {
    return this.prismaService.user.findMany({
      take: Number(take) || undefined,
      skip: Number(skip) || undefined
    })
  }
    @Get('user/:id')
  async getUser(@Param('id') id: String): Promise<UserModel> {
    return this.prismaService.user.findUnique({
      where: { id: Number(id) }
    })
  }

  @Post('signup')
  async signupUser(
    @Body()
    userData: {
      first_name: string
      last_name: string
      email: string
      password: string
      user_name: string   
    },
  ): Promise<UserModel> {
    
    return this.prismaService.user.create({
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        user_name: userData.user_name
      },
    })
  }

  @Put('user/:id')
 async UpdateUser(@Param('id') id: string ,@Body()userData: {
      first_name: string
      last_name: string
      email: string
      password: string
      user_name: string
      image:string
      about:string
      
    },): Promise<UserModel>{
    return this.prismaService.user.update({
      where: { id: Number(id) },
      data: {
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password: userData.password,
        user_name: userData.user_name,
        image: userData.image,
        about: userData.about
        } 
    })
 }

 @Delete('user/:id')
 async DeleteUser(@Param ('id') id: String): Promise<UserModel>{
  return this.prismaService.user.delete({where: {id: Number(id)}})
 }

//Product Endpoint
@Get('products')
async GetAllProducts(
    @Query('take') take?: number,
    @Query('skip') skip?: number,
    @Query('searchString') searchString?: string,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
    ): Promise<ProductModel[]>{
      const or = searchString ? {
      OR: [
        { name: { contains: searchString } },
        { brand: { contains: searchString } },
        {color:{contains: searchString}}
      ],} : {}
      return this.prismaService.product.findMany({
      where: {...or},
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        name: orderBy,
        brand: orderBy,
        color: orderBy
      }
    })
}
@Post('product')
async CreateProduct(@Body() productData:{
  categorie: string  
	brand:string       
	name:string       
	color:string       
	description: string
	link: string       
}): Promise<ProductModel>{
  return this.prismaService.product.create({
      data: {
        categorie: productData.categorie,
        brand: productData.brand,
        name: productData.name,
        color: productData.color,
        description: productData.description,
        link: productData.link
      }
    })
}
@Get('product/:id')
  async GetProduct(@Param('id') id: string): Promise<ProductModel> {
    return this.prismaService.product.findUnique({
      where: { id: Number(id) }
    })
  }

@Put('product/:id')
 async UpdateProduct(@Param('id') id: string ,@Body()productData: {
    categorie: string  
	  brand:string       
	  name:string       
	  color:string       
	  description: string
	  link: string  
      
    },): Promise<ProductModel>{
    return this.prismaService.product.update({
      where: { id: Number(id) },
        data: {
          categorie: productData.categorie,
          brand: productData.brand,
          name: productData.name,
          color: productData.color,
          description: productData.description,
          link: productData.link
        } 
    })
 }
 @Delete('product/:id')
 async DeleteProduct(@Param ('id') id: String): Promise<ProductModel>{
  return this.prismaService.product.delete({where: {id: Number(id)}})
 }

@Post(':user_id/wishlist')
async CreateWishlist(@Param('user_id')user_id:String, @Body() wishlistData:{
  name: string
}):Promise<WishlistModel>{
  const { name} = wishlistData
return this.prismaService.wishlist.create({
      data: {
        name, 
        user:{
          connect:{
            id:Number(user_id)
          }
        }
        }
      })
    } 

@Get(':user_id/wishlist')
async GetAllWishlists(@Param('user_id') user_id: String):Promise<WishlistModel[]>{
  return this.prismaService.wishlist.findMany({
    where: {user_id: Number(user_id)}
  })
}
@Get(':user_id/wishlist/:id')
async GetWishlist(@Param('user_id')user_id: String,@Param('id') id: String):Promise<WishlistModel>{
return this.prismaService.wishlist.findFirst({
  where: {AND:[
 { id: Number(id)}, 
 {user_id: Number(user_id)}
  ]}
})
}


@Delete('wishlist/:id')
async DeleteWishlist(@Param('id') id: String):Promise<WishlistModel>{
  return this.prismaService.wishlist.delete({
  where: { id: Number(id)}
  })
}
@Put('wishlist/:id')
async UpdateWishlist(@Param('id') id: String, @Body() updateData:{
  name: string
}): Promise<WishlistModel>{
  return this.prismaService.wishlist.update({
    where:{id: Number(id)},
    data:{
      name: updateData.name
    }
  })
}
}