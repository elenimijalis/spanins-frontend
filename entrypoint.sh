#!/bin/bash
sed -i "s|http://localhost:8000|$BACKEND_URL|g" /output/js/app.js
echo "This container is complete, please serve the files from a static file server container. They have been build in /output/"
