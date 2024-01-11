import { Controller, Get, Param } from '@nestjs/common';
import { FilterService } from './filter.service';

@Controller('filters')
export class FilterController {
    constructor(private readonly filterService: FilterService) {}

    @Get(':param')
    filter(@Param('param') param: string): Promise<string[] | undefined> {
        return this.filterService.filter(param);
    }
}
