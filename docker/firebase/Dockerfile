FROM node:22-bookworm-slim
WORKDIR /firebase

RUN npm install -g firebase-tools

COPY firebase.json .firebaserc ./
COPY functions/package.json functions/package-lock.json* ./functions/
RUN cd functions && npm install
COPY functions ./functions
COPY docker/firebase/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["emulators:start", "--only", "hosting"]
