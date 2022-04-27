FROM grafana/k6:latest

COPY --chown=k6:k6 dist/ /home/k6/
COPY --chmod=777 --chown=k6:k6 run.sh /home/k6/

ENTRYPOINT ["/home/k6/run.sh"]