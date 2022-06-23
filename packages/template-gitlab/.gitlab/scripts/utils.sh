#!/bin/bash

function msg_info() {
    #printf "${underline}${bold}${green}: %s${reset}\n" "$@"
    echo -e "\033[1;4;32m: $@\033[0m"
}

function msg_warn() {
    #printf "${underline}${bold}${tan}: %s${reset}\n" "$@"
    echo -e "\033[1;4;35m: $@\033[0m"
}

function code_check(){
    if [ -z "$SONAR_PROJECT" ];then
        SONAR_PROJECT="default-${CI_PROJECT_NAME}-${CI_COMMIT_BRANCH}"
    else
        SONAR_PROJECT="${SONAR_PROJECT}-${CI_PROJECT_NAME}-${CI_COMMIT_BRANCH}"
    fi

    msg_info "开始静态代码检查"
    sonar-scanner \
    -Dsonar.projectKey=${SONAR_PROJECT} \
    -Dsonar.sources=. \
    -Dsonar.host.url=${SONAR_SERVER} \
    -Dsonar.login=${SONAR_LOGIN_TOKEN}
    msg_info "静态代码检查完毕，请登录 http://sonar.realai-inc.cn 查看结果"
}

function npm_install() {
    if [ ! -d node_modules ];then
      if [ -z "$NPM_REG" ];then
        NPM_REG="https://registry.npm.taobao.org"
      else
        NPM_REG="$NPM_REG"
      fi
      msg_info "更换仓库源: $NPM_REG"
      npm config set registry $NPM_REG
      msg_info "npm add dependency"
      npm install --cache-folder
    fi
    msg_info "node_modules已存在"
}

function npm_build() {

    npm run build
}

function docker_build() {
  set -o errexit
  msg_info "make build and make push"
  echo $1
  shortcommitsha=$VERSION
  if [ $1 ]
  then
    shortcommitsha=${CI_COMMIT_SHA:0:7}
  fi
  
  msg_info "$shortcommitsha"
  docker login -u $DOCKER_USERNAME -p $DOCKER_PASS $DOCKER_REG
  sh ./dev_deploy.sh "$shortcommitsha"
}

function add_ssh_key() {
    echo
    msg_info "add ssh private key"
    which ssh-agent || ( sudo apt-get update -y && apt-get install openssh-client -y )
    eval $(ssh-agent -s)
    msg_info "ssh-add"
    echo -e "$1" | ssh-add -
    msg_info "mkdir ~/.ssh"
    mkdir -p ~/.ssh && chmod 700 ~/.ssh
    [ -f /.dockerenv ]; echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config
}


function image_deploy_test() {
    add_ssh_key "$SSH_PRIVATE_KEY"
    shortcommitsha=${VERSION}
    msg_info "$shortcommitsha"
    msg_info "开始部署，目标目录：$DST_DIR"

    cp realcenter-frontend.yml realcenter-frontend_${shortcommitsha}.yml

    sed -i "s/{version}/${shortcommitsha}/g" realcenter-frontend_${shortcommitsha}.yml
    
    for DST_HOST in ${DST_HOST_TEST};do

        msg_info "路径：$DST_DIR "
        msg_info "ip: $DST_HOST "

        rsync -aP -e "ssh -p${DST_HOST_TEST_PORT}" realcenter-frontend_${shortcommitsha}.yml ${DST_HOST}:${DST_DIR}/realcenter-frontend.yml
        ssh -t -p ${DST_HOST_TEST_PORT} ${USER_TEST}@${DST_HOST} "/usr/local/bin/kubectl apply -f ${DST_DIR}/realcenter-frontend.yml | kubectl rollout restart deploy realcenter-frontend -n realcenter"

        # ssh -t -p ${DST_HOST_TEST_PORT}  ${USER}@${DST_HOST} 'bash  -s' < deploy_image.sh $VERSION
        
    done
}

function image_deploy_dev() {
    add_ssh_key "$SSH_PRIVATE_KEY"
    shortcommitsha=${VERSION}
    msg_info "$shortcommitsha"
    msg_info "开始部署，目标目录：$DST_DIR"

    cp realcenter-frontend.yml realcenter-frontend_${shortcommitsha}.yml
    sed -i "s/{version}/${shortcommitsha}/g" realcenter-frontend_${shortcommitsha}.yml

    for DST_HOST in ${DST_HOST_DEV};do

        msg_info "路径：$DST_DIR "
        msg_info "ip: $DST_HOST "
        # ssh -t -p ${DST_HOST_DEV_PORT} ${USER_DEV}@${DST_HOST_DEV} 'bash  -s' < deploy_image.sh $VERSION
        rsync -aP -e "ssh -p${DST_HOST_DEV_PORT}" realcenter-frontend_${shortcommitsha}.yml ${DST_HOST}:${DST_DIR}/realcenter-frontend.yml
        ssh -t -p ${DST_HOST_DEV_PORT} ${USER_DEV}@${DST_HOST} "/usr/local/bin/kubectl apply -f ${DST_DIR}/realcenter-frontend.yml | kubectl rollout restart deploy realcenter-frontend -n realcenter"
    done
}

function image_deploy_master() {
    add_ssh_key "$SSH_PRIVATE_KEY"
    shortcommitsha=${CI_COMMIT_SHA:0:7}
    msg_info "$shortcommitsha"
    msg_info "开始部署，目标目录：$DST_DIR_MASTER"

    cp realcenter-frontend.yml realcenter-frontend_${shortcommitsha}.yml
    sed -i "s/{version}/${shortcommitsha}/g" realcenter-frontend_${shortcommitsha}.yml

    for DST_HOST in ${DST_HOST_MASTER};do

        msg_info "路径：$DST_DIR_MASTER "
        msg_info "ip: $DST_HOST "
        # ssh -t -p ${DST_HOST_MASTER_PORT} ${USER_DEV}@${DST_HOST_DEV} 'bash  -s' < deploy_image.sh $VERSION
        rsync -aP -e "ssh -p${DST_HOST_MASTER_PORT}" realcenter-frontend_${shortcommitsha}.yml ${DST_HOST}:${DST_DIR_MASTER}/realcenter-frontend.yml
        ssh -t -p ${DST_HOST_MASTER_PORT} ${USER_MASTER}@${DST_HOST} "sudo chown shizhen.xu:shizhen.xu ${DST_DIR_MASTER}/realcenter-frontend.yml && /usr/local/bin/kubectl apply -f ${DST_DIR_MASTER}/realcenter-frontend.yml"
    done
}
