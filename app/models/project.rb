class Project < ApplicationRecord
  belongs_to :tenant
  validates_uniqueness_of :title
  # if project is deleted then all artifacts with project will also be deleted
  has_many :artifacts, dependent: :destroy
  validate :free_plan_can_only_have_one_project


  def free_plan_can_only_have_one_project
    if self.new_record? && (tenant.projects.count > 0) && (tenant.plan == 'free')
      errors.add(:base, "Free plans can only have one project")
    end
  end

  # placeholder code for once the relationship is finished
  def self.by_plan_and_tenant(tenant_id)
    tenant = Tenant.find(tenant_id)
    if tenant.plan == 'premium'
      tenant.projects
    else
      tenant.projects.order(:id).limit(1)
    end
  end

end
