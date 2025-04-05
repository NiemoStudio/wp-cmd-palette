import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface SettingsCardProps {
  children: ReactNode;
  description: string;
  title: string;
}

export function SettingsCard({ children, description, title }: SettingsCardProps) {
  return (
    <Card className="border-none rounded-lg">
      <CardHeader className="border-b border-border">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
} 
