/**
 * Interface base para casos de uso
 * Garante que todos os use cases implementem o método execute
 */
export interface UseCaseInterface<Input = any, Output = any> {
    execute(input: Input): Promise<Output>;
}
