import shell from "shelljs";

shell.cp("-R", "./src/public/stylesheets", "./dist/public/");
shell.cp("-R", "./src/public/images", "./dist/public/");
