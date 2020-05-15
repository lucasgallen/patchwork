desc 'tasks to build/push docker images'

namespace :docker do
  task :build => :environment do
    sh %{rails assets:clean}
    sh %{rails assets:precompile}
    sh %{docker build --tag=lucasgallen/patchwork_rails_app .}
  end

  task :push => :environment do
    sh %{docker push lucasgallen/patchwork_rails_app}
  end
end
