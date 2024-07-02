import { Component } from '@angular/core';
import { AdminAnalyticsService } from '../../../../_core/service/admin-analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  selectedMonth: string = ''; 
  details: any[] = []; 
  totalCount: number = 0;
  loading: boolean = false;
  errorMessage: string = '';
  fileTypeStats: any[] = [];

  chartOptions: any = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: ['Images', 'PDFs', 'Videos', 'Audios'],
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    }
  };

  constructor(private admin: AdminAnalyticsService) { }

  onMonthChange(event: Event) {
    this.selectedMonth = (event.target as HTMLSelectElement).value;
    console.log(`Selected month: ${this.selectedMonth}`);
    this.getData(this.selectedMonth); 
  }

  getData(month: string) {
    this.loading = true;
    this.admin.getData(month).subscribe(
      (res: any) => {
        this.loading = false;
        if (res.response === true && res.details.length > 0) {
          console.log('Details received:', res.details);
          this.details = res.details.map((detail: any) => ({
            ...detail,
            description: this.stripHtmlTags(detail.description)
          }));
          this.totalCount = res.totalCount;
          console.log('Total Count:', this.totalCount);

          this.fileTypeStats = res.fileTypeStats;
          this.updateChart(); // Update the chart after receiving data
        } else {
          this.details = [];
          this.totalCount = 0;
          this.errorMessage = 'No data available for the selected month.';
          console.log('No valid response data');
        }
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Error fetching data. Please try again later.';
        console.error('Error fetching data:', error);
      }
    );
  }

  private updateChart() {
    // Prepare data for the pie chart
    const data = [
      this.fileTypeStats[0]?.imageCount || 0,
      this.fileTypeStats[0]?.pdfCount || 0,
      this.fileTypeStats[0]?.videoCount || 0,
      this.fileTypeStats[0]?.audioCount || 0
    ];

    this.chartOptions.series = data;
    this.chartOptions.labels = ['Images', 'PDFs', 'Videos', 'Audios'];
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  }
}
