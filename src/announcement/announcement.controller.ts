import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
} from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Controller('announcement')
export class AnnouncementController {
    constructor(private readonly announcementService: AnnouncementService) {}

    @Post()
    create(@Body() createannouncementDto: CreateAnnouncementDto) {
        return this.announcementService.create(createannouncementDto);
    }

    @Get()
    findAll(@Query('admin') admin: string, @Request() req) {
        return this.announcementService.findAll(admin, req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.announcementService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateannouncementDto: UpdateAnnouncementDto,
    ) {
        return this.announcementService.update(+id, updateannouncementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.announcementService.remove(+id);
    }
}
