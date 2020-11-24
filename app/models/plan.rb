class Plan

  # A constant is defined by being all in caps
  PLANS = [:free, :premium]

  # modifying all elements in array and capitalizing them
  def self.options
    PLANS.map { |plan| [plan.capitalize, plan] }
  end

end