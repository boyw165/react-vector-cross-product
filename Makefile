JADE = ./node_modules/jade/bin/jade.js
JADE_SRC = views/index.jade

WEBPACK = ./node_modules/webpack/bin/webpack.js

clean:
	@echo [clean]
	rm -rf dist/

static:
	@echo [static]
	cp -r public/ dist/

jade:
	@echo [jade]
	$(JADE) -P -o dist/ $(JADE_SRC)

dev: clean static jade
	@echo [webpack]
	$(WEBPACK) -d --watch --progress --config webpack.config.js

all: clean static jade
	@echo [webpack]
	$(WEBPACK) -p --progress --config webpack.config.js
