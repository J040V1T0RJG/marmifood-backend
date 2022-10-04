import supertest from "supertest";
import app from "../../../src/app";
import { prisma } from "../../../src/config/database";
import * as userService from "../../../src/services/userService";
import { userFactory } from "../../factories/userFactory";

beforeEach(async () => {
    await userService.reset();
});

afterAll( async () => {
    await prisma.$disconnect();
});

describe("Integration test of the '/sign-in' route", () => {
    it("Must create user, test if creates user passing valid data", async () => {
        const user = userFactory.userFactoryToCreateUser();

        const result = await supertest(app).post("/sign-up").send(user);

        expect(result.status).toBe(201);
    });

    it("Should return statusCode 422, test if it creates user passing invalid data", async () => {
        const user = {
            email: "invalidEmail",
            password: "password",
            passwordConfirm: "differentPassword"
        };

        const result = await supertest(app).post("/sign-up").send(user);

        expect(result.status).toBe(422);
    });

    it("Should return statusCode 409, test if it creates duplicate user", async () => {
        const user = userFactory.userFactoryToCreateUser();

        await supertest(app).post("/sign-up").send(user);
        const result = await supertest(app).post("/sign-up").send(user);

        expect(result.status).toBe(409);
    });
});