FROM node
COPY . /srv/
RUN rm -rf /srv/node_modules
WORKDIR /srv
RUN /usr/local/bin/npm install
CMD ["npm", "run", "devstart"]