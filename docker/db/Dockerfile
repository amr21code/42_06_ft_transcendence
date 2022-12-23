FROM	postgres

COPY	./config/my.cnf /etc/mysql/my.cnf
COPY	./config/dbinit.sql /tmp/dbinit.sql

CMD	["mysqld", "--user=mysql" , "--init-file=/tmp/dbinit.sql"] 
