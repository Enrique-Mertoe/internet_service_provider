import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { Download, Upload, Activity } from 'lucide-react';

function AreaGradient({ color, id }: { color: string; id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

function getHoursInDay() {
  const hours = [];
  for (let i = 0; i < 24; i += 2) {
    const hour = i.toString().padStart(2, '0');
    hours.push(`${hour}:00`);
  }
  return hours;
}

export default function NetworkUsageChart() {
  const theme = useTheme();
  const timeLabels = getHoursInDay();

  const colorPalette = [
    '#3B82F6', // Blue for download
    '#10B981', // Green for upload
    '#8B5CF6', // Purple for total
  ];

  // Generate realistic network usage data (in Gbps)
  const generateNetworkData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      const hour = i * 2;
      // Simulate network patterns: lower at night, peak during day
      const baseFactor = Math.sin((hour / 24) * Math.PI) * 0.7 + 0.3;
      const randomVariation = Math.random() * 0.3 + 0.85;
      
      const download = Math.round((baseFactor * randomVariation * 15 + 2) * 10) / 10;
      const upload = Math.round((download * 0.2 + Math.random() * 2) * 10) / 10;
      
      data.push({ download, upload });
    }
    return data;
  };

  const networkData = generateNetworkData();
  const totalTraffic = networkData.reduce((sum, item) => sum + item.download + item.upload, 0);
  const averageSpeed = Math.round((totalTraffic / networkData.length) * 10) / 10;

  return (
    <Card variant="outlined" sx={{ width: '100%', height: '100%' }}>
      <CardContent>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 2 }}>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600" />
          </div>
          <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
            Network Usage (24h)
          </Typography>
        </Stack>
        
        <Stack sx={{ justifyContent: 'space-between', mb: 3 }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
              {averageSpeed} Gbps
            </Typography>
            <Chip size="small" color="success" label="+12.5%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
            Average bandwidth utilization for the last 24 hours
          </Typography>
        </Stack>

        {/* Legend */}
        <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Download className="h-4 w-4 text-blue-600" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Download
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <Upload className="h-4 w-4 text-green-600" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Upload
            </Typography>
          </Stack>
        </Stack>

        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: timeLabels,
              tickInterval: (index, i) => (i + 1) % 2 === 0,
              tickLabelStyle: {
                fontSize: 12,
                fill: theme.palette.text.secondary,
              },
            },
          ]}
          yAxis={[{ 
            width: 60,
            tickLabelStyle: {
              fontSize: 12,
              fill: theme.palette.text.secondary,
            },
          }]}
          series={[
            {
              id: 'download',
              label: 'Download',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: networkData.map(item => item.download),
            },
            {
              id: 'upload',
              label: 'Upload',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: networkData.map(item => item.upload),
            },
          ]}
          height={280}
          margin={{ left: 10, right: 20, top: 20, bottom: 40 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-upload': {
              fill: "url('#upload')",
            },
            '& .MuiAreaElement-series-download': {
              fill: "url('#download')",
            },
            '& .MuiChartsAxis-tick': {
              stroke: theme.palette.divider,
            },
            '& .MuiChartsAxis-line': {
              stroke: theme.palette.divider,
            },
            '& .MuiChartsGrid-line': {
              stroke: theme.palette.divider,
              strokeDasharray: '3 3',
              strokeOpacity: 0.5,
            },
          }}
          tooltip={{
            trigger: 'axis',
            formatter: (params: any) => {
              if (!params || params.length === 0) return '';
              const time = params[0].axisValue;
              const downloadValue = params.find((p: any) => p.seriesId === 'download')?.value || 0;
              const uploadValue = params.find((p: any) => p.seriesId === 'upload')?.value || 0;
              
              return (
                <div style={{ padding: '8px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{time}</div>
                  <div style={{ color: '#3B82F6' }}>Download: {downloadValue} Gbps</div>
                  <div style={{ color: '#10B981' }}>Upload: {uploadValue} Gbps</div>
                  <div style={{ color: '#6B7280', marginTop: '4px' }}>
                    Total: {(downloadValue + uploadValue).toFixed(1)} Gbps
                  </div>
                </div>
              );
            },
          }}
          hideLegend
        >
          <AreaGradient color="#3B82F6" id="download" />
          <AreaGradient color="#10B981" id="upload" />
        </LineChart>

        {/* Summary Stats */}
        <Stack direction="row" spacing={2} sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Peak Usage
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.max(...networkData.map(item => item.download + item.upload)).toFixed(1)} Gbps
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Total Transfer
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {totalTraffic.toFixed(1)} TB
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Efficiency
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.success.main }}>
              98.2%
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}