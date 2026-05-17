import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
