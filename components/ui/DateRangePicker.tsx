'use client'

import * as React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { DateRange, DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(value);

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);
    onChange(selected);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[250px] justify-start text-left font-normal',
            !range && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range?.from ? (
            range.to ? (
              <>
                {format(range.from, 'LLL dd, y')} - {format(range.to, 'LLL dd, y')}
              </>
            ) : (
              format(range.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-0" align="start">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
