import { describe, test, expect } from "vitest";
import { makeBundle } from "../execution/bundle";
import { defineConfig } from "../config";
import { defineController, definePath, defineProject } from "../projects";
import { Literal, Number, Object, Optional, String } from "typebox";

describe("make bundle tests", () => {
  test("1", async () => {
    const config = defineConfig({
      input: {
        path: "",
        type: "typebox",
      },
      output: {
        path: "",
        target: "typescript",
        components: {
          types: true,
          client: true,
        },
      },
    });

    const project = defineProject({
      name: "test",
      version: "1",
      controllers: [
        defineController({
          name: "Profile",
          paths: {
            "/profile": {
              GET: definePath({
                name: "getProfile",
                request: {
                  body: Object({
                    id: Number(),
                    notId: Optional(
                      String({
                        maxLength: 20,
                      })
                    ),
                    description: String(),
                    lit: Literal(123),
                    obj: Object({
                      inner: String(),
                    }),
                  }),
                },
                responses: {
                  200: Object({}),
                },
              }),
              POST: definePath({
                name: "updateProfile",
                request: {
                  body: Literal(123),
                },
                responses: {
                  200: Object({}),
                },
              }),
            },
          },
        }),
      ],
    });

    const bundle = makeBundle(config[0], project);

    for (const file of bundle.files) {
      console.log(file.path);
      console.log("\n---------------- FILE START ----------------\n");
      console.log(file.content.getFullText());
      console.log("\n---------------- FILE END ----------------\n");
    }
  });
});
