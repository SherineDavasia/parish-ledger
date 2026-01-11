import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Heart, 
  Cross, 
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRecords } from '@/contexts/RecordsContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { baptismRecords, marriageRecords, deathRecords } = useRecords();

  const stats = [
    {
      title: 'Baptism Records',
      value: baptismRecords.length,
      icon: Droplets,
      color: 'bg-blue-500/10 text-blue-600',
      link: '/baptism',
    },
    {
      title: 'Marriage Records',
      value: marriageRecords.length,
      icon: Heart,
      color: 'bg-pink-500/10 text-pink-600',
      link: '/marriage',
    },
    {
      title: 'Death Records',
      value: deathRecords.length,
      icon: Cross,
      color: 'bg-gray-500/10 text-gray-600',
      link: '/death',
    },
    {
      title: 'Total Records',
      value: baptismRecords.length + marriageRecords.length + deathRecords.length,
      icon: FileText,
      color: 'bg-primary/10 text-primary',
      link: '#',
    },
  ];


  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-foreground">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your church certificate records
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} to={stat.link}>
                <Card 
                  className="hover-lift cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>


        {/* Info Banner */}
        <Card className="bg-primary/5 border-primary/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Certificate Generation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate professional certificates for Baptism, Marriage, and Death records. 
                  Download as PDF or print directly from your browser.
                </p>
              </div>
              <Link to="/baptism">
                <Button variant="outline" className="shrink-0">
                  View Records
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
