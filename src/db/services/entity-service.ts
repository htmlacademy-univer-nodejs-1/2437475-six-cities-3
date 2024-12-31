export interface EntityService<T> {
  findById(id: string): Promise<T | null>;
}
