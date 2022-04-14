FROM grafana/k6:latest

COPY dist/ /home/k6/
COPY --chmod=+x run.sh /home/k6


ENTRYPOINT ["/home/k6/run.sh"]