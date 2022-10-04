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

describe("Integration test of the '/sign-up' route", () => {
    it("Must login and receive token, test login passing valid data", async () => {
        const user = userFactory.userFactoryToCreateUser();

        await supertest(app).post("/sign-up").send(user);
        const result = await supertest(app).post("/sign-in").send({
            email: user.email, 
            password: user.password
        });

        const countData = Object.keys(result.body).length;

        expect(result.status).toBe(200);
        expect(result.body).toBeInstanceOf(Object);
        expect(countData).toBe(1)
    });

    it("Should return statusCode 422, if user request is not processed due to semantic errors", async () => {
        const user = {
            email: "invalidEmail",
            password: "randomPassword"
        };

        const result = await supertest(app).post("/sign-in").send(user);

        expect(result.status).toBe(422);
    });

    it("Should return statusCode 401, if email does not exist in databse", async () => {
        const user = userFactory.userFactoryToLogin();

        const result = await supertest(app).post("/sign-in").send(user);

        expect(result.status).toBe(401);
    });

    it("Should return statusCode 401, if password is incorrect", async () => {
        const user = userFactory.userFactoryToCreateUser();

        await supertest(app).post("/sign-up").send(user);
        const result = await supertest(app).post("/sign-in").send({
            email: user.email,
            password: "invalidPassword1234."
        });

        expect(result.status).toBe(401);
    });
});