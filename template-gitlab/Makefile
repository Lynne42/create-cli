
PROJECT ?= realcenter-frontend
REGISTRY_PROJECT ?= realcenter-frontend

DOMAIN ?=  reg.real-ai.cn/realcenter
IMG ?= ${DOMAIN}/$(REGISTRY_PROJECT)

CHANGED_FILES := $(shell git diff-files)

ifeq ($(strip $(CHANGED_FILES)))

GIT_VERSION := $(shell git describe --tags --long)
else
GIT_VERSION := $(shell git describe --tags --long)-dirty-$(shell git diff | shasum -a256 | cut -c -6)
endif

COMMIT = $(shell git rev-parse HEAD)

TAGPREFIX = v1.0.0

TAG := ${TAGPREFIX}-$(shell date +v%Y%m%d)-$(GIT_VERSION)

info:
	echo image: \"IMG:$(TAG)\" > $(OUTPUT)

build:
	docker build ${DOCKER_BUILD_OPTS} -t $(IMG):$(TAG) . \
	  --build-arg kubeflowversion=$(shell git describe --abbrev=0 --tags) \
	  --build-arg commit=$(shell git rev-parse HEAD) \
      --label=git-verions=$(GIT_VERSION)
	docker tag $(IMG):$(TAG) $(IMG):latest
	@echo Built $(IMG):latest
	@echo Built $(IMG):$(TAG)


push:
	docker -- push $(IMG):latest
	@echo Pushed $(IMG) with  :$(TAG) tags

build-push:
	make build
	make push
