FROM node:4

ADD . /app
WORKDIR /app
RUN npm install -g bower && \
	bower install --allow-root && \
	cp -Rv . /output/

CMD ["/app/entrypoint.sh"]
