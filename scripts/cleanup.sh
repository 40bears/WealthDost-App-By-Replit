#!/bin/bash
image=$1
no_of_images_to_keep=2

if [[ -z "$image" ]]; then
    echo -e "\nError: Image name not defined"
    exit
fi

image_tags=()
while IFS= read -r line; do
    image_tags+=( "$line" )
done < <(docker images --filter reference=$image --format "{{.Tag}}")

for tag in "${!image_tags[@]}"
do
    if [ $tag -ge $no_of_images_to_keep ]
    then
        echo -e "[+] Removing image ${image_tags[$tag]}"
        docker rmi $image:${image_tags[$tag]}
        echo -e "[+] Removing image ${image_tags[$tag]} : Done"
    fi
done