import { Body, Controller, Delete, Patch, Get, Param, Post, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { response } from 'express';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        const newUser = this.usersService.create(body.email, body.password);
        const response = newUser.then(function(result) {
            return JSON.stringify({"id": result.id, "email": result.email});
        });
        return response;
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.checkUserById(parseInt(id));
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }
    
    @Get('/like/:email')
    findAllUsersLike(@Param('email') email: string) {
        return this.usersService.findUsersLike(email);
    }

    @Get('/limit/:limit')
    findAllUsersLimit(@Param('limit') limit: string) {
        return this.usersService.findLimit(parseInt(limit));
    }

    @Get('/pagination/:page')
    findAllUsersPagination(@Param('page') page: string) {
        return this.usersService.findPagination(parseInt(page));
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
