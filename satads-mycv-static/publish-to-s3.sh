#!/bin/bash

# bucketname
bucket="satads-mycv-static"

## dist
distDir="./dist"

## bucket Key
#bucketKey="deploys"
#
## currnet timestamp
#timestamp=$(date +%s)
#
## current file
#file="$bucketKey-$timestamp.zip"
#
#fileKey=$bucketKey/$file
#
#echo "Ziping files...."
## zips up the new code
#zip -FSr ./tmp/$file . -x *.git* *bin/\* *.zip *tmp/\* deploy.sh .idea/\*
#
#
## deploy
##Updates function code of lambda and pushes new zip file to s3bucket for cloudformation lambda:codeuri source
#echo "copiando os arquivos de deploy para o s3 ($bucket/$bucketKey/$file)"
#
## deploy - copy the zip file
#aws s3 cp ./tmp/$file s3://$bucket/$bucketKey/$file
#
## update the files
## aws s3 cp *.css s3://$bucket/test/$file

# rodando gulp dist
echo "rodando gulp dist"
gulp dist

# copy files
echo "copiando os arquivos do projeto para o s3 ($bucket)"

# echo "aws s3 cp $distDir/template.html s3://$bucket"
# aws s3 cp $distDir/template.html s3://$bucket

echo "aws s3 cp --recursive $distDir s3://$bucket"
aws s3 cp --recursive $distDir s3://$bucket
