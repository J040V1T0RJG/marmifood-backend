import { faker } from "@faker-js/faker";

const userFactoryToLogin = () => {
    return {
        email: faker.internet.email(),
        password: faker.internet.password()
    };
};

export const userFactory = {
    userFactoryToLogin
};