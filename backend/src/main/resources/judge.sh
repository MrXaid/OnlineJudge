#!/bin/bash

LANG=$1
SRC=$2
INPUT=$3
EXPECTED=$4
OUTPUT="output.txt"
VERDICT="verdict.txt"
EXE="main"

> "$VERDICT"
> "$OUTPUT"

case $LANG in
  cpp)
    IMG="judge-cpp"
    COMPILE="g++ $SRC -o $EXE"
    RUN="./$EXE"
    ;;
  java)
    IMG="judge-java"
    COMPILE="javac $SRC"
    RUN="java ${SRC%.java}"
    ;;
  python3)
    IMG="judge-python"
    COMPILE="true"  # No compile step needed
    RUN="python3 $SRC"
    ;;
  *)
    echo "Unsupported language" > "$VERDICT"
    exit 1
    ;;
esac

# Compile
compile_output=$(docker run --rm -v $(pwd):/app -w /app $IMG bash -c "$COMPILE" 2>&1)
compile_status=$?

if [ $compile_status -ne 0 ]; then
  echo "Compilation Error" > "$VERDICT"
  echo "$compile_output" >&2
  exit 0
fi

# Run inside sandbox
docker run --rm -v $(pwd):/app -w /app --network none --memory=256m --cpus=0.5 $IMG bash -c "timeout 2s $RUN < $INPUT > $OUTPUT"


run_status=$?

if [ $run_status -eq 124 ]; then
  echo "Time Limit Exceeded" > "$VERDICT"
  exit 0
elif [ $run_status -ne 0 ]; then
  echo "Runtime Error" > "$VERDICT"
  exit 0
fi

# Normalize line endings
dos2unix "$EXPECTED" "$OUTPUT" &>/dev/null

# Compare output
if ! diff -q "$EXPECTED" "$OUTPUT" > /dev/null; then
  echo "Wrong Answer" > "$VERDICT"
  exit 0
fi

echo "Accepted" > "$VERDICT"