# build environment
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV QUICK_BUILD true
ENV TOOL_NODE_FLAGS="--max_old_space_size=5048 --optimize_for_size --gc-interval=100"
ENV NODE_OPTIONS="--max_old_space_size=5048"
COPY package.json /usr/src/app/package.json
RUN npm install -g pnpm
RUN pnpm install
COPY . /usr/src/app
RUN pnpm run build

# production environment
FROM nginx:1.16.0-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
