'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  hasData: boolean;
  fallback?: string;
}

export default function ChartCard({ title, children, hasData, fallback = 'No data available' }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? <div className="h-[300px]">{children}</div> : (
          <p className="text-sm text-muted-foreground">{fallback}</p>
        )}
      </CardContent>
    </Card>
  );
}
