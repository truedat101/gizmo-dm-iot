#!/bin/sh

startno=$1
limit=$2
# Or -----------------------
for i in $(seq 1 $limit);
do
	nextserialno=$(($i+$startno))
	nextserialno=$((100000+$nextserialno))
        echo "next ${nextserialno}"
	
        cat << EOF >> ./gizmodevices-bump.json
    { "id": "${i}", "serialno":"H${nextserialno}", "swversion": "3.1.52", "modifieddate": "Sun, 18 Dec 2024 21:49:36 GMT", "status" : "unknown"},
EOF
done
