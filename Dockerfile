FROM node:4

ADD . /app
WORKDIR /app
RUN npm install -g bower && \
	bower install --allow-root && \
	cp -Rv . /output/

ENV BACKEND_URL http://localhost:8000

CMD ["/app/entrypoint.sh"]
