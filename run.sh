#!/bin/sh

k6 run start-process-test.js
k6 run user-task-test.js
k6 run group-task-test.js