#! /bin/sh


WWW_ROOT="/usr/share/caddy"

#
# Modify the env vars in the static JS file compiled with the content of env vars
# with the same name.
# Run caddy in foreground
#
JS_FILES=$(find $WWW_ROOT/html -name "appConfig*.js")
VAR_NAMES=$(cat $WWW_ROOT/.env.sample | cut -d = -f 1)

for var in ${VAR_NAMES}; do
  VAR_VALUE=$(eval echo \$${var})

  # Fail if some var is not defined
  if [[ -z ${VAR_VALUE} ]]; then
    echo "Var \"${var}\" is not defined"
    exit 1
  fi

  echo "Setting $var value to $VAR_VALUE" 

  for jsfile in ${JS_FILES}; do
    # Parallel processing for sed replacements
    sed -i "s%___${var}___%${VAR_VALUE}%g" ${jsfile}
  done
done

exec caddy run --config /etc/caddy/Caddyfile
