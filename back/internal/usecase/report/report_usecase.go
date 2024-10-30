package usecase

import (
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/entity"
	"github.com/kakimnsnv/golang-kbtu/assingments/3/internal/usecase/report/repo"
)

type ReportUsecase struct {
	repo *repo.ReportRepo
}

func NewReportUsecase(repo *repo.ReportRepo) *ReportUsecase {
	return &ReportUsecase{
		repo: repo,
	}
}

func (uc *ReportUsecase) CreateReport(report entity.Report) (entity.Report, error) {
	return uc.repo.Create(report)
}

func (uc *ReportUsecase) GetReport(id string) (entity.Report, bool) {
	return uc.repo.GetByID(id)
}

func (uc *ReportUsecase) GetAllReports() []entity.Report {
	return uc.repo.GetAll()
}

func (uc *ReportUsecase) GetReportsByUsername(username string) []entity.Report {
	return uc.repo.GetAllByUsername(username)
}

func (uc *ReportUsecase) UpdateReport(report entity.Report) (entity.Report, error) {
	return uc.repo.Update(report)
}

func (uc *ReportUsecase) DeleteReport(id string) bool {
	return uc.repo.Delete(id)
}
