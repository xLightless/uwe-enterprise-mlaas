FROM postgres:latest
COPY ./init-databases.sh /docker-entrypoint-initdb.d/init-databases.sh
RUN chmod +x /docker-entrypoint-initdb.d/init-databases.sh