import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    //Creates a new user in the database.
    async create(data: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(data);
        return this.usersRepository.save(user);
    }

    //To see if user already exists
    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    // Finds a user by email, but explicitly includes the password.
    // Used by the 'login' logic to verify credentials.
    async findWithPasswordByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'createdAt', 'updatedAt'],
        });
    }

    //Finds a user by their ID.
    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    /**
     * Updates the user's hashed refresh token.
     * Used by the 'login' and 'refresh' logic.
     */
    async updateRefreshToken(userId: string, hashedRefreshToken: string) {
        return this.usersRepository.update(userId, { hashedRefreshToken });
    }
}