.PHONY: update-recipe

init:
	touch .local.env && pip install youtube-transcript-api

update-recipe:
	bash update_recipe.sh $(URL)

run:
	python -m http.server 8080