import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { DriverService } from './driver.service';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius: string,
  ) {
    return this.driverService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius || '5000'),
    );
  }

  @Patch(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body() dto: { lat: number; lng: number },
  ) {
    return this.driverService.updateLocation(id, dto.lat, dto.lng);
  }
}
