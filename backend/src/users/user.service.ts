import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, AccountStatus } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    // Creates a new user in the database.
    async create(data: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    // Get all users (without password because of select: false)
    async findAll(): Promise<User[]> {
        return this.usersRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    // To see if user already exists
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    // Finds a user by email, but explicitly includes the password.
    // Used by the 'login' logic to verify credentials.
    async findWithPasswordByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'role', 'status', 'createdAt', 'updatedAt'],
        });
    }

    // Normal find by ID (no password / no refresh token)
    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    // Find by ID including hashedRefreshToken (for refresh flow)
    async findByIdWithRefreshToken(id: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'email', 'hashedRefreshToken', 'createdAt', 'updatedAt'],
        });
    }

    // Strict find: throws 404 if not found
    async getOrFail(id: string): Promise<User> {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException(`User with id "${id}" not found`);
        return user;
    }

    /**
     * Updates the user's hashed refresh token.
     * Used by the 'login' and 'refresh' logic.
     */
    async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
        return this.usersRepository.update(userId, { hashedRefreshToken });
    }

    /**
     * Update basic user data (username, email, password, etc.)
     * Used by UserController PATCH /users/:id
     */
    async update(id: string, data: UpdateUserDto): Promise<User> {
        const user = await this.getOrFail(id);

        const merged = this.usersRepository.merge(user, data);
        return this.usersRepository.save(merged);
    }

    /**
     * Update role (admin/user/moderator).
     * Used by PATCH /users/:id/role
     */
    async updateRole(id: string, { role }: UpdateUserRoleDto): Promise<User> {
        const user = await this.getOrFail(id);
        user.role = role as UserRole;
        return this.usersRepository.save(user);
    }

    /**
     * Update account status (active/suspended/pending).
     * Used by PATCH /users/:id/status
     */
    async updateStatus(id: string, { status }: UpdateUserStatusDto): Promise<User> {
        const user = await this.getOrFail(id);
        user.status = status as AccountStatus;
        return this.usersRepository.save(user);
    }

    /**
     * Delete a user.
     * Used by DELETE /users/:id
     */
    async remove(id: string): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with id "${id}" not found`);
        }
    }
}
