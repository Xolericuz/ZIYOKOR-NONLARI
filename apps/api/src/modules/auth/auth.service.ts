import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'customer' | 'seller' | 'driver' | 'admin';
  createdAt: Date;
}

interface RegisterDto {
  name: string;
  phone: string;
  password: string;
  role: 'customer' | 'seller' | 'driver' | 'admin';
}

interface LoginDto {
  phone: string;
  password: string;
}

const users: User[] = [
  {
    id: 'admin-1',
    name: 'Admin',
    phone: '+998901234567',
    password: '$2b$10$dummy',
    role: 'admin',
    createdAt: new Date(),
  },
];

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = users.find((u) => u.phone === dto.phone);
    if (existing) {
      throw new ConflictException('User with this phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user: User = {
      id: `user-${Date.now()}`,
      name: dto.name,
      phone: dto.phone,
      password: hashedPassword,
      role: dto.role,
      createdAt: new Date(),
    };

    users.push(user);

    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = users.find((u) => u.phone === dto.phone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
      token,
    };
  }

  findById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  }

  getAllUsers(): User[] {
    return users.map((u) => ({
      ...u,
      password: undefined,
    })) as unknown as User[];
  }
}
