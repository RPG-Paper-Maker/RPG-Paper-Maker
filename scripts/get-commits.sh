#!/bin/bash

cd ./ || exit 1
declare -A commits

print_unique_commits() {
  local commit
  while IFS= read -r commit; do
    if [ -z "${commits[$commit]+x}" ]; then
      commits[$commit]=1
      printf "%s\n" "$commit"
    fi
  done
}

print_unique_commits < <(git log master..develop --pretty=format:"%s"; printf "\n")
print_unique_commits < <(git -C ../Game-Scripts log master..develop --pretty=format:"%s"; printf "\n")
