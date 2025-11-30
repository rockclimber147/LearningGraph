command -v git >/dev/null 2>&1 || {
  echo "Husky requires Git" >&2
  exit 0
}