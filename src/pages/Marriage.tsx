import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Search, FileText, Trash2, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useRecords } from '@/contexts/RecordsContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Marriage() {
  const navigate = useNavigate();
  const { marriageRecords, addMarriageRecord, deleteMarriageRecord, churchSettings } = useRecords();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    groomName: '', groomFatherName: '', groomMotherName: '', groomBaptismName: '',
    brideName: '', brideFatherName: '', brideMotherName: '', brideBaptismName: '',
    dateOfMarriage: ''
  });

  const filteredRecords = marriageRecords.filter(r =>
    r.groomName.toLowerCase().includes(search.toLowerCase()) ||
    r.brideName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groomName || !formData.brideName || !formData.dateOfMarriage) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    addMarriageRecord({ ...formData, dateOfMarriage: new Date(formData.dateOfMarriage) });
    toast({ title: 'Success', description: 'Marriage record added' });
    setFormData({ groomName: '', groomFatherName: '', groomMotherName: '', groomBaptismName: '', brideName: '', brideFatherName: '', brideMotherName: '', brideBaptismName: '', dateOfMarriage: '' });
    setIsOpen(false);
  };

  const handlePrint = (record: typeof marriageRecords[0]) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Marriage Certificate</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:wght@400;500&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Lora', Georgia, serif; padding: 20px; background: #f5f5f5; }
          .certificate { 
            max-width: 800px; margin: auto; background: #fff; padding: 60px; position: relative;
            border: 2px solid #1e3a5f; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .certificate::before {
            content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px;
            border: 1px solid #d4a574; pointer-events: none;
          }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #d4a574; }
          .church-name { font-family: 'Playfair Display', serif; font-size: 24px; color: #1e3a5f; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px; }
          .title { font-family: 'Playfair Display', serif; font-size: 28px; color: #1e3a5f; font-weight: 700; letter-spacing: 2px; }
          .content { padding: 30px 0; }
          .couple-section { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .person { text-align: center; flex: 1; padding: 0 20px; }
          .person-title { font-size: 12px; color: #d4a574; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
          .person-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #1e3a5f; font-weight: 600; }
          .person-details { margin-top: 15px; font-size: 13px; color: #666; line-height: 1.8; }
          .divider { width: 1px; background: #d4a574; }
          .marriage-date { text-align: center; padding: 20px; background: #f8f8f8; margin: 20px 0; }
          .date-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
          .date-value { font-family: 'Playfair Display', serif; font-size: 20px; color: #1e3a5f; }
          .issued { text-align: center; margin-top: 30px; font-style: italic; color: #666; font-size: 14px; }
          .footer { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; }
          .signature-block { text-align: center; width: 200px; }
          .signature-line { border-top: 1px solid #333; margin-bottom: 8px; height: 60px; }
          .signature-label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
          .seal-block { text-align: center; width: 150px; }
          .seal-placeholder { height: 80px; margin-bottom: 8px; }
        </style></head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="church-name">${churchSettings.name}</div>
              <div class="title">Certificate of Marriage</div>
            </div>
            <div class="content">
              <div class="couple-section">
                <div class="person">
                  <div class="person-title">Groom</div>
                  <div class="person-name">${record.groomName}</div>
                  <div class="person-details">
                    ${record.groomFatherName ? `<div>Father: ${record.groomFatherName}</div>` : ''}
                    ${record.groomMotherName ? `<div>Mother: ${record.groomMotherName}</div>` : ''}
                    ${record.groomBaptismName ? `<div>Baptism Name: ${record.groomBaptismName}</div>` : ''}
                  </div>
                </div>
                <div class="divider"></div>
                <div class="person">
                  <div class="person-title">Bride</div>
                  <div class="person-name">${record.brideName}</div>
                  <div class="person-details">
                    ${record.brideFatherName ? `<div>Father: ${record.brideFatherName}</div>` : ''}
                    ${record.brideMotherName ? `<div>Mother: ${record.brideMotherName}</div>` : ''}
                    ${record.brideBaptismName ? `<div>Baptism Name: ${record.brideBaptismName}</div>` : ''}
                  </div>
                </div>
              </div>
              <div class="marriage-date">
                <div class="date-label">United in Holy Matrimony, under the Catholic Law</div>
                <div class="date-value">${format(new Date(record.dateOfMarriage), 'MMMM d, yyyy')}</div>
              </div>
            </div>
            <p class="issued">Issued on ${format(new Date(), 'MMMM d, yyyy')}</p>
            <div class="footer">
              <div class="seal-block">
                <div class="seal-placeholder"></div>
                <div class="signature-label">Parish Seal</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">Parish Priest Signature</div>
              </div>
            </div>
          </div>
        </body></html>`);
      printWindow.document.close(); printWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3"><Heart className="h-8 w-8 text-pink-500" /> Marriage Records</h1>
            <p className="text-muted-foreground mt-1">Manage marriage certificates</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" /> Add Record</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add Marriage Record</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-600">Groom Details</h3>
                    <div><Label>Name *</Label><Input value={formData.groomName} onChange={e => setFormData({...formData, groomName: e.target.value})} /></div>
                    <div><Label>Father's Name *</Label><Input value={formData.groomFatherName} onChange={e => setFormData({...formData, groomFatherName: e.target.value})} /></div>
                    <div><Label>Mother's Name *</Label><Input value={formData.groomMotherName} onChange={e => setFormData({...formData, groomMotherName: e.target.value})} /></div>
                    <div><Label>Baptism Name</Label><Input value={formData.groomBaptismName} onChange={e => setFormData({...formData, groomBaptismName: e.target.value})} /></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-pink-600">Bride Details</h3>
                    <div><Label>Name *</Label><Input value={formData.brideName} onChange={e => setFormData({...formData, brideName: e.target.value})} /></div>
                    <div><Label>Father's Name *</Label><Input value={formData.brideFatherName} onChange={e => setFormData({...formData, brideFatherName: e.target.value})} /></div>
                    <div><Label>Mother's Name *</Label><Input value={formData.brideMotherName} onChange={e => setFormData({...formData, brideMotherName: e.target.value})} /></div>
                    <div><Label>Baptism Name</Label><Input value={formData.brideBaptismName} onChange={e => setFormData({...formData, brideBaptismName: e.target.value})} /></div>
                  </div>
                </div>
                <div><Label>Date of Marriage *</Label><Input type="date" value={formData.dateOfMarriage} onChange={e => setFormData({...formData, dateOfMarriage: e.target.value})} /></div>
                <Button type="submit" className="w-full">Save Record</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" /></div>
        <Card><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>S.No</TableHead><TableHead>Groom</TableHead><TableHead>Bride</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>{filteredRecords.map(r => (<TableRow key={r.id}><TableCell>{r.sno}</TableCell><TableCell className="font-medium">{r.groomName}</TableCell><TableCell>{r.brideName}</TableCell><TableCell>{format(new Date(r.dateOfMarriage), 'MMM d, yyyy')}</TableCell>
              <TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => handlePrint(r)}><FileText className="h-4 w-4" /></Button><Button size="sm" variant="destructive" onClick={() => { deleteMarriageRecord(r.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}</TableBody></Table>
        </CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
