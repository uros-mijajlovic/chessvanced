#!/bin/bash

# Define an array of files and directories to exclude
declare -a exclude=("cleanup.sh" "index.html" "distWebpack" "dependencies" "assets" "img" "styles" "favicon.png")

# Loop through all items in the current directory
for item in *; do
    # Check if the item is in the exclusion list
    if [[ " ${exclude[@]} " =~ " ${item} " ]]; then
        echo "Skipping: $item"
    else
        # Check if the item is a file and not a directory
        if [ -f "$item" ]; then
            # Delete the file
            rm "$item"
            echo "Deleted: $item"
        elif [ -d "$item" ]; then
            # Check if the item is a directory and not in the exclusion list
            rm -rf "$item"
            echo "Skipping directory: $item"
        else
            # This is an unknown item (not a file or directory)
            echo "Unknown item: $item"
        fi
    fi
done