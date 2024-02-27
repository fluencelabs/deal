#! /usr/bin/env bash
if ! [[ -d ${CMTHOME}/config ]]; then
  CMTHOME_ORIG=$CMTHOME
  CMTHOME=/cometbft-init
  cometbft init

  sed -i \
    -e "s/^moniker\s*=.*/moniker = \"$MONIKER\"/" \
    -e 's/^addr_book_strict\s*=.*/addr_book_strict = false/' \
    -e 's/^timeout_commit\s*=.*/timeout_commit = "500ms"/' \
    -e 's/^index_all_tags\s*=.*/index_all_tags = true/' \
    -e 's,^laddr = "tcp://127.0.0.1:26657",laddr = "tcp://0.0.0.0:26657",' \
    -e 's/^prometheus\s*=.*/prometheus = true/' \
    "$CMTHOME/config/config.toml"
  echo $CMTHOME

  for i in data config; do
    mkdir ${CMTHOME_ORIG}/$i -p
    mv ${CMTHOME}/$i/* ${CMTHOME_ORIG}/$i/
  done
  mv /cometbft-config/* ${CMTHOME_ORIG}/config/

  export CMTHOME="${CMTHOME_ORIG}"
fi

exec cometbft "$@"
