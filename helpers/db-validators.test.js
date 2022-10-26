import { isEmail } from "./db-validators.js";
import { User } from "../models/user";
import { expect } from "vitest";

describe("db-validators", () => {
    it("should throw -> isEmail", () => {
        const result = async () => await isEmail("test@test.com");

        expect(result).rejects.toThrow();
    });

    it("should not throw -> isEmail", () => {
        User.findOne.mockImplementation(async () => undefined);

        const result = async () => await isEmail("test@test.com");

        expect(result).not.toThrow();
    });
});
