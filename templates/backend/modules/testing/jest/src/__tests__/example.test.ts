describe('Example Test Suite', () => {
    describe('Math operations', () => {
        it('should add numbers correctly', () => {
            expect(1 + 1).toBe(2);
        });

        it('should multiply numbers correctly', () => {
            expect(3 * 4).toBe(12);
        });
    });

    describe('String operations', () => {
        it('should concatenate strings', () => {
            expect('Hello' + ' ' + 'World').toBe('Hello World');
        });
    });

    // Example async test
    describe('Async operations', () => {
        it('should resolve promise', async () => {
            const promise = Promise.resolve('success');
            await expect(promise).resolves.toBe('success');
        });
    });
});
