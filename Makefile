script:
	npx babel-node src/script.js
test:
	npx jest --colors
lint:
	npx eslint .
fix:
	npx eslint . --fix
dev:
	npm run dev
build:
	npm run build