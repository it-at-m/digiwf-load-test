FROM grafana/k6:latest

COPY --chown=k6:k6 dist/ /home/k6/
COPY --chown=k6:k6 --chmod=550 run.sh /home/k6/

ENTRYPOINT ["/home/k6/run.sh"]