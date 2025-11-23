import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // POST /users
    @Post()
    create(@Body() dto: CreateUserDto): Promise<User> {
        return this.userService.create(dto);
    }

    // GET /users
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // GET /users/:id
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User> {
        return this.userService.getOrFail(id);
    }

    // PATCH /users/:id
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<User> {
        return this.userService.update(id, dto);
    }

    // PATCH /users/:id/role
    @Patch(':id/role')
    updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto): Promise<User> {
        return this.userService.updateRole(id, dto);
    }

    // PATCH /users/:id/status
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto): Promise<User> {
        return this.userService.updateStatus(id, dto);
    }

    // DELETE /users/:id
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.userService.remove(id);
    }
}
