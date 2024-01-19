import { isTruthy } from "ts-istruthy";

describe('Foo test', () => {

    test('Did you know?', async () => {
        expect(isTruthy(true)).toBe(true);
    });

});