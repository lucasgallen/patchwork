desc 'tasks to build/push docker images'

namespace :docker do
  namespace :build do
    task :latest => :environment do
      sh %{rails assets:clean}
      sh %{rails assets:precompile}
      sh %{docker build --tag=lucasgallen/patchwork_rails_app:staging --tag=lucasgallen/patchwork_rails_app:latest .}
    end

    task :staging => :environment do
      sh %{rails assets:clean}
      sh %{rails assets:precompile}
      sh %{docker build --tag=lucasgallen/patchwork_rails_app:staging .}
    end
  end

  namespace :push do
    task :latest => :environment do
      sh %{docker push lucasgallen/patchwork_rails_app:latest}
    end

    task :staging => :environment do
      sh %{docker push lucasgallen/patchwork_rails_app:staging}
    end

    task :all => :environment do
      sh %{docker push lucasgallen/patchwork_rails_app:staging}
      sh %{docker push lucasgallen/patchwork_rails_app:latest}
    end
  end

  namespace :build_push do
    task :staging => :environment do
      sh %{rails docker:build:staging && rails docker:push:staging}
    end

    task :latest => :environment do
      sh %{rails docker:build:latest && rails docker:push:latest}
    end

    task :all => :environment do
      sh %{rails docker:build:latest && rails docker:push:all}
    end
  end
end
