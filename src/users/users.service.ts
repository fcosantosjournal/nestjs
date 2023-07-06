import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { json } from 'stream/consumers';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {}

    create( email: string, password: string ) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    findLimit(limit: number) {
        return this.repo.find({ order: { id: 'DESC' }, take: limit });
    }

    findUsersLike(email: string) {
        const query = this.repo.createQueryBuilder('user');
        query.where('user.email LIKE :email', { email: `%${email}%` });
        return query.getMany();
    }

    findPagination(page: number) {
        const take = 2;
        const skip = (page - 1) * take;
        return this.repo.find({ order: { id: 'DESC' }, take, skip });
    }

    async checkUserById (id: number) {
        const user = await this.findOne(id);
        if (!user) {
            const response = {"Response": "user not found"};
            return JSON.stringify(response);
        }
        return user;
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            const response = {"Response": "user not found"};
            return JSON.stringify(response);
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            const response = {"Response": "user not found"};
            return JSON.stringify(response);
        }
        return this.repo.remove(user);
    }
}
