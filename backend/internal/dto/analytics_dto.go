package dto

type DailyStat struct {
	Date  string `json:"date"`
	Count int64  `json:"count"`
}

type AnalyticsResponse struct {
	TotalVisitors    int64       `json:"total_visitors"`
	TotalEnquiries   int64       `json:"total_enquiries"`
	NewEnquiries     int64       `json:"new_enquiries"`
	ConversionRate   float64     `json:"conversion_rate"`
	VisitorsPerDay   []DailyStat `json:"visitors_per_day"`
	EnquiriesPerDay  []DailyStat `json:"enquiries_per_day"`
}
