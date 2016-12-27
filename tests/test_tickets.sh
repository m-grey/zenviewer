#!/bin/bash
#Declare api account variables
if [ -z "$1" ]; then
	echo "username:"
	read USER
else
	USER=$1
fi
if [ -z "$2" ]; then
	echo "password:"
	read PASS
else
	PASS=$2
fi
if [ -z "$3" ]; then
	echo "account:"
	read ACCOUNT
else
	ACCOUNT=$3
fi

#Make call to tickets api and parse json in python
#--EMPTY USER TEST
echo "Testing empty user details"
OUTPUT=$(curl -X GET "http://localhost:3000/tickets?account=&pass=&user=" | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['code'])")
echo -e "\n TEST OUTCOME: "
#test json data for error code
if [ ${OUTPUT} -eq 1 ]; then
	echo -e "\t PASS \n"
else 
	echo -e "\t FAIL \n"
fi

#--INVALID USER TEST
echo "Testing invalid user details"
OUTPUT=$(curl -X GET "http://localhost:3000/tickets?account=a&pass=b&user=c" | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['code'])")
echo -e "\n TEST OUTCOME: "
if [ ${OUTPUT} -eq 3 ]; then
	echo -e "\t PASS \n"
else
	echo -e "\t FAIL \n"
fi

#--CORRECT USER TEST
echo "Testing inputted user details"
OUTPUT=$(curl -X GET "http://localhost:3000/tickets?account=${ACCOUNT}&pass=${PASS}&user=${USER}" | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['code'])")
echo -e "\n TEST OUTCOME: "
if [ ${OUTPUT} -eq 0 ]; then
	echo -e "\t PASS \n"
else
	echo -e "\t FAIL \n"
fi 