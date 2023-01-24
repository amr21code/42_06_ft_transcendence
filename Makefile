NAME =      ft_transcendence
YML =       ./docker-compose.yml
YMLDB =       ./docker-compose_db.yml

$(NAME):
	@echo "Building Transcendence"
	@mkdir -p /home/${USER}/data/db
	@mkdir -p /home/${USER}/data/web
	@docker compose -f $(YML) up -d

all: $(NAME)

test:
	@docker compose -f $(YML) up

eval:
	@-docker stop $$(docker ps -qa); docker rm $$(docker ps -qa); docker rmi -f $$(docker images -qa); docker volume rm $$(docker volume ls -q); docker network rm $$(docker network ls -q) 2> /dev/null

# -- build
# docker build -t NAME .
# -- run
# docker run -d NAME
# -- terminal
# docker exec -it NAME bash

.PHONY: stop contrm imagerm volrm netrm clean test eval

db: 
	@docker compose -f $(YMLDB) up -d

clean: stop contrm
	-docker system prune -f

fclean: stop contrm volrm netrm imagerm
	-docker system prune -f

stop:
	@echo "Container STOP"
	@-docker container stop $$(docker container ps -aq);

contrm:
	@echo "Container RM"
	@-docker container rm $$(docker container ps -aq);

imagerm:
	@echo "Image RM"
	@-docker image rm -f $$(docker image ls -aq);

volrm:
	@echo "Volume RM"
	@-docker volume rm $$(docker volume ls -q);

netrm:
	@echo "Network RM"
	@-docker network rm $$(docker network ls -q);
