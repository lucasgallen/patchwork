require 'fileutils'

desc 'Run local imgproxy server via `docker run`'

namespace :imgproxy do
  task :start => :environment do
    key      = ENV['IMGPROXY_KEY']
    salt     = ENV['IMGPROXY_SALT']
    port     = ENV['IMGPROXY_PORT']
    quality  = ENV['IMGPROXY_QUALITY']
    max_size = ENV['IMGPROXY_MAX_SRC_FILE_SIZE']
    max_res  = ENV['IMGPROXY_MAX_SRC_RESOLUTION']
    gzip     = ENV['IMGPROXY_GZIP_COMPRESSION']
    vol      = Rails.root.join("storage")

    sh %{docker run -p #{port}:8080 --name imgproxy \
         -e IMGPROXY_LOCAL_FILESYSTEM_ROOT=#{vol} \
         -e IMGPROXY_QUALITY=#{quality} \
         -e IMGPROXY_KEY=#{key} \
         -e IMGPROXY_SALT=#{salt} \
         -e IMGPROXY_MAX_SRC_FILE_SIZE=#{max_size} \
         -e IMGPROXY_MAX_SRC_RESOLUTION=#{max_res} \
         -e IMGPROXY_GZIP_COMPRESSION=#{gzip} \
         -v #{vol}:#{vol} \
         -it darthsim/imgproxy} do |ok, res|
      if !ok
        puts "Something went wrong: \n#{res.exitstatus}"
      end
    end
  end

  task :stop => :environment do
    sh %{docker stop -t 1 imgproxy} do |ok, res|
      if !ok
        puts "Could not stop container:\n#{res.exitstatus}"
      end
    end

    sh %{docker rm imgproxy} do |ok, res|
      if !ok
        puts "Could not stop container:\n#{res.exitstatus}"
      end
    end
  end

  task :restart do
    sh %{rails imgproxy:stop}
    sh %{rails imgproxy:start}
  end
end
