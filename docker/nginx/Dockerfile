FROM 	nginx

# RUN 	apt-get update && apt-get install nginx openssl -y

# COPY	config/nginx.conf /etc/nginx/sites-available/default
# COPY	config/dhparam.pem /etc/ssl/certs/dhparam.pem 
# COPY	config/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
# COPY	config/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt

CMD	["nginx", "-g", "daemon off;"]