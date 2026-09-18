# Trixie rather than bookworm: the Firestore and Auth emulators are Java
# programs and firebase-tools requires a JDK 21 or newer, while bookworm's
# default JRE is 17. (The Hosting emulator is the only one needing no JVM,
# which is why this never came up while it ran alone.)
FROM node:22-trixie-slim
WORKDIR /firebase

RUN apt-get update \
    && apt-get install -y --no-install-recommends default-jre-headless \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g firebase-tools

COPY firebase.json .firebaserc firestore.rules storage.rules ./
COPY functions/package.json functions/package-lock.json* ./functions/
RUN cd functions && npm install
COPY functions ./functions
COPY docker/firebase/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["emulators:start", "--only", "hosting,auth,firestore,storage"]
