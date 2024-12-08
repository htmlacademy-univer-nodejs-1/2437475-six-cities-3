export interface EntityService {
  findById(id: string): Promise<any>;
}
