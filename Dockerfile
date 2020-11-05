FROM hayd/deno:alpine-1.5.0 as build

WORKDIR /plugin


# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD . .
RUN chown deno:deno * && chmod +x *

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache index.ts

CMD ["run", "--allow-env", "--allow-write", "index.ts"]
