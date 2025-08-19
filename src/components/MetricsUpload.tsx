import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMetrics } from "@/hooks/useMetrics";
import Papa from "papaparse";

interface MetricsUploadProps {
  startupId: string;
}

interface CSVMetric {
  revenue: string;
  expenses: string;
  burn_rate: string;
  runway: string;
  period_start: string;
  period_end: string;
}

export function MetricsUpload({ startupId }: MetricsUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<CSVMetric[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addMetric, refetchMetrics } = useMetrics(startupId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Parse CSV for preview
    Papa.parse(selectedFile, {
      header: true,
      preview: 5,
      complete: (results) => {
        setPreview(results.data as CSVMetric[]);
      },
      error: (error) => {
        toast({
          title: "Parse error",
          description: `Failed to parse CSV: ${error.message}`,
          variant: "destructive",
        });
      }
    });
  };

  const validateMetric = (metric: CSVMetric): boolean => {
    const required = ['revenue', 'expenses', 'burn_rate', 'runway', 'period_start', 'period_end'];
    return required.every(field => metric[field as keyof CSVMetric] && metric[field as keyof CSVMetric].trim() !== '');
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const metrics = results.data as CSVMetric[];
        let successCount = 0;
        let errorCount = 0;

        for (const metric of metrics) {
          if (!validateMetric(metric)) {
            errorCount++;
            continue;
          }

          try {
            await addMetric({
              startup_id: startupId,
              revenue: parseFloat(metric.revenue),
              expenses: parseFloat(metric.expenses),
              burn_rate: parseFloat(metric.burn_rate),
              runway: parseInt(metric.runway),
              period_start: metric.period_start,
              period_end: metric.period_end,
            });
            successCount++;
          } catch (error) {
            errorCount++;
          }
        }

        toast({
          title: "Upload complete",
          description: `${successCount} metrics uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
          variant: errorCount > 0 ? "destructive" : "default",
        });

        if (successCount > 0) {
          await refetchMetrics();
          setFile(null);
          setPreview([]);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
        
        setUploading(false);
      },
      error: (error) => {
        toast({
          title: "Upload failed",
          description: `Failed to process CSV: ${error.message}`,
          variant: "destructive",
        });
        setUploading(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Metrics from CSV
        </CardTitle>
        <CardDescription>
          Upload historical financial data to improve predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csv-upload">CSV File</Label>
          <Input
            id="csv-upload"
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
        </div>

        {/* CSV Format Guide */}
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertDescription>
            <strong>Required columns:</strong> revenue, expenses, burn_rate, runway, period_start (YYYY-MM-DD), period_end (YYYY-MM-DD)
          </AlertDescription>
        </Alert>

        {/* Preview */}
        {preview.length > 0 && (
          <div className="space-y-2">
            <Label>Preview (first 5 rows)</Label>
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-left">Revenue</th>
                    <th className="p-2 text-left">Expenses</th>
                    <th className="p-2 text-left">Burn Rate</th>
                    <th className="p-2 text-left">Runway</th>
                    <th className="p-2 text-left">Period Start</th>
                    <th className="p-2 text-left">Period End</th>
                    <th className="p-2 text-left">Valid</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => {
                    const isValid = validateMetric(row);
                    return (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row.revenue}</td>
                        <td className="p-2">{row.expenses}</td>
                        <td className="p-2">{row.burn_rate}</td>
                        <td className="p-2">{row.runway}</td>
                        <td className="p-2">{row.period_start}</td>
                        <td className="p-2">{row.period_end}</td>
                        <td className="p-2">
                          {isValid ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Metrics"}
        </Button>
      </CardContent>
    </Card>
  );
}