# tinypng-go

This is a cli tool to compress image quickly and effectively.

## QUICK START

```sh
tinypng-go images  # compress images in directory and replace all of it.
tinypng-go logo.png -o logo-new.png  # compress a single image
tinypng-go images -o imagesDir # compress images in directory and output to images in new directory
```

![img](public/show.gif)

## INSTALLATION

You can globally install this tool or use npx.

### npx

```sh
npx tinypng-go <filename or dirname> [OPTIONS]
```

### global install

#### npm

```
npm install -g tinypng-go
```

#### yarn

```
yarn global add tinypng-go
```

check if you have installed

```
tinypng-go -v
```

## USAGE

`tinypng-go <filename or directory> [OPTIONS]`

```
-v, --version          show current version
-o, --output <output>  set output path
-m, --max [max]        max async compress tasks(The higher the number, the faster the speed)
-a, --all              force compress all images(include compressed images)
-h, --help             show help for command
```

**if you set max a big number,tasks will run faster, but the memory will cost more.**

### example

```sh
tinypng-go images  # compress images in directory and replace all of it.
tinypng-go logo.png -o logo-new.png  # compress a single image
tinypng-go images -o imagesDir # compress images in directory and output to images in new
tinypng-go images  -m  30 # compress images in directory with max tasks 30
```
