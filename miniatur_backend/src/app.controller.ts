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
import { User as UserModel, Product as ProductModel, Prisma } from '@prisma/client'

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
}