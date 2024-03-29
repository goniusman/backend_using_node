FROM node:alpine 
RUN apk add --no-cache --update nodejs npm
RUN addgroup app && adduser -S -G app app 
USER app
WORKDIR /app
COPY package.json .
RUN npm install 
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
#         then npm install; \
#         else npm install --only=production; \
#         fi
COPY . ./
# environment var
# EXPOSE 5001

ENV PORT 5000
EXPOSE $PORT

CMD [ "npm", "start" ]

# CMD [ "npm", "run", "dev" ]

