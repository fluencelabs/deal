#! /usr/bin/env bash

trap 'echo "Received SIGTERM. Shutting down"; exit 1' SIGTERM

make $@
