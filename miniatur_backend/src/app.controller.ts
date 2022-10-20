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
import { User as UserModel, Prisma } from '@prisma/client'

@Controller()
export class AppController {
  constructor(private readonly prismaService: PrismaService) {}

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
 
}