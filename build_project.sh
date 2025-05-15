CURRENT_DIR=$(pwd)

ng build --configuration=production

sudo cp .htaccess $CURRENT_DIR/dist/missclick.net/browser/

sudo cp -r $CURRENT_DIR/dist/missclick.net/* /var/www/missclick.net/