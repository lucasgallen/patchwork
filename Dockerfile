FROM ruby:2.7.0

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update -yqq \
  && apt-get install -yqq --no-install-recommends \
    postgresql-client \
    nodejs \
    yarn \
  && apt-get -q clean \
  && rm -rf /var/lib/apt/lists

WORKDIR /usr/src/app

COPY public/*.html public/
COPY public/*.png public/
COPY public/robots* public/
COPY public/favicon* public/
COPY public/assets public/assets
COPY public/packs public/packs
COPY app app
COPY vendor vendor
COPY bin bin
COPY config config
COPY db db
COPY lib lib
COPY postcss.config.js .
COPY babel.config.js .
COPY Rakefile .
COPY config.ru .
COPY package.json .
COPY yarn.lock .
COPY Gemfile .
COPY Gemfile.lock .
COPY app.conf .

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT /usr/bin/entrypoint.sh
