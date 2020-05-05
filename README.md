# Bring Your Own Book
A simple web server implementation of the game, [Bring Your Own Book](https://www.bringyourownbook.com/).

## Setup
```
$ git clone https://github.com/rokthewok/byo-book.git
$ cd byo-book
$ mkvirtualenv byob --python=python3.8
$ workon byob
$ python -m pip install -r requirements.txt
$ cd frontend
$ npm install
$ npm run build
$ cd ..
$ ln -s $PWD/frontend/build/static $PWD/byob/static
$ ln -s $PWD/frontend/build $PWD/boyb/templates
$ python -m byob
```

### Color Palette
https://coolors.co/632e28-d73c45-deab66-ecd88b-f5ecd4
