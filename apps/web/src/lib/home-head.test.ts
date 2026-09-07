import { expect, test } from "bun:test";
import { homeHead } from "./home-head";
test("homepage metadata identifies the implant practice and its service area", () => {
  const head = homeHead();
  expect(head.meta).toContainEqual({ title: "Roots Dental Implant Center | Oregon & Washington" });
  expect(head.meta.find((meta) => meta.name === "description")?.content).toContain("Vancouver");
});
