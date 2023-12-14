#/bin/bash

set -e

export_schema()
{
    local source_base_url source_access_token
    if [ ! -z $2 ]
    then
        source_base_url=$2
    else
        read -p "Enter your base URL for the source (e.g. https://example.org): " source_base_url
    fi
    if [ ! -z $3 ]
    then
        source_access_token=$3
    else
        read -s -p "Please enter your access token for the source API: " source_access_token
        echo
    fi
    curl -s -H "Authorization: Bearer $source_access_token" "$source_base_url/schema/snapshot" | jq ".data" > "$1"
}

import_schema()
{
    local schema_path target_base_url target_access_token
    if [ ! -z $1 ]
    then
        schema_path=$1
    else
        read -p "Please enter the schema's file path: " schema_path
    fi
    if [ -z "$schema_path" ]
    then
        echo "No path entered. aborting."
        return
    fi

    if [ ! -z $2 ]
    then
        target_base_url=$2
    else
        read -p "Enter your base URL for the target (e.g. https://example.org): " target_base_url
    fi
    if [ ! -z $3 ]
    then
        target_access_token=$3
    else
        read -s -p "Please enter your access token for the target API: " target_access_token
        echo
    fi

    diff_path=$(mktemp)
    # Get the diff...
    curl -s -H "Authorization: Bearer $source_access_token" -H "Content-Type: application/json" -d "@$schema_path" "$target_base_url/schema/diff" | jq .data > "$diff_path"
    echo Exported schema diff successfully.
    # and apply it.
    curl -s -H "Authorization: Bearer $source_access_token" -H "Content-Type: application/json" -d "@$diff_path" "$target_base_url/schema/apply"
    if [ ! -z $? ]
    then
        echo Schema imported successfully.
    fi
    # rm "$diff_path"
}

ask_operation_type()
{
    local type
    read -p "Do you want to sync (s) a schema or only import a schema (I)? (s/I) " type
    
    if [[ -z "$type" ]]
    then
        type="I"
    fi

    if [ "$type" = "i" ] || [ "$type" = "I" ]
    then
        echo "Importing schema... $type"
        tmpfile=123
    else
        echo "Syncing schema..."
        tmpfile=$(mktemp)
        export_schema $tmpfile
        import_schema $tmpfile
        rm "$tmpfile"
    fi
}

which jq 1>/dev/null
if [[ $? -ne 0 ]]; then
    echo Please install jq. Exiting.
    exit 1
fi

ask_operation_type

