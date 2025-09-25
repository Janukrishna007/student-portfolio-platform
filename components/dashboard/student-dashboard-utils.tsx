// Utility components for Enhanced Student Dashboard

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, BookOpen, Briefcase } from "lucide-react";

export function AchievementRow({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#925FE2]"></span>
      <span>{text}</span>
    </li>
  );
}

export function CategoryCard({ icon: Icon, title, description }: { 
  icon: React.ComponentType<any>; 
  title: string; 
  description: string; 
}) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6 text-center">
        <Icon className="w-8 h-8 mx-auto mb-3" style={{ color: '#925FE2' }} />
        <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}