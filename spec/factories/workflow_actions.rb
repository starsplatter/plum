FactoryGirl.define do
  factory :workflow_action, class: Sipity::WorkflowAction do
    workflow
    name 'status'
  end
end
