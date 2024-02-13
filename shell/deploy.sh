if [ $# -ne 1 ]; then
    echo "Usage: $0 <ssh_conection>"
    echo "Ex: $0 user@192.158.1.38"
    exit 1
fi

ssh_conection=$1

yarn build
scp -r build/* $ssh_conection:/home/vintenovedeabril/htdocs/www.29deabril.cloud


