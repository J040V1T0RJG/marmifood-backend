import { faker } from "@faker-js/faker";

const userFactoryToLogin = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    };
};

const userFactoryToCreateUser = () => {
    const password = faker.internet.password();

    return {
        email: faker.internet.email(),
        password: password,
        passwordConfirm: password
    };
}

export const userFactory = {
    userFactoryToLogin,
    userFactoryToCreateUser
};