import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt} from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signup(email: string, password: string){
        //Email is in Use?
        const users = await this.usersService.find(email);
        if(users.length) {
            throw new BadRequestException('Email in use');
        }

        //Create a new key to hash the password
        const key = randomBytes(8).toString('hex');

        //Using the key to hash crypt the password
        const hash = (await scrypt(password, key, 32)) as Buffer;

        //Create one Final word, concatening the password and the key
        const finalPassword = key + '.' + hash.toString('hex');

        //Create a user
        const user = await this.usersService.create(email, finalPassword);

        //Return the user 
        return user;
    }

    async signin(email: string, password: string){
        
        const [user] = await this.usersService.find(email);
        if(!user){
            throw new NotFoundException('User not found');
        }

        //Split the password and key to rebuild the password and check the result
        const [key, storedHash] = user.password.split('.');

        //Rebuild the password using the key
        const hash = (await scrypt(password, key, 32)) as Buffer;

        //Comparation between the storedHash and the rebuilding proccess
        if(storedHash !== hash.toString('hex')) {
            throw new BadRequestException('User or password wrong');
        }

        return user;

    }
}