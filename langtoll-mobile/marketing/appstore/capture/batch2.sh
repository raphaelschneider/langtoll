#!/bin/zsh
# batch2.sh <iphone|ipad> <udid> <locale...>   — re-capture wallet + lock cards (+ islands)
set -u
H=${0:A:h}            # this capture/ folder
T=$H/work; mkdir -p $T
A=${H:h}             # marketing/appstore
DEV=$1; U=$2; shift 2
sw() { [[ $1 == $2 ]] && echo en || echo $1; }
run() { for i in 1 2 3; do python3 $H/cap.py "$@" && return 0; echo "retry $*"; done; echo "FAILED $*"; }
for L in "$@"; do
  if [[ $DEV == iphone ]]; then O=$A/raw/$L; else O=$A/raw-ipad/$L; fi
  C=$T/cap/$DEV/$L; mkdir -p $C
  run $U wallet $L $(sw fr $L) $O/wallet.png
  for c in de fr es pt it en; do
    [[ $c == $L ]] && continue
    run $U lock $L $c $C/lock_$c.png && python3 $H/crop.py card $C/lock_$c.png $O/lock_$c.png
  done
  if [[ $DEV == iphone ]]; then
    CS=(${(@)${(s: :):-de fr es pt it en}:#$L})
    for c in $CS[1] $CS[4]; do
      run $U island $L $c $C/island_$c.png && python3 $H/crop.py island $C/island_$c.png $O/island_$c.png
    done
  fi
  echo "DONE2 $DEV $L"
done
