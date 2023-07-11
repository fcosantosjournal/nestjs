import { Body, Controller, Delete, Patch, Get, Param, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { response } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) {}

    /* @Get('/whoami')
    whoAmI(@Session() session: any) {
        return this.usersService.findOne(session.userId);
    } */
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    @UseGuards(AuthGuard)
    signout(@Session() session: any) {
        session.userId = null;
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    findUser(@Param('id') id: string) {
        return this.usersService.checkUserById(parseInt(id));
    }

    @Get()
    @UseGuards(AuthGuard)
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }
    
    @Get('/like/:email')
    @UseGuards(AuthGuard)
    findAllUsersLike(@Param('email') email: string) {
        return this.usersService.findUsersLike(email);
    }

    @Get('/limit/:limit')
    @UseGuards(AuthGuard)
    findAllUsersLimit(@Param('limit') limit: string) {
        return this.usersService.findLimit(parseInt(limit));
    }

    @Get('/pagination/:page')
    @UseGuards(AuthGuard)
    findAllUsersPagination(@Param('page') page: string) {
        return this.usersService.findPagination(parseInt(page));
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }
}
