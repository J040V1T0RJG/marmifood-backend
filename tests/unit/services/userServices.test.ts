import * as userService from "../../../src/services/userService";
import * as userRepository from "../../../src/repositories/userRepository";
import bcrypt from "bcrypt";
import { userFactory } from "../../factories/userFactory";
import { unauthorizedError, conflictError } from "../../../src/utils/errorUtils";

describe("User services unit tests", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllMocks();
    });

    it("Login to the service, test passing valid data", async () => {
        const user = userFactory.userFactoryToLogin();

        jest.spyOn(userRepository, "findUserByEmail").mockResolvedValue({
            id: "iduuid",
            ...user
        });
        jest.spyOn(bcrypt, "compareSync").mockImplementationOnce((): any => {return true});

        const promise = await userService.login(user);

        expect(promise).toBeTruthy();
    });

    it("Login to the service, test so that it does not allow a non-existing user to login", async () => {
        const user = userFactory.userFactoryToLogin();

        jest.spyOn(userRepository, "findUserByEmail").mockResolvedValue(null);
        jest.spyOn(bcrypt, "compareSync").mockImplementationOnce((): any => {return true});

        const promise = userService.login(user);

        expect(promise).rejects.toEqual(unauthorizedError("Invalid credentials"));
        expect(bcrypt.compareSync).not.toBeCalled();
    });

    it("Login to the service, test so that it does not allow you to login with an invalid password", () => {
        const user = userFactory.userFactoryToLogin();

        jest.spyOn(userRepository, "findUserByEmail").mockResolvedValue({
            id: "iduuid",
            ...user
        });
        jest.spyOn(bcrypt, "compareSync").mockImplementationOnce((): any => {return false});

        const promise = userService.login(user);

        expect(promise).rejects.toEqual(unauthorizedError("Invalid credentials"));
    });

    it("CreateUser to the service, create a new user", async () => {
        const user = userFactory.userFactoryToCreateUser();

        jest.spyOn(userRepository, "findUserByEmail").mockResolvedValue(null);
        jest.spyOn(userRepository, "insertUser").mockImplementation((): any => {});

        await userService.createUser(user);

        expect(userRepository.insertUser).toBeCalled();
    });

    it("CreateUser to the service, does not allow creating a duplicate user", () => {
        const user = userFactory.userFactoryToCreateUser();

        jest.spyOn(userRepository, "findUserByEmail").mockResolvedValue({
            id: "iduuid",
            ...user
        });
        jest.spyOn(userRepository, "insertUser").mockImplementationOnce((): any => {});

        const promise = userService.createUser(user);

        expect(promise).rejects.toEqual(conflictError("User already exist"));
        expect(userRepository.insertUser).not.toBeCalled();
    });
});