start:
	npx babel-node src/index.js
test:
	npx jest --colors
lint:
	npx eslint .