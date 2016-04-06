#!/bin/sh

APP_NAME="cube"


################################
#      STOP PM2 INSTANCE	   #
################################
pm2 stop "$APP_NAME"
