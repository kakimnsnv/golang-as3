package repo

import (
	"sync"

	"github.com/google/uuid"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
)

type ReportRepo struct {
	mu      sync.Mutex
	reports map[string]entity.Report
}

func NewReportRepo() *ReportRepo {
	return &ReportRepo{
		reports: make(map[string]entity.Report),
	}
}

func (r *ReportRepo) Create(report entity.Report) (entity.Report, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	report.ID = uuid.New()
	r.reports[report.ID.String()] = report
	return report, nil
}

func (r *ReportRepo) GetByID(id string) (entity.Report, bool) {
	r.mu.Lock()
	defer r.mu.Unlock()

	report, ok := r.reports[id]
	return report, ok
}

func (r *ReportRepo) GetAll() []entity.Report {
	r.mu.Lock()
	defer r.mu.Unlock()

	reports := make([]entity.Report, 0, len(r.reports))
	for _, report := range r.reports {
		reports = append(reports, report)
	}
	return reports
}

func (r *ReportRepo) GetAllByUsername(username string) []entity.Report {
	r.mu.Lock()
	defer r.mu.Unlock()

	reports := make([]entity.Report, 0)
	for _, report := range r.reports {
		if report.StudentID == username {
			reports = append(reports, report)
		}
	}
	return reports
}

func (r *ReportRepo) Update(report entity.Report) (entity.Report, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	_, exists := r.reports[report.ID.String()]
	if !exists {
		return entity.Report{}, nil
	}

	r.reports[report.ID.String()] = report
	return report, nil
}

func (r *ReportRepo) Delete(id string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	_, exists := r.reports[id]
	if exists {
		delete(r.reports, id)
	}

	return exists
}
