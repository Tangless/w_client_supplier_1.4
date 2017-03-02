#!/bin/sh

echo 'push' >> tools/foo.txt
git add tools/foo.txt
git commit -m "only for push"
git push

echo 'Bingo!'
