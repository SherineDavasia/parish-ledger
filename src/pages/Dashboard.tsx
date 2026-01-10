import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Heart, 
  Cross, 
  Plus, 
  FileText, 
  TrendingUp,
  Calendar,
  Users
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

  const quickActions = [
    { label: 'New Baptism', icon: Droplets, link: '/baptism?action=add', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'New Marriage', icon: Heart, link: '/marriage?action=add', color: 'bg-pink-500 hover:bg-pink-600' },
    { label: 'New Death Record', icon: Cross, link: '/death?action=add', color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  // Get recent activity (last 5 records across all types)
  const allRecords = [
    ...baptismRecords.map(r => ({ ...r, recordType: 'Baptism' as const })),
    ...marriageRecords.map(r => ({ ...r, recordType: 'Marriage' as const })),
    ...deathRecords.map(r => ({ ...r, recordType: 'Death' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getRecordName = (record: typeof allRecords[0]) => {
    if (record.recordType === 'Marriage') {
      return `${(record as any).groomName} & ${(record as any).brideName}`;
    }
    return (record as any).name;
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'Baptism': return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'Marriage': return <Heart className="h-4 w-4 text-pink-500" />;
      case 'Death': return <Cross className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} to={action.link}>
                    <Button
                      className={`w-full justify-start gap-3 ${action.color} text-white`}
                    >
                      <Icon className="h-5 w-5" />
                      {action.label}
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allRecords.length > 0 ? (
                <div className="space-y-4">
                  {allRecords.map((record, index) => (
                    <div
                      key={`${record.recordType}-${record.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="p-2 rounded-full bg-background">
                        {getRecordIcon(record.recordType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{getRecordName(record)}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.recordType} Record
                        </p>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(record.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No records yet. Start by adding your first record!</p>
                </div>
              )}
            </CardContent>
          </Card>
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
