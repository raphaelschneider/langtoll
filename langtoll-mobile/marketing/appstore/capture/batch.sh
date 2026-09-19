#!/bin/zsh
# batch.sh <iphone|ipad> <udid> <locale...>
set -u
H=${0:A:h}            # this capture/ folder
T=$H/work; mkdir -p $T
A=${H:h}             # marketing/appstore
DEV=$1; U=$2; shift 2
typeset -A NAME
NAME=(de_en Englisch de_de Deutsch de_es Spanisch de_fr Französisch de_it Italienisch de_pt Portugiesisch
      es_en Inglés es_de Alemán es_es Español es_fr Francés es_it Italiano es_pt Portugués
      fr_en Anglais fr_de Allemand fr_es Espagnol fr_fr Français fr_it Italien fr_pt Portugais
      it_en inglese it_de tedesco it_es spagnolo it_fr francese it_it italiano it_pt portoghese
      pt_en Inglês pt_de Alemão pt_es Espanhol pt_fr Francês pt_it Italiano pt_pt Português)
sw() { [[ $1 == $2 ]] && echo en || echo $1; }   # never the reader's own language
for L in "$@"; do
  if [[ $DEV == iphone ]]; then O=$A/raw/$L; else O=$A/raw-ipad/$L; fi
  mkdir -p $O $T/cap/$DEV/$L
  C=$T/cap/$DEV/$L
  H=$(sw de $L); P=$(sw es $L); S=$(sw pt $L); W=$(sw fr $L); K=$(sw it $L)
  run() { for i in 1 2 3; do python3 $H/cap.py "$@" && return 0; echo "retry $*"; done; echo "FAILED $*"; }
  run $U home_locked $L $H $O/home.png
  run $U order $L $P $O/practice.png
  if [[ $DEV == iphone ]]; then run $U done $L $S $O/pass.png; else run $U home_active $L $S $O/home_active.png; fi
  run $U wallet $L $W $O/wallet.png
  run $U hook $L $K $O/hook.png ${NAME[${L}_$K]}
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
  echo "DONE $DEV $L"
done
