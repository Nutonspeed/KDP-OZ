'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  hasData: boolean;
  fallback?: string;
}

export default function ChartPanel({ title, children, actions, hasData, fallback = 'No data available' }: ChartPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {actions}
      </CardHeader>
      <CardContent>
        {hasData ? <div className="h-[350px]">{children}</div> : (
          <p className="text-sm text-muted-foreground">{fallback}</p>
        )}
      </CardContent>
    </Card>
  );
}
