FROM node AS build

COPY app /app 
WORKDIR /app
RUN npm install
RUN npm run build

FROM node
COPY --from=build /app/build /app
RUN npm install -g serve
WORKDIR /app
ENTRYPOINT ["npx"]
CMD ["serve"]
