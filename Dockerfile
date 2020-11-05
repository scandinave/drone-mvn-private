FROM hayd/deno:alpine-1.5.0 as build

WORKDIR /plugin



# These steps will be re-run upon each file change in your working directory:
ADD . .
RUN chown deno:deno * && chmod +x *

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index.ts

CMD ["run", "--allow-env", "--allow-write", "index.ts"]
