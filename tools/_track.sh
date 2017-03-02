#!/bin/sh

echo $1 $2

name=$2
page="$(tr [A-Z] [a-z] <<< "$name")"

dir="src/imodules/$1/trackPages/Track$name"
page_full="${dir}/track@${page}.pg.html"
echo $page_full

mkdir $dir
echo "@@include('global/track/TrackPage/main.md.html')" > $page_full
