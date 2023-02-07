FROM	postgres

COPY ./20230206_ft_pong.sql /docker-entrypoint-initdb.d/init.sql
RUN mkdir -p /var/lib/postgresql/data/db

EXPOSE 5432