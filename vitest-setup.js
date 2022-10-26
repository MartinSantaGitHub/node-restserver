import { vi } from "vitest";

vi.mock("./models/user.js", () => {
    const User = { findOne: vi.fn().mockResolvedValue({}) };

    return { User };
});
