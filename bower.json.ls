#!/usr/bin/env lsc -cj
name: "angular-livescript-seed"
repo: "clkao/angular-livescript-seed"
version: "0.0.1"
main: "_public/js/app.js"
ignore: ["**/.*", "node_modules", "components"]
dependencies:
  "commonjs-require-definition": "~0.1.2"
  jquery: "~2.0.3"
  angular: "1.2.14"
  "angular-mocks": "1.2.14"
  "angular-scenario": "1.2.14"
  "angular-ui-router": "0.2.10"
  "jquery-scrollintoview": "Arwid/jQuery.scrollIntoView"

overrides:
  "angular":
    dependencies: jquery: "*"
  "angular-mocks":
    main: "README.md"
  "angular-scenario":
    main: "README.md"
  "jquery-scrollintoview":
    main: "jquery.scrollIntoView.js"

