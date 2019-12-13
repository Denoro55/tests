script:
	npx babel-node src/script.js
test:
	npx jest --colors
lint:
	npx eslint .
dev:
	npm run dev
build:
	npm run build
watch:
	npx webpack-dev-server --mode development --open